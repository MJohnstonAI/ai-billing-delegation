const fs = require('fs');
const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Marc Johnston, NeuroSync AI Dynamics Pty Ltd';
pptx.subject = 'Artificial Intelligence Billing Delegation Standard v0.6';
pptx.title = 'ABDS v0.6 Executive and Technical Brief';
pptx.company = 'NeuroSync AI Dynamics Pty Ltd';
pptx.lang = 'en-US';
pptx.theme = { headFontFace: 'Arial', bodyFontFace: 'Arial', lang: 'en-US' };

const C = {
  bg: '07111F', panel: '0D1B2D', panel2: '10243A', cyan: '35D0E6',
  blue: '5D8CFF', green: '52D273', amber: 'FFBE55', red: 'FF6B6B',
  white: 'F5F8FC', text: 'D8E3F0', muted: '8FA7C0', line: '244763'
};
const S = pptx.ShapeType;

pptx.defineSlideMaster({
  title: 'MASTER',
  background: { color: C.bg },
  objects: [
    { line: { x: 0.55, y: 7.12, w: 12.2, h: 0, line: { color: '1E3A5F', width: 1 } } },
    { text: { text: 'Artificial Intelligence Billing Delegation Standard (ABDS) - Draft v0.6',
      options: { x: 0.6, y: 7.16, w: 9.0, h: 0.2, fontFace: 'Arial', fontSize: 7.5, color: '6F8AAA', margin: 0 } } },
    { text: { text: 'NeuroSync AI Dynamics Pty Ltd',
      options: { x: 9.5, y: 7.16, w: 3.2, h: 0.2, align: 'right', fontFace: 'Arial', fontSize: 7.5, color: '6F8AAA', margin: 0 } } }
  ],
  slideNumber: { x: 12.7, y: 7.16, color: '6F8AAA', fontFace: 'Arial', fontSize: 7.5 }
});

function title(slide, heading, subheading) {
  slide.addText(heading, { x: 0.65, y: 0.42, w: 12.0, h: 0.55, fontSize: 25, bold: true, color: C.white, margin: 0 });
  if (subheading) slide.addText(subheading, { x: 0.67, y: 1.02, w: 11.8, h: 0.34, fontSize: 11.5, color: C.muted, margin: 0 });
}

function box(slide, x, y, w, h, text, border = C.cyan, fontSize = 12) {
  slide.addShape(S.roundRect, { x, y, w, h, rectRadius: 0.06, fill: { color: C.panel2 }, line: { color: border, width: 1.3 } });
  slide.addText(text, { x: x + 0.1, y: y + 0.08, w: w - 0.2, h: h - 0.16, fontSize, bold: true, color: C.white, align: 'center', valign: 'mid', margin: 0.02, fit: 'shrink' });
}

function card(slide, x, y, w, h, heading, body, accent = C.cyan) {
  slide.addShape(S.roundRect, { x, y, w, h, rectRadius: 0.06, fill: { color: C.panel }, line: { color: C.line, width: 1 } });
  slide.addShape(S.rect, { x, y, w: 0.07, h, fill: { color: accent }, line: { color: accent } });
  slide.addText(heading, { x: x + 0.22, y: y + 0.16, w: w - 0.35, h: 0.32, fontSize: 13, bold: true, color: C.white, margin: 0 });
  slide.addText(body, { x: x + 0.22, y: y + 0.56, w: w - 0.4, h: h - 0.72, fontSize: 10.3, color: C.text, margin: 0.02, fit: 'shrink', valign: 'top' });
}

function arrow(slide, x1, y1, x2, y2, color = C.cyan, width = 2) {
  slide.addShape(S.line, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color, width, endArrowType: 'triangle' } });
}

function pill(slide, x, y, w, text, color) {
  slide.addShape(S.roundRect, { x, y, w, h: 0.36, rectRadius: 0.08, fill: { color }, line: { color } });
  slide.addText(text, { x: x + 0.08, y: y + 0.075, w: w - 0.16, h: 0.18, fontSize: 8.7, bold: true, color: 'FFFFFF', align: 'center', margin: 0 });
}

