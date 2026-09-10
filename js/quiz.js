/* 
   Controla as 3 telas do quiz:
     1. Configuração — escolher dificuldade + área
     2. Perguntas — uma de cada vez, com feedback imediato
     3. Resultado — pontuação final e próximos passos
*/

document.addEventListener('DOMContentLoaded', () => {
  /* Referências de elementos */
  const setupView = document.getElementById('quizSetup');
  const playView = document.getElementById('quizPlay');
  const resultsView = document.getElementById('quizResults');

  const difficultyOptionsEl = document.getElementById('difficultyOptions');
  const areaOptionsEl = document.getElementById('areaOptions');
  const startBtn = document.getElementById('startQuizBtn');

  const progressLabel = document.getElementById('quizProgressLabel');
  const progressFill = document.getElementById('quizProgressFill');
  const questionTag = document.getElementById('quizQuestionTag');
  const questionText = document.getElementById('quizQuestionText');
  const optionsList = document.getElementById('quizOptionsList');
  const feedbackBox = document.getElementById('quizFeedback');
  const nextBtn = document.getElementById('quizNextBtn');

  const resultsScoreEl = document.getElementById('quizResultsScore');
  const resultsMsgEl = document.getElementById('quizResultsMessage');
  const resultsMetaEl = document.getElementById('quizResultsMeta');
  const retryBtn = document.getElementById('quizRetryBtn');
  const changeBtn = document.getElementById('quizChangeBtn');

  /* Se a página não tiver os elementos do quiz ( */
  if (!setupView || !playView || !resultsView) return;

  /* Estado do quiz */
  const state = {
    difficulty: null,
    area: null,
    questions: [],
    currentIndex: 0,
    score: 0,
    answered: false,
  };

  /* Utilitário: embaralha uma cópia de um array (Fisher-Yates) */
  function shuffle(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /* TELA 1 — CONFIGURAÇÃO */
  function renderSetupOptions() {
    QUIZ_DIFFICULTIES.forEach((d) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'select-card';
      card.dataset.value = d.id;
      card.innerHTML = `
        <span class="select-card__title">${d.label}</span>
        <span class="select-card__desc">${d.desc}</span>
      `;
      card.addEventListener('click', () => {
        state.difficulty = d.id;
        [...difficultyOptionsEl.children].forEach((c) => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        updateStartButton();
      });
      difficultyOptionsEl.appendChild(card);
    });

    QUIZ_AREAS.forEach((a) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'select-card';
      card.dataset.value = a.id;
      card.innerHTML = `
        <span class="select-card__code">${a.code}</span>
        <span class="select-card__title">${a.label}</span>
      `;
      card.addEventListener('click', () => {
        state.area = a.id;
        [...areaOptionsEl.children].forEach((c) => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        updateStartButton();
      });
      areaOptionsEl.appendChild(card);
    });
  }

  function updateStartButton() {
    startBtn.disabled = !(state.difficulty && state.area);
  }

  startBtn.addEventListener('click', () => {
    if (!state.difficulty || !state.area) return;
    state.questions = shuffle(QUIZ_DATA[state.area][state.difficulty]);
    state.currentIndex = 0;
    state.score = 0;

    setupView.hidden = true;
    resultsView.hidden = true;
    playView.hidden = false;
    renderQuestion();
  });

  /* TELA 2 — PERGUNTA ATUAL */
  function renderQuestion() {
    state.answered = false;
    feedbackBox.hidden = true;
    feedbackBox.className = 'quiz-feedback';
    nextBtn.hidden = true;

    const total = state.questions.length;
    const current = state.currentIndex + 1;
    const item = state.questions[state.currentIndex];

    const areaMeta = QUIZ_AREAS.find((a) => a.id === state.area);
    const diffMeta = QUIZ_DIFFICULTIES.find((d) => d.id === state.difficulty);

    progressLabel.textContent = `Pergunta ${current} de ${total}`;
    progressFill.style.width = `${(state.currentIndex / total) * 100}%`;
    questionTag.textContent = `${areaMeta.label} · ${diffMeta.label}`;
    questionText.textContent = item.q;

    optionsList.innerHTML = '';
    item.options.forEach((optionText, index) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option';
      btn.textContent = optionText;
      btn.addEventListener('click', () => selectAnswer(index, btn));
      li.appendChild(btn);
      optionsList.appendChild(li);
    });
  }

  function selectAnswer(selectedIndex, selectedBtn) {
    if (state.answered) return;
    state.answered = true;

    const item = state.questions[state.currentIndex];
    const isCorrect = selectedIndex === item.correct;
    if (isCorrect) state.score++;

    /* Marca visualmente todas as opções: a certa em verde, a errada escolhida marcada como incorreta — as demais ficam neutras/desabilitadas. */
    [...optionsList.children].forEach((li, index) => {
      const btn = li.querySelector('button');
      btn.disabled = true;
      if (index === item.correct) {
        btn.classList.add('is-correct');
      } else if (index === selectedIndex) {
        btn.classList.add('is-incorrect');
      }
    });

    feedbackBox.hidden = false;
    feedbackBox.classList.add(isCorrect ? 'is-correct' : 'is-incorrect');
    feedbackBox.innerHTML = `
      <strong>${isCorrect ? 'Certo!' : 'Não é essa.'}</strong>
      <p>${item.explain}</p>
    `;

    const isLast = state.currentIndex === state.questions.length - 1;
    nextBtn.textContent = isLast ? 'Ver resultado →' : 'Próxima pergunta →';
    nextBtn.hidden = false;
  }

  nextBtn.addEventListener('click', () => {
    if (state.currentIndex < state.questions.length - 1) {
      state.currentIndex++;
      renderQuestion();
    } else {
      progressFill.style.width = '100%';
      showResults();
    }
  });

  /*TELA 3 — RESULTADO */
  function showResults() {
    playView.hidden = true;
    resultsView.hidden = false;

    const total = state.questions.length;
    const areaMeta = QUIZ_AREAS.find((a) => a.id === state.area);
    const diffMeta = QUIZ_DIFFICULTIES.find((d) => d.id === state.difficulty);
    const pct = Math.round((state.score / total) * 100);

    resultsScoreEl.textContent = `${state.score}/${total}`;

    let message;
    if (pct === 100) {
      message = 'Gabaritou! Domina bem os conceitos desse setor.';
    } else if (pct >= 60) {
      message = 'Bom resultado — a base já está sólida.';
    } else {
      message = 'Vale revisar os conceitos dessa área antes de tentar de novo.';
    }
    resultsMsgEl.textContent = message;
    resultsMetaEl.textContent = `${areaMeta.label} · Nível ${diffMeta.label}`;
  }

  retryBtn.addEventListener('click', () => {
    state.questions = shuffle(QUIZ_DATA[state.area][state.difficulty]);
    state.currentIndex = 0;
    state.score = 0;
    resultsView.hidden = true;
    playView.hidden = false;
    renderQuestion();
  });

  changeBtn.addEventListener('click', () => {
    state.difficulty = null;
    state.area = null;
    [...difficultyOptionsEl.children].forEach((c) => c.classList.remove('is-selected'));
    [...areaOptionsEl.children].forEach((c) => c.classList.remove('is-selected'));
    updateStartButton();
    resultsView.hidden = true;
    playView.hidden = true;
    setupView.hidden = false;
  });

  /* Inicialização */
  renderSetupOptions();
});
