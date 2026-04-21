// ── QUIZ ──────────────────────────────────────────────────────

var quizQuestions = [];
var currentQ = 0;
var quizAnswers = [];

async function generateQuiz() {
  var topic = document.getElementById('quizInput').value.trim();
  var count = document.getElementById('quizCount').value;
  if (!topic) return alert('Escribe un tema primero');

  document.getElementById('quizBtn').disabled = true;
  document.getElementById('quizLoading').style.display = 'flex';
  document.getElementById('quizGame').style.display   = 'none';
  document.getElementById('quizResult').style.display = 'none';

  try {
    var raw = await callClaude(
      [{
        role: 'user',
        content: 'Crea exactamente ' + count + ' preguntas de opción múltiple sobre: "' + topic + '". ' +
          'Responde SOLO con un array JSON sin texto extra ni backticks: ' +
          '[{"q":"pregunta","opts":["A","B","C","D"],"correct":0}] ' +
          '"correct" es el índice (0-3) de la opción correcta.'
      }],
      'Eres un generador de quizzes educativos. Responde SOLO con JSON válido, sin markdown, sin explicaciones.'
    );

    var clean = raw.replace(/```json|```/g, '').trim();
    quizQuestions = JSON.parse(clean);
    quizAnswers = new Array(quizQuestions.length).fill(null);
    currentQ = 0;
    renderQuiz();
  } catch (e) {
    alert('Error generando quiz: ' + e.message);
  }

  document.getElementById('quizBtn').disabled = false;
  document.getElementById('quizLoading').style.display = 'none';
}

function restartQuiz() {
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('quizGame').style.display   = 'none';
  document.getElementById('quizInput').value = '';
}

function renderQuiz() {
  var q = quizQuestions[currentQ];
  document.getElementById('quizNum').textContent   = 'Pregunta ' + (currentQ + 1) + ' de ' + quizQuestions.length;
  document.getElementById('quizQText').textContent = q.q;

  var opts    = document.getElementById('quizOptions');
  var letters = ['A', 'B', 'C', 'D'];
  opts.innerHTML = '';

  q.opts.forEach(function(opt, i) {
    var btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.innerHTML = '<span class="opt-letter">' + letters[i] + '</span>' + escHtml(opt);

    if (quizAnswers[currentQ] !== null) {
      btn.disabled = true;
      if (i === q.correct)                                   btn.classList.add('correct');
      if (quizAnswers[currentQ] === i && i !== q.correct)   btn.classList.add('wrong');
    } else {
      btn.onclick = (function(idx) { return function() { answerQ(idx); }; })(i);
    }
    opts.appendChild(btn);
  });

  renderProgress();
  renderNav();
  document.getElementById('quizGame').style.display = 'block';
}

function renderProgress() {
  var prog = document.getElementById('quizProgress');
  prog.innerHTML = '';
  quizQuestions.forEach(function(_, i) {
    var dot = document.createElement('div');
    dot.className = 'prog-dot';
    if (quizAnswers[i] !== null) {
      dot.classList.add(quizAnswers[i] === quizQuestions[i].correct ? 'done-correct' : 'done-wrong');
    } else if (i === currentQ) {
      dot.classList.add('current');
    }
    prog.appendChild(dot);
  });
}

function renderNav() {
  var nav = document.getElementById('quizNav');
  nav.innerHTML = '';

  if (currentQ > 0) {
    var prev = document.createElement('button');
    prev.className   = 'btn btn-ghost';
    prev.textContent = '← Anterior';
    prev.onclick     = function() { currentQ--; renderQuiz(); };
    nav.appendChild(prev);
  }

  if (currentQ < quizQuestions.length - 1) {
    var next = document.createElement('button');
    next.className   = 'btn btn-ghost';
    next.textContent = 'Siguiente →';
    next.onclick     = function() { currentQ++; renderQuiz(); };
    nav.appendChild(next);
  }

  if (quizAnswers.every(function(a) { return a !== null; }) && currentQ === quizQuestions.length - 1) {
    var fin = document.createElement('button');
    fin.className   = 'btn btn-primary';
    fin.textContent = '🏆 Ver Resultados';
    fin.onclick     = showResults;
    nav.appendChild(fin);
  }
}

function answerQ(idx) {
  quizAnswers[currentQ] = idx;
  renderQuiz();
  if (currentQ < quizQuestions.length - 1) {
    setTimeout(function() { currentQ++; renderQuiz(); }, 1000);
  }
}

function showResults() {
  var correct = quizAnswers.filter(function(a, i) { return a === quizQuestions[i].correct; }).length;
  var pct     = Math.round((correct / quizQuestions.length) * 100);
  var msgs    = ['¡Sigue practicando! 💪', '¡Buen trabajo! 👍', '¡Muy bien! ⭐', '¡Excelente! 🎉', '¡Perfecto! 🏆'];

  document.getElementById('scoreNum').textContent   = pct + '%';
  document.getElementById('scoreLabel').textContent =
    correct + ' de ' + quizQuestions.length + ' correctas — ' + msgs[Math.floor(pct / 25)];

  document.getElementById('quizGame').style.display   = 'none';
  document.getElementById('quizResult').style.display = 'block';
}
