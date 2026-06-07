# ABDS Developer Examples

## Initiating the Authorization Flow (JavaScript)

```javascript
function initiateABDSAuth(provider = 'anthropic') {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.ANTHROPIC_APP_CLIENT_ID,
    redirect_uri: 'https://yourapp.com/auth/callback',
    scope: 'ai.quota.delegate ai.quota.read',
    quota_cap: '100',
    quota_period: 'monthly',
    model_scope: 'claude-3-haiku-20240307',
    state: generateCSRFToken()
  });

  window.location.href = `https://auth.anthropic.com/oauth/authorize?${params}`;
}
```

## Handling the Callback (Next.js API Route)

```javascript
// app/api/auth/callback/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // Verify CSRF state
  if (!verifyCSRFToken(state)) {
    return Response.json({ error: 'Invalid state' }, { status: 400 });
  }

  // Exchange code for delegation token
  const tokenResponse = await fetch('https://auth.anthropic.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.ANTHROPIC_APP_CLIENT_ID,
      client_secret: process.env.ANTHROPIC_APP_CLIENT_SECRET,
      redirect_uri: 'https://yourapp.com/auth/callback'
    })
  });

  const { access_token, expires_in } = await tokenResponse.json();

  // Store token server-side against user session
  await db.users.update({
    where: { id: session.userId },
    data: { 
      anthropic_delegation_token: access_token,
      anthropic_token_expires: new Date(Date.now() + expires_in * 1000)
    }
  });

  return Response.redirect('/app');
}
```

## Making API Calls with Delegation Token (Backend)

```javascript
// Never expose the delegation token to the client
// All AI calls go through your backend

async function callAI(userId, userMessage) {
  const user = await db.users.findUnique({ where: { id: userId } });
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Use delegation token instead of your own API key
      'Authorization': `Bearer ${user.anthropic_delegation_token}`
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{ role: 'user', content: userMessage }]
    })
  });

  // Handle quota exhaustion
  if (response.status === 429) {
    const isQuotaExceeded = response.headers.get('X-ABDS-Quota-Exceeded');
    if (isQuotaExceeded) {
      throw new Error('ABDS_QUOTA_EXCEEDED');
    }
  }

  return response.json();
}
```

## Checking Quota Before Calling (React Native)

```javascript
// Show quota status in your app UI
async function getQuotaStatus(userId) {
  // Call your backend, never the AI provider directly from client
  const response = await fetch('/api/quota-status', {
    headers: { Authorization: `Bearer ${userJWT}` }
  });
  
  const { quota_cap, quota_used, quota_remaining, quota_reset } = await response.json();
  
  return {
    used: quota_used,
    cap: quota_cap,
    remaining: quota_remaining,
    resetDate: new Date(quota_reset),
    percentUsed: Math.round((quota_used / quota_cap) * 100)
  };
}
```

## Handling Revocation Gracefully

```javascript
async function makeAICall(userId, message) {
  try {
    return await callAI(userId, message);
  } catch (error) {
    if (error.code === 'abds_token_revoked') {
      // Clear stored token, prompt re-authorization
      await db.users.update({
        where: { id: userId },
        data: { anthropic_delegation_token: null }
      });
      return { requiresReauth: true };
    }
    if (error.message === 'ABDS_QUOTA_EXCEEDED') {
      return { quotaExceeded: true, upgradeUrl: 'https://anthropic.com/account/apps' };
    }
    throw error;
  }
}
```

## Supabase Edge Function Pattern (For Mobile Apps)

```typescript
// supabase/functions/ai-proxy/index.ts
import { createClient } from '@supabase/supabase-js';

Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization');
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);
  
  // Verify the user's JWT
  const { data: { user } } = await supabase.auth.getUser(authHeader?.replace('Bearer ', '') ?? '');
  if (!user) return new Response('Unauthorized', { status: 401 });

  // Get user's delegation token from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('anthropic_delegation_token')
    .eq('id', user.id)
    .single();

  if (!profile?.anthropic_delegation_token) {
    return new Response(JSON.stringify({ requiresAuth: true }), { status: 402 });
  }

  const body = await req.json();

  // Forward to Anthropic using user's delegation token
  const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${profile.anthropic_delegation_token}`
    },
    body: JSON.stringify(body)
  });

  return new Response(anthropicResponse.body, {
    headers: { 'Content-Type': 'application/json' }
  });
});
```
