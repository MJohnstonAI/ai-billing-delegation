const fs = require('fs');
const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Marc Johnston, NeuroSync AI Dynamics Pty Ltd';
pptx.subject = 'AI Billing Delegation Standard v0.5';
pptx.title = 'ABDS v0.5 Executive and Technical Brief';
pptx.company = 'NeuroSync AI Dynamics Pty Ltd';
pptx.lang = 'en-US';
pptx.theme = { headFontFace: 'Arial', bodyFontFace: 'Arial', lang: 'en-US' };

pptx.defineSlideMaster({
  title: 'MASTER',
  background: { color: '07111F' },
  objects: [
    { line: { x: 0.55, y: 7.12, w: 12.2, h: 0, line: { color: '1E3A5F', width: 1 } } },
    { text: { text: 'AI Billing Delegation Standard (ABDS) - Draft v0.5', options: { x: 0.6, y: 7.16, w: 8.8, h: 0.2, fontFace: 'Arial', fontSize: 7.5, color: '6F8AAA', margin: 0 } } },
    { text: { text: 'NeuroSync AI Dynamics Pty Ltd', options: { x: 9.5, y: 7.16, w: 3.2, h: 0.2, align: 'right', fontFace: 'Arial', fontSize: 7.5, color: '6F8AAA', margin: 0 } } }
  ],
  slideNumber: { x: 12.7, y: 7.16, color: '6F8AAA', fontFace: 'Arial', fontSize: 7.5 }
});

const C = { bg:'07111F', panel:'0D1B2D', panel2:'10243A', cyan:'35D0E6', blue:'5D8CFF', green:'52D273', amber:'FFBE55', red:'FF6B6B', white:'F5F8FC', text:'D8E3F0', muted:'8FA7C0', line:'244763' };
const S = pptx.ShapeType;

function addTitle(slide, title, subtitle) {
  slide.addText(title, { x:0.65, y:0.42, w:12.0, h:0.55, fontFace:'Arial', fontSize:25, bold:true, color:C.white, margin:0 });
  if (subtitle) slide.addText(subtitle, { x:0.67, y:1.02, w:11.8, h:0.36, fontFace:'Arial', fontSize:11.5, color:C.muted, margin:0 });
}
function card(slide,x,y,w,h,title,body,accent=C.cyan) {
  slide.addShape(S.roundRect,{x,y,w,h,rectRadius:0.08,fill:{color:C.panel},line:{color:C.line,width:1}});
  slide.addShape(S.rect,{x,y,w:0.07,h,fill:{color:accent},line:{color:accent}});
  slide.addText(title,{x:x+0.22,y:y+0.16,w:w-0.35,h:0.32,fontSize:13,bold:true,color:C.white,margin:0});
  slide.addText(body,{x:x+0.22,y:y+0.55,w:w-0.38,h:h-0.7,fontSize:10.4,color:C.text,margin:0.02,fit:'shrink',valign:'top'});
}
function pill(slide,x,y,w,text,color=C.blue) {
  slide.addShape(S.roundRect,{x,y,w,h:0.36,rectRadius:0.08,fill:{color},line:{color}});
  slide.addText(text,{x:x+0.08,y:y+0.075,w:w-0.16,h:0.18,fontSize:8.7,bold:true,color:'FFFFFF',align:'center',margin:0});
}
function arrow(slide,x1,y1,x2,y2,color=C.cyan,width=2) {
  slide.addShape(S.line,{x:x1,y:y1,w:x2-x1,h:y2-y1,line:{color,width,endArrowType:'triangle'}});
}
function box(slide,x,y,w,h,text,color=C.panel2,border=C.line,fontSize=11) {
  slide.addShape(S.roundRect,{x,y,w,h,rectRadius:0.07,fill:{color},line:{color:border,width:1.2}});
  slide.addText(text,{x:x+0.1,y:y+0.12,w:w-0.2,h:h-0.2,fontSize,bold:true,color:C.white,align:'center',valign:'mid',margin:0.02,fit:'shrink'});
}