{
  const s = pptx.addSlide('MASTER');
  s.addShape(S.ellipse, { x: 8.9, y: 0.2, w: 4.0, h: 4.0, fill: { color: '0B2940', transparency: 12 }, line: { color: '0B2940', transparency: 100 } });
  s.addText('ARTIFICIAL INTELLIGENCE\nBILLING DELEGATION STANDARD', { x: 0.8, y: 1.0, w: 7.7, h: 1.7, fontSize: 32, bold: true, color: C.white, margin: 0, fit: 'shrink' });
  s.addText('ABDS v0.6', { x: 0.82, y: 2.95, w: 3.7, h: 0.62, fontSize: 25, bold: true, color: C.cyan, margin: 0 });
  s.addText('Provider-enforced funding, consent receipts,\nusage evidence, reconciliation, and settlement', { x: 0.83, y: 3.72, w: 7.3, h: 0.9, fontSize: 16, color: C.text, margin: 0 });
  pill(s, 0.83, 4.9, 1.7, 'OAuth-aligned', C.blue);
  pill(s, 2.72, 4.9, 1.8, 'Payer-neutral', C.green);
  pill(s, 4.72, 4.9, 2.2, 'Append-only audit', C.amber);
  box(s, 9.15, 1.15, 2.9, 0.68, 'Consent Receipt', C.cyan, 13);
  box(s, 9.15, 2.22, 2.9, 0.68, 'Delegated AI Grant', C.blue, 13);
  box(s, 9.15, 3.29, 2.9, 0.68, 'Execution Token', C.green, 13);
  box(s, 8.25, 4.55, 2.3, 0.75, 'Usage Evidence', C.cyan, 12);
  box(s, 10.75, 4.55, 2.3, 0.75, 'Economic Ledger', C.amber, 12);
  arrow(s, 10.6, 1.83, 10.6, 2.2);
  arrow(s, 10.6, 2.9, 10.6, 3.27, C.blue);
  arrow(s, 10.6, 3.97, 9.4, 4.53, C.green);
  arrow(s, 10.6, 3.97, 11.9, 4.53, C.green);
}

{
  const s = pptx.addSlide('MASTER'); title(s, 'From authorization to trustworthy accounting', 'v0.6 is a narrow trust extension of the v0.5 accounting architecture.');
  card(s, 0.65, 1.55, 3.85, 2.0, 'v0.4 - Who may fund?', 'Payer-neutral roles, Sponsor funding, structured economic authorization, privacy, and no silent payer substitution.', C.blue);
  card(s, 4.75, 1.55, 3.85, 2.0, 'v0.5 - What happened?', 'One event per physical attempt, separate Ledger Events, retries and fallback, reservation, settlement, and adjustment.', C.green);
  card(s, 8.85, 1.55, 3.85, 2.0, 'v0.6 - What proves it?', 'Consent Receipts, evidence classes, scoped ordering, Provider reconciliation, replay control, and negative tests.', C.amber);
  box(s, 1.0, 4.35, 3.0, 0.72, 'Grant + Token', C.blue, 14);
  arrow(s, 4.05, 4.71, 5.0, 4.71, C.muted);
  box(s, 5.05, 4.35, 3.0, 0.72, 'Usage + Ledger Events', C.green, 14);
  arrow(s, 8.1, 4.71, 9.05, 4.71, C.muted);
  box(s, 9.1, 4.35, 3.0, 0.72, 'Evidence + Reconciliation', C.amber, 14);
  s.addText('Existing v0.5 schema identifiers remain unchanged.', { x: 3.3, y: 5.65, w: 6.8, h: 0.4, fontSize: 14, bold: true, color: C.cyan, align: 'center', margin: 0 });
}

