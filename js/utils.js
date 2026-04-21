// ── UTILS ─────────────────────────────────────────────────────

async function callClaude(messages, system) {
  const body = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: messages
  };
  if (system) body.system = system;

  const res = await fetch('http://localhost:3000/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text;
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function switchTab(tab) {
  ['chat', 'flash', 'quiz', 'summary'].forEach(function(t) {
    document.getElementById('tab-'    + t).classList.toggle('active', t === tab);
    document.getElementById('header-' + t).style.display = t === tab ? 'flex' : 'none';
    document.getElementById('nav-'    + t).classList.toggle('active', t === tab);
  });
}