{
  const s=pptx.addSlide('MASTER');
  s.background={color:C.bg};
  s.addShape(S.rect,{x:0,y:0,w:13.333,h:7.5,fill:{color:C.bg},line:{color:C.bg}});
  s.addShape(S.ellipse,{x:8.85,y:0.05,w:4.35,h:4.35,fill:{color:'0B2940',transparency:15},line:{color:'0B2940',transparency:100}});
  s.addShape(S.ellipse,{x:9.55,y:0.35,w:3.4,h:3.4,fill:{color:'123D58',transparency:25},line:{color:'123D58',transparency:100}});
  s.addText('AI BILLING\nDELEGATION STANDARD',{x:0.8,y:1.05,w:7.6,h:1.65,fontSize:35,bold:true,color:C.white,margin:0,fit:'shrink'});
  s.addText('ABDS v0.5',{x:0.82,y:2.93,w:3.5,h:0.62,fontSize:25,bold:true,color:C.cyan,margin:0});
  s.addText('Provider-enforced funding, usage attribution,\nand settlement for third-party AI applications',{x:0.83,y:3.72,w:7.0,h:0.85,fontSize:16,color:C.text,margin:0});
  pill(s,0.83,4.88,1.75,'OAuth-aligned',C.blue);
  pill(s,2.75,4.88,1.88,'Payer-neutral',C.green);
  pill(s,4.80,4.88,2.22,'Append-only events',C.amber);
  s.addText('Executive & Technical Brief',{x:0.83,y:5.62,w:4.5,h:0.35,fontSize:12,bold:true,color:C.muted,margin:0});
  box(s,9.25,1.18,2.65,0.68,'Delegated AI Grant',C.panel2,C.cyan,13);
  box(s,9.25,2.27,2.65,0.68,'Execution Token',C.panel2,C.blue,13);
  box(s,8.28,3.48,2.24,0.8,'Usage Event Plane',C.panel2,C.green,12);
  box(s,10.63,3.48,2.24,0.8,'Ledger Event Plane',C.panel2,C.amber,12);
  arrow(s,10.58,1.86,10.58,2.25,C.cyan,2);
  arrow(s,10.58,2.96,9.42,3.46,C.blue,2);
  arrow(s,10.58,2.96,11.75,3.46,C.blue,2);
}

{
  const s=pptx.addSlide('MASTER'); addTitle(s,'Why ABDS needed a v0.5 upgrade','The authorization core was necessary - but not sufficient for production cost control.');
  card(s,0.65,1.55,3.85,2.0,'Legacy gap 1 - Invoice opacity','A Provider invoice cannot explain which user, workspace, feature, workflow, agent step, route, retry, or model attempt caused the cost.',C.red);
  card(s,4.75,1.55,3.85,2.0,'Legacy gap 2 - Variable cost','Streaming, multimodal, batch and agentic operations do not have a reliable final cost when the request begins.',C.amber);
  card(s,8.85,1.55,3.85,2.0,'Legacy gap 3 - Hidden retries','One logical action may trigger several billable physical attempts through retries, fallback, routing or safety calls.',C.blue);
  s.addText('v0.5 adds the missing operational layer',{x:0.7,y:4.02,w:5.8,h:0.45,fontSize:19,bold:true,color:C.white,margin:0});
  const items=[['One immutable event per physical attempt',C.green],['Separate technical usage and economic ledger events',C.cyan],['Requested vs resolved model and route attribution',C.blue],['Estimate - reserve - execute - settle - release',C.amber],['Idempotency, reconciliation and compensating adjustments',C.red]];
  items.forEach((it,i)=>{s.addShape(S.ellipse,{x:0.85,y:4.65+i*0.39,w:0.16,h:0.16,fill:{color:it[1]},line:{color:it[1]}});s.addText(it[0],{x:1.12,y:4.59+i*0.39,w:6.0,h:0.27,fontSize:11.2,color:C.text,margin:0});});
  box(s,8.0,4.35,4.55,1.55,'From “who may spend?”\nto\n“who spent, why, where, and how was it settled?”',C.panel2,C.cyan,15);
}

{
  const s=pptx.addSlide('MASTER'); addTitle(s,'Payer-neutral authorization core','The funding party can differ from the person using the application.');
  const sources=[['User\nEntitlement',C.blue],['Organization\nBudget',C.cyan],['Sponsor\nBudget',C.green],['Provider\nPromotion',C.amber],['Developer\nAccount',C.red]];
  sources.forEach((v,i)=>box(s,0.5+i*2.52,1.55,2.15,0.85,v[0],C.panel2,v[1],12));
  box(s,4.45,3.13,4.4,0.85,'Provider-maintained Delegated AI Grant',C.panel2,C.cyan,16);
  box(s,4.85,4.47,3.6,0.75,'Short-lived Execution Token',C.panel2,C.blue,15);
  box(s,4.45,5.67,4.4,0.78,'Provider Execution',C.panel2,C.green,16);
  sources.forEach((v,i)=>arrow(s,1.58+i*2.52,2.40,6.65,3.10,v[1],1.5));
  arrow(s,6.65,3.98,6.65,4.44,C.cyan,2.2); arrow(s,6.65,5.23,6.65,5.64,C.blue,2.2);
  card(s,9.35,3.05,3.35,3.45,'Non-negotiable safeguards','• Mutable quota and settlement state stay Provider-side.\n\n• The payer cannot change silently.\n\n• Funding never implies access to prompts, outputs, files or identity.\n\n• The token can only narrow - never expand - the grant.',C.green);
}