{
  const s = pptx.addSlide('MASTER'); title(s, 'The v0.6 trust chain', 'Each object answers a different authorization, execution, evidence, or accounting question.');
  const labels = [
    ['Consent\nReceipt', C.cyan], ['Delegated\nAI Grant', C.blue], ['Short-lived\nToken', C.green], ['Provider\nExecution', C.white],
    ['Usage\nEvent', C.cyan], ['Evidence\nProvenance', C.green], ['Reconciliation', C.amber], ['Ledger\nSettlement', C.blue]
  ];
  labels.forEach((item, i) => {
    const x = 0.35 + i * 1.58;
    box(s, x, 2.1, 1.35, 0.88, item[0], item[1], 11);
    if (i < labels.length - 1) arrow(s, x + 1.35, 2.54, x + 1.55, 2.54, C.muted, 1.5);
  });
  card(s, 0.7, 3.65, 3.75, 2.2, 'Authorization boundary', 'Receipt: what was approved.\nGrant: current Provider policy.\nToken: short-lived execution authority.\n\nMutable balances never live in bearer claims.', C.blue);
  card(s, 4.8, 3.65, 3.75, 2.2, 'Evidence boundary', 'Usage Event: what occurred.\nEvidence class: who asserts it.\n\nGateway observations remain provisional until Provider evidence is available.', C.green);
  card(s, 8.9, 3.65, 3.75, 2.2, 'Economic boundary', 'Reservation and settlement remain Provider-authoritative.\n\nLate differences create reconciliation and compensating adjustments - not rewritten history.', C.amber);
}

{
  const s = pptx.addSlide('MASTER'); title(s, 'Three evidence classes', 'Authority must be explicit rather than inferred from where an event was stored.');
  card(s, 0.65, 1.55, 3.85, 3.25, 'PROVIDER-SIGNED', 'Provider event, settlement receipt, or verifiable batch manifest.\n\nPreferred provider-native target.\n\nBinds issuer, Provider request/event IDs, digest, key ID, signature format, signature, and time.', C.green);
  card(s, 4.75, 1.55, 3.85, 3.25, 'PROVIDER-REPORTED', 'Authenticated Provider API response, usage endpoint, export, or billing record.\n\nProvider evidence without a native ABDS signature.\n\nPreserve Provider request and billing references.', C.blue);
  card(s, 8.85, 1.55, 3.85, 3.25, 'GATEWAY-ATTESTED', 'Gateway estimate or locally observed response.\n\nUseful for current APIs, but provisional.\n\nMust not be represented as Provider-authoritative evidence.', C.amber);
  s.addText('estimated  ->  gateway observed  ->  Provider reported  ->  reconciled  ->  final', { x: 1.0, y: 5.55, w: 11.3, h: 0.5, fontSize: 17, bold: true, color: C.cyan, align: 'center', margin: 0 });
}

{
  const s = pptx.addSlide('MASTER'); title(s, 'Consent Receipts make approval auditable', 'The current grant state is not enough to prove what was approved earlier.');
  card(s, 0.65, 1.5, 4.0, 4.7, 'BOUND TERMS', '• Grant and Client\n• Beneficiary\n• Funding source and payer\n• Spend ceiling and period\n• Per-request ceiling\n• Model and operation scope\n• Enforceable workload scope\n• Overage and exhaustion\n• Effective and expiry times', C.cyan);
  card(s, 4.95, 1.5, 3.4, 4.7, 'PRIVACY', '• Sponsor reporting mode\n• Funding does not grant content access\n• Identity access is separate\n• Revocation path\n• Versioned policy\n• Immutable receipt digest\n• Optional Provider signature', C.green);
  box(s, 9.0, 1.7, 3.2, 0.72, 'Provider displays terms', C.blue, 13);
  arrow(s, 10.6, 2.42, 10.6, 2.85);
  box(s, 9.0, 2.88, 3.2, 0.72, 'User approves or reduces', C.cyan, 13);
  arrow(s, 10.6, 3.6, 10.6, 4.03);
  box(s, 9.0, 4.06, 3.2, 0.72, 'Receipt is issued', C.green, 13);
  arrow(s, 10.6, 4.78, 10.6, 5.21);
  box(s, 9.0, 5.24, 3.2, 0.72, 'Grant binds receipt', C.amber, 13);
}

