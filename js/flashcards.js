// ── FLASHCARDS ────────────────────────────────────────────────

var flashCards = [];
var currentCard = 0;

async function generateFlash() {
  var topic = document.getElementById('flashInput').value.trim();
  var count = document.getElementById('flashCount').value;
  if (!topic) return alert('Escribe un tema primero');

  document.getElementById('flashBtn').disabled = true;
  document.getElementById('flashOutput').style.display = 'none';
  document.getElementById('flashLoading').style.display = 'flex';

  try {
    var raw = await callClaude(
      [{
        role: 'user',
        content: 'Crea exactamente ' + count + ' flashcards de estudio sobre: "' + topic + '". ' +
          'Responde SOLO con un array JSON, sin texto extra, sin backticks, con este formato: ' +
          '[{"q":"pregunta","a":"respuesta"},...] Las preguntas deben ser claras y concisas.'
      }],
      'Eres un generador de flashcards educativas. Responde SOLO con JSON válido, sin markdown, sin explicaciones.'
    );

    var clean = raw.replace(/```json|```/g, '').trim();
    flashCards = JSON.parse(clean);
    currentCard = 0;
    renderFlash();
  } catch (e) {
    alert('Error generando tarjetas: ' + e.message);
  }

  document.getElementById('flashBtn').disabled = false;
  document.getElementById('flashLoading').style.display = 'none';
}

function flipCard() {
  document.getElementById('flashCard').classList.toggle('flipped');
}

function nextCard() {
  if (currentCard < flashCards.length - 1) { currentCard++; renderFlash(); }
}

function prevCard() {
  if (currentCard > 0) { currentCard--; renderFlash(); }
}

function renderFlash() {
  if (!flashCards.length) return;

  var card = flashCards[currentCard];
  document.getElementById('cardFront').textContent = card.q;
  document.getElementById('cardBack').textContent  = card.a;
  document.getElementById('cardsCounter').textContent = (currentCard + 1) + ' / ' + flashCards.length;
  document.getElementById('flashCard').classList.remove('flipped');

  var grid = document.getElementById('cardsGrid');
  grid.innerHTML = '';
  flashCards.forEach(function(c, i) {
    var div = document.createElement('div');
    div.className = 'mini-card' + (i === currentCard ? ' current' : '');
    div.innerHTML = '<div class="mini-q">' + escHtml(c.q) + '</div><div class="mini-a">' + escHtml(c.a) + '</div>';
    div.onclick = (function(idx) { return function() { currentCard = idx; renderFlash(); }; })(i);
    grid.appendChild(div);
  });

  document.getElementById('flashOutput').style.display = 'block';
}