{
  const s=pptx.addSlide('MASTER'); addTitle(s,'The v0.5 two-plane architecture','Technical facts and economic mutations have different trust, privacy and correction requirements.');
  box(s,5.02,1.45,3.28,0.76,'Provider Execution',C.panel2,C.white,17);
  arrow(s,6.0,2.25,3.25,3.0,C.green,2.5); arrow(s,7.3,2.25,10.05,3.0,C.amber,2.5);
  card(s,0.7,3.0,5.25,3.32,'USAGE EVENT PLANE','What technically happened\n\n• logical request + physical attempt\n• requested and resolved model\n• Provider route, retry and outcome\n• tokens, modalities, tools and latency\n• optional workspace / workflow / agent refs\n\nOne immutable event per billable attempt.',C.green);
  card(s,7.38,3.0,5.25,3.32,'ECONOMIC LEDGER PLANE','What happened economically\n\n• reservation created\n• settlement posted\n• unused quantity released\n• reservation expired\n• execution denied\n• compensating adjustment\n\nProvider-authoritative and idempotent.',C.amber);
  s.addText('Client labels help explain product behavior, but cannot change the payer or billed quantity.',{x:2.0,y:6.55,w:9.3,h:0.3,fontSize:11,bold:true,color:C.cyan,align:'center',margin:0});
}

{
  const s=pptx.addSlide('MASTER'); addTitle(s,'Attribution hierarchy and retry visibility','One user action can create several real executions - every billable attempt remains visible.');
  const labels=['Funding source','Delegated grant','Client','Beneficiary / workspace','Logical request - req_88','Workflow / feature','Agent run','Agent step'];
  labels.forEach((t,i)=>{const x=0.72+i*0.36, y=1.42+i*0.58;box(s,x,y,3.55,0.45,t,C.panel2,(i%2?C.blue:C.cyan),10.2);if(i<labels.length-1) arrow(s,x+1.78,y+0.45,x+2.14,y+0.57,C.muted,1.1);});
  const sourceX=0.72+7*0.36+3.55, sourceY=1.42+7*0.58+0.23;
  box(s,7.05,1.72,2.25,0.68,'Attempt 1\nPrimary timeout',C.panel2,C.red,11);
  box(s,10.05,1.72,2.25,0.68,'Attempt 2\nRetry partial failure',C.panel2,C.amber,11);
  box(s,8.55,3.15,2.25,0.68,'Attempt 3\nFallback completed',C.panel2,C.green,11);
  arrow(s,sourceX,sourceY,7.05,2.05,C.blue,1.6); arrow(s,sourceX,sourceY,10.05,2.05,C.blue,1.6); arrow(s,sourceX,sourceY,8.55,3.48,C.blue,1.6);
  card(s,7.05,4.45,5.25,1.55,'Why this matters','The final successful answer must not conceal failed or superseded attempts. Cost, latency and compatibility become traceable to product behavior.',C.cyan);
  pill(s,7.05,6.25,1.65,'One logical request',C.blue); pill(s,8.90,6.25,1.86,'Several attempts',C.amber); pill(s,10.96,6.25,1.34,'One audit trail',C.green);
}