{
  const s = pptx.addSlide('MASTER'); title(s, 'One reservation, many child events, one settlement', 'Failed attempts remain visible without creating duplicate charges.');
  box(s, 4.75, 1.35, 3.8, 0.72, 'Run-level Reservation', C.amber, 16);
  const attempts = [
    ['Agent step 1\nPrimary attempt', 0.75, C.red], ['Agent step 1\nRetry', 3.85, C.amber],
    ['Agent step 2\nFallback', 6.95, C.green], ['Tool / safety\nchild call', 10.05, C.blue]
  ];
  attempts.forEach((item) => {
    box(s, item[1], 3.0, 2.45, 0.85, item[0], item[2], 11);
    arrow(s, 6.65, 2.07, item[1] + 1.22, 2.96, item[2], 1.5);
  });
  attempts.forEach((item) => box(s, item[1] + 0.35, 4.35, 1.75, 0.62, 'Usage Event', item[2], 10));
  box(s, 4.75, 5.75, 3.8, 0.72, 'One Idempotent Settlement', C.cyan, 15);
  attempts.forEach((item) => arrow(s, item[1] + 1.22, 4.98, 6.65, 5.72, C.muted, 1.2));
  s.addText('Attribution is retained for both the Beneficiary and the registered Client that generated the workload.', { x: 1.0, y: 6.62, w: 11.3, h: 0.3, fontSize: 11.5, bold: true, color: C.cyan, align: 'center', margin: 0 });
}

{
  const s = pptx.addSlide('MASTER'); title(s, 'Late Provider usage is reconciled - never rewritten', 'Every variance is reproducible and idempotent.');
  box(s, 0.65, 2.0, 2.4, 0.82, 'Gateway event\n2.5 units', C.amber, 13);
  arrow(s, 3.05, 2.41, 4.05, 2.41, C.muted);
  box(s, 4.1, 2.0, 2.4, 0.82, 'Provider final\n3.0 units', C.green, 13);
  arrow(s, 6.5, 2.41, 7.5, 2.41, C.muted);
  box(s, 7.55, 2.0, 2.4, 0.82, 'Reconciliation\n+0.5 units', C.cyan, 13);
  arrow(s, 9.95, 2.41, 10.95, 2.41, C.muted);
  box(s, 11.0, 2.0, 1.7, 0.82, 'Adjustment', C.blue, 13);
  card(s, 0.8, 3.55, 3.65, 2.1, 'Invariant', 'adjustment quantity =\nProvider final - original\n\nZero variance means no economic change.', C.cyan);
  card(s, 4.85, 3.55, 3.65, 2.1, 'Preserved bindings', 'Grant, Client, request, unit type, funding bucket, Provider request ID, and original event reference.', C.green);
  card(s, 8.9, 3.55, 3.65, 2.1, 'Forbidden behavior', 'No historical rewrite.\nNo second settlement.\nNo silent payer switch.\nNo unmatched charge without investigation.', C.red);
}

{
  const s = pptx.addSlide('MASTER'); title(s, 'v0.6 deliverables and practical next step', 'The specification is ready for a mock provider-native reference application.');
  card(s, 0.65, 1.45, 3.85, 4.6, 'DELIVERED IN v0.6', '• Usage Event schema guide\n• Consent Receipt profile\n• Evidence and reconciliation profile\n• Three JSON Schemas\n• Four positive examples\n• Six negative fixtures\n• Replay, ordering, signature, binding, and adjustment validation\n• Updated discovery, threat model, profiles, diagrams, and change control', C.green);
  card(s, 4.75, 1.45, 3.85, 4.6, 'ABDS STUDIO v0.7', '• Mock Provider authorization\n• Sponsor and user consoles\n• Consent Receipt issuance\n• Run-level reservation\n• Physical attempt timeline\n• Provider-signed evidence\n• Gateway reconciliation\n• Settlement and adjustment\n• Revocation and exhaustion\n• NatureGuard reference scenario', C.cyan);
  card(s, 8.85, 1.45, 3.85, 4.6, 'REVIEW NEEDED', '• Production signature profile\n• Batch evidence and inclusion proofs\n• Minimum Consent Receipt core\n• Reconciliation windows\n• Invoice-level mapping\n• Provider economics\n• OAuth and security review\n• Privacy-safe Sponsor reporting\n\nDraft proposal - no Provider adoption claimed.', C.amber);
}

fs.mkdirSync('docs', { recursive: true });
pptx.writeFile({ fileName: 'docs/ABDS_executive_technical_brief.pptx' });
