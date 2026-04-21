// ── SUMMARY ───────────────────────────────────────────────────

var stylePrompts = {
  bullet:    'Resume el siguiente texto como una lista de puntos clave claros y concisos, usando •. Responde en español.',
  paragraph: 'Resume el siguiente texto en 2-3 párrafos concisos con lo más importante. Responde en español.',
  study:     'Crea una guía de estudio del siguiente texto con: conceptos clave, ideas principales y puntos a recordar. Usa formato claro con secciones. Responde en español.',
  explain:   'Explica el siguiente texto de forma muy simple, como si se lo explicaras a alguien de 12 años. Usa analogías y evita tecnicismos. Responde en español.'
};

async function generateSummary() {
  var text  = document.getElementById('summaryInput').value.trim();
  var style = document.getElementById('summaryStyle').value;
  if (!text) return alert('Pega un texto primero');

  document.getElementById('summaryBtn').disabled = true;
  document.getElementById('summaryLoading').style.display = 'flex';
  document.getElementById('summaryOutput').style.display  = 'none';

  try {
    var result = await callClaude(
      [{ role: 'user', content: stylePrompts[style] + '\n\n---\n' + text }],
      'Eres un experto en síntesis académica. Sé claro, útil y organizado.'
    );
    document.getElementById('summaryText').textContent = result;
    document.getElementById('summaryOutput').style.display = 'block';
  } catch (e) {
    alert('Error al resumir: ' + e.message);
  }

  document.getElementById('summaryBtn').disabled = false;
  document.getElementById('summaryLoading').style.display = 'none';
}

function copySummary() {
  var text = document.getElementById('summaryText').textContent;
  navigator.clipboard.writeText(text).then(function() {
    var btn = document.querySelector('#summaryOutput .btn-ghost');
    btn.textContent = '✅ Copiado!';
    setTimeout(function() { btn.textContent = '📋 Copiar'; }, 2000);
  });
}