{
  const s=pptx.addSlide('MASTER'); addTitle(s,'Reservation and settlement','Variable-cost execution is bounded before work begins and reconciled after usage is known.');
  const steps=[['Authorize',C.blue],['Estimate',C.cyan],['Reserve',C.amber],['Execute',C.green],['Settle',C.blue],['Release',C.cyan]];
  steps.forEach((v,i)=>{box(s,0.55+i*2.08,1.55,1.65,0.68,v[0],C.panel2,v[1],12); if(i<steps.length-1)arrow(s,2.2+i*2.08,1.89,2.58+i*2.08,1.89,C.muted,1.5);});
  card(s,0.75,2.75,3.75,2.62,'Reservation','A temporary atomic hold bound to one grant, Client, logical request, unit type and funding bucket. It prevents concurrent overspend.',C.amber);
  card(s,4.82,2.75,3.75,2.62,'Settlement','The final idempotent debit uses Provider-measured usage and references every billable Usage Event.',C.blue);
  card(s,8.89,2.75,3.75,2.62,'Finalization','One reservation has one terminal finalization. Unused quantity is released inside settlement or through full release when no settlement occurs.',C.green);
  s.addText('Accounting invariants',{x:0.78,y:5.72,w:2.4,h:0.32,fontSize:14,bold:true,color:C.white,margin:0});
  s.addText('• one settlement ID accepted once   • settled + released <= reserved   • corrections use new adjustment events   • historical price snapshot retained',{x:0.78,y:6.12,w:11.7,h:0.48,fontSize:10.5,color:C.text,margin:0,fit:'shrink'});
}

{
  const s=pptx.addSlide('MASTER'); addTitle(s,'Privacy and security boundaries','Economic sponsorship, operational observability and user content are separate permissions.');
  box(s,0.72,1.55,2.25,0.72,'Resource User',C.panel2,C.blue,14); box(s,5.55,1.55,2.25,0.72,'AI Provider',C.panel2,C.cyan,14); box(s,10.35,1.55,2.25,0.72,'Sponsor',C.panel2,C.green,14); box(s,0.72,4.75,2.25,0.72,'Consumer App',C.panel2,C.amber,14);
  arrow(s,2.98,1.9,5.52,1.9,C.blue,2); arrow(s,7.82,1.9,10.32,1.9,C.green,2); arrow(s,2.0,4.72,5.55,2.25,C.amber,2); arrow(s,5.55,2.27,2.95,4.73,C.cyan,2);
  s.addText('bounded authorization',{x:3.35,y:1.55,w:1.8,h:0.22,fontSize:9,color:C.muted,align:'center',margin:0});
  s.addText('aggregate reporting only',{x:8.05,y:1.55,w:2.1,h:0.22,fontSize:9,color:C.muted,align:'center',margin:0});
  card(s,5.05,3.05,3.3,2.35,'Provider safeguards','• PKCE and exact redirects\n• short-lived tokens\n• atomic limits and idempotency\n• immediate revocation\n• replay-protected event delivery\n• quota-laundering detection',C.cyan);
  card(s,9.12,3.05,3.5,2.35,'Sponsor cannot receive by default','Prompts, outputs, files, conversations, raw identity, workspace names, Client internal labels or confidential pool balances.',C.red);
  s.addText('Funding does not create a data-access right.',{x:4.2,y:6.15,w:5.0,h:0.38,fontSize:16,bold:true,color:C.green,align:'center',margin:0});
}

{
  const s=pptx.addSlide('MASTER'); addTitle(s,'Current status and next proof point','v0.5 is a synchronized draft proposal - not yet a Provider-adopted standard.');
  card(s,0.68,1.45,3.72,3.95,'COMPLETED IN v0.5','✓ canonical specification\n✓ usage and ledger event profiles\n✓ reservation and settlement\n✓ JSON Schemas and examples\n✓ automated validation\n✓ discovery and implementation profiles\n✓ expanded threat model\n✓ synchronized diagrams and change control',C.green);
  card(s,4.75,1.45,3.72,3.95,'NEXT - v0.6','• ABDS Studio simulator\n• mock Authorization and Resource Servers\n• grant and ledger service\n• positive and negative test vectors\n• retry, fallback and idempotency tests\n• Sponsor privacy tests\n• machine-readable conformance report',C.cyan);
  card(s,8.82,1.45,3.72,3.95,'REVIEW NEEDED','• AI Provider platform engineers\n• OAuth and identity experts\n• billing and accounting architects\n• security and abuse specialists\n• privacy experts\n• consumer AI developers\n• Sponsor / nonprofit operators',C.amber);
  s.addText('Can an AI Provider enforce bounded third-party usage in a way that is auditable, payer-safe, privacy-preserving and interoperable?',{x:0.75,y:6.05,w:11.85,h:0.65,fontSize:17,bold:true,color:C.cyan,align:'center',margin:0,fit:'shrink'});
}

fs.mkdirSync('docs', { recursive: true });
pptx.writeFile({ fileName: 'docs/ABDS_executive_technical_brief.pptx' })
  .then(() => console.log('Generated docs/ABDS_executive_technical_brief.pptx'))
  .catch((error) => { console.error(error); process.exit(1); });
