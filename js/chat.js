// ── CHAT ──────────────────────────────────────────────────────

var chatHistory = [];
var loadingIdCounter = 0;

async function sendChat() {
  var input = document.getElementById('chatInput');
  var text = input.value.trim();
  if (!text) return;

  appendMsg('user', text);
  chatHistory.push({ role: 'user', content: text });
  input.value = '';

  var btn = document.getElementById('chatBtn');
  btn.disabled = true;
  btn.textContent = '…';

  var typingId = appendLoading();

  try {
    var reply = await callClaude(
      chatHistory,
      'Eres un tutor académico amigable y experto. Responde en español de forma clara, con ejemplos cuando sea útil. Usa emojis con moderación. Si el tema es complejo, divídelo en pasos simples.'
    );
    chatHistory.push({ role: 'assistant', content: reply });
    removeLoading(typingId);
    appendMsg('ai', reply);
  } catch (e) {
    removeLoading(typingId);
    appendMsg('ai', '⚠️ Error al conectar con la IA: ' + e.message);
  }

  btn.disabled = false;
  btn.textContent = 'Enviar ➤';
}

function clearChat() {
  chatHistory = [];
  document.getElementById('chatMessages').innerHTML =
    '<div class="msg ai"><div class="msg-avatar">🤖</div><div class="msg-bubble">Chat limpiado. ¡Empecemos de nuevo! ¿Qué quieres estudiar?</div></div>';
}

function appendMsg(role, text) {
  var div = document.createElement('div');
  div.className = 'msg ' + role;
  div.innerHTML =
    '<div class="msg-avatar">' + (role === 'user' ? '🧑' : '🤖') + '</div>' +
    '<div class="msg-bubble">' + escHtml(text) + '</div>';
  var msgs = document.getElementById('chatMessages');
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function appendLoading() {
  var id = 'load-' + (++loadingIdCounter);
  var div = document.createElement('div');
  div.className = 'msg ai';
  div.id = id;
  div.innerHTML =
    '<div class="msg-avatar">🤖</div>' +
    '<div class="msg-bubble loading"><div class="loading-dots"><span></span><span></span><span></span></div></div>';
  var msgs = document.getElementById('chatMessages');
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return id;
}

function removeLoading(id) {
  var el = document.getElementById(id);
  if (el) el.remove();
}
