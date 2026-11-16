const lessons = [
  { id: 1, title: 'Posição das mãos', icon: '🖐️', goal: 'Praticar a posição base: ASDF e JKL;', verse: '“Tudo o que fizerem, façam de todo o coração.” — Colossenses 3:23', texts: ['asdf jkl; asdf jkl;', 'ff jj dd kk ss ll aa ;;', 'asdf jkl; asdf jkl; asdf jkl;', 'a s d f j k l ; a s d f j k l ;'] },
  { id: 2, title: 'Fé e confiança', icon: '🙏', goal: 'Digitar palavras sobre confiar e não desanimar', verse: '“Confie no Senhor de todo o seu coração.” — Provérbios 3:5', texts: ['fé confiança esperança', 'Deus cuida de mim', 'confie no Senhor sempre', 'a fé nos ajuda a seguir'] },
  { id: 3, title: 'Amor e respeito', icon: '❤️', goal: 'Praticar palavras que fortalecem as amizades', verse: '“Ame uns aos outros.” — João 13:34', texts: ['amor respeito amizade', 'trate todos com carinho', 'palavras gentis ajudam', 'amar e respeitar é importante'] },
  { id: 4, title: 'Paciência e perseverança', icon: '🌱', goal: 'Digitar com atenção, sem desistir', verse: '“O que é paciente mostra prudência.” — Provérbios 14:29', texts: ['paciência calma atenção', 'respire e continue tentando', 'não desista, tente outra vez', 'persistência traz vitória'] },
  { id: 5, title: 'Gratidão e alegria', icon: '😄', goal: 'Digitar palavras de gratidão e alegria', verse: '“Deem graças em todas as circunstâncias.” — 1 Tessalonicenses 5:18', texts: ['gratidão alegria sorriso', 'agradeço pelo novo dia', 'a alegria contagia as pessoas', 'gratidão muda o nosso dia'] },
  { id: 6, title: 'Acentos e cedilha', icon: '✨', goal: 'Praticar ç, ã, õ, é, ê, í, ó, ú, â e ô', verse: '“Sejam agradáveis as palavras que saem da boca de vocês.” — Efésios 4:29', texts: ['açúcar e coração', 'canção manhã pão irmão', 'café você também', 'avó avô português', 'é fácil escrever com atenção', 'amanhã será um ótimo dia', 'você é capaz e especial', 'o coração agradece e aprende'] },
  { id: 7, title: 'Verdades bíblicas', icon: '📖', goal: 'Digitar verdades que fortalecem a fé e o caráter', verse: '“Lâmpada para os meus pés é a tua palavra.” — Salmo 119:105', texts: ['Deus é amor.', 'Jesus é o caminho.', 'A Bíblia ensina a verdade.', 'Deus sempre cuida de você.', 'A oração aproxima de Deus.', 'O perdão liberta o coração.', 'A fé vence o medo.', 'Deus tem um propósito para você.'] },
  { id: 8, title: 'O plano da salvação', icon: '✝️', goal: 'Entender o amor de Deus, o perdão em Jesus e a nova vida', verse: '“Porque Deus amou o mundo de tal maneira que deu seu Filho unigênito.” — João 3:16', texts: ['Deus criou todas as pessoas com amor.', 'Todos nós precisamos do perdão de Deus.', 'Jesus veio para salvar as pessoas.', 'Jesus morreu na cruz por nós.', 'Jesus ressuscitou e está vivo.', 'Jesus perdoa quem se arrepende.', 'A fé em Jesus traz nova vida.', 'Você pode conversar com Deus em oração.'] },
  { id: 9, title: 'Desafio final: luz e serviço', icon: '⭐', goal: 'Digitar com velocidade, precisão e propósito', verse: '“Vocês são a luz do mundo.” — Mateus 5:14', texts: ['seja luz onde você estiver', 'ajude com alegria e respeito', 'o estudo prepara o futuro', 'faça o bem todos os dias'] }
];

const STORAGE_KEY = 'nicDigitaçãoPropositoV6';
let state = {};
try {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  state = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
} catch {
  state = {};
}

let currentKey = '';
let current = null;
let textIndex = 0;
let startTime = null;
let finished = false;
let errors = 0;
let streak = 0;
let errorChars = {};
const $ = id => document.getElementById(id);

function normalizedKey(name, cls) {
  const normalize = value => value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return `${normalize(name)}|${normalize(cls)}`.slice(0, 180);
}

function profileKey() {
  const name = $('studentName')?.value.trim() || '';
  const cls = $('studentClass')?.value.trim() || '';
  return name ? normalizedKey(name, cls) : '';
}

function profile() {
  if (!currentKey) return null;
  if (!state[currentKey]) state[currentKey] = { name: student(), class: $('studentClass')?.value.trim() || '', lessons: {} };
  const p = state[currentKey];
  p.lessons = p.lessons && typeof p.lessons === 'object' ? p.lessons : {};
  return p;
}

function lessonState() {
  return profile()?.lessons || {};
}

function student() {
  return $('studentName')?.value.trim() || 'Aluno NIC';
}

function xpFor(wpm, acc) {
  return Math.max(10, Math.min(120, Math.round(wpm * 4 + (acc - 60) * 2)));
}

function level(xp) {
  return xp >= 1200 ? 'Mestre do Teclado' : xp >= 800 ? 'Digitador Avançado' : xp >= 400 ? 'Digitador Intermediário' : xp >= 150 ? 'Aprendiz Rápido' : 'Iniciante';
}

function feedback(type, msg) {
  const box = $('feedback');
  if (!box) return;
  box.className = `feedback show ${type}`;
  box.innerHTML = msg;
}

function hideFeedback() {
  const box = $('feedback');
  if (box) box.className = 'feedback';
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    alert('Não foi possível salvar o progresso neste navegador.');
  }
  renderHome();
  renderRanking();
  renderPerformance();
}

function renderHome() {
  const progress = lessonState();
  let xp = 0;
  let best = 0;
  let done = 0;
  lessons.forEach(lesson => {
    const result = progress[lesson.id];
    if (!result) return;
    xp += Number(result.xp) || 0;
    best = Math.max(best, Number(result.wpm) || 0);
    if (result.completed) done++;
  });

  // Os indicadores são opcionais no HTML atual; atualize-os se estiverem presentes.
  if ($('xpTotal')) $('xpTotal').textContent = xp;
  if ($('levelTotal')) $('levelTotal').textContent = level(xp);
  if ($('bestWpm')) $('bestWpm').textContent = best;
  if ($('doneCount')) $('doneCount').textContent = `${done}/${lessons.length}`;

  const grid = $('lessonGrid');
  if (!grid) return;
  grid.replaceChildren();
  lessons.forEach(lesson => {
    const result = progress[lesson.id] || {};
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'lesson';
    card.setAttribute('aria-label', `Iniciar missão ${lesson.id}: ${lesson.title}`);
    const title = document.createElement('h3');
    title.textContent = `${lesson.icon} ${lesson.id}. ${lesson.title}`;
    const goal = document.createElement('p');
    goal.textContent = lesson.goal;
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = result.completed ? `✅ Concluída · ${result.wpm || 0} PPM` : '🎯 Vamos começar!';
    card.append(title, goal, badge);
    card.addEventListener('click', () => openLesson(lesson));
    grid.appendChild(card);
  });
}

function renderRanking() {
  const body = $('rankingBody');
  if (!body) return;
  const rows = Object.values(state).filter(p => p && p.name).map(p => {
    const results = Object.values(p.lessons || {});
    return {
      name: p.name,
      cls: p.class || '',
      xp: results.reduce((sum, item) => sum + (Number(item.xp) || 0), 0),
      wpm: results.reduce((best, item) => Math.max(best, Number(item.wpm) || 0), 0),
      done: results.filter(item => item.completed).length
    };
  }).sort((a, b) => b.xp - a.xp || b.wpm - a.wpm);

  body.replaceChildren();
  if (!rows.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.textContent = 'Nenhum resultado registrado ainda.';
    row.appendChild(cell);
    body.appendChild(row);
    return;
  }
  rows.forEach((item, index) => {
    const row = document.createElement('tr');
    [ `${index + 1}º`, item.name, item.cls, item.xp, item.wpm, `${item.done}/${lessons.length}` ].forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });
    body.appendChild(row);
  });
}

function renderPerformance() {
  const box = $('performanceSummary');
  if (!box) return;
  const p = profile();
  if (!p) {
    box.textContent = 'Informe seu nome na aba Treino de Digitação para consultar seu desempenho.';
    return;
  }
  const results = Object.values(p.lessons || {});
  const xp = results.reduce((sum, item) => sum + (Number(item.xp) || 0), 0);
  const best = results.reduce((value, item) => Math.max(value, Number(item.wpm) || 0), 0);
  const done = results.filter(item => item.completed).length;
  box.replaceChildren();
  [ ['Aluno', p.name], ['Turma', p.class || 'Não informada'], ['XP total', xp], ['Melhor PPM', best], ['Missões concluídas', `${done}/${lessons.length}`], ['Nível', level(xp)] ].forEach(([label, value]) => {
    const item = document.createElement('div');
    item.className = 'performance-item';
    const strong = document.createElement('strong');
    strong.textContent = value;
    const span = document.createElement('span');
    span.textContent = label;
    item.append(strong, span);
    box.appendChild(item);
  });
}

function openLesson(lesson) {
  if (!$('studentName')?.value.trim()) {
    feedback('warn', 'Digite seu nome antes de começar a missão.');
    $('studentName')?.focus();
    return;
  }
  currentKey = profileKey();
  const p = profile();
  if (!p) return;
  p.name = student();
  p.class = $('studentClass')?.value.trim() || '';
  save();
  current = lesson;
  textIndex = 0;
  finished = false;
  if ($('lessonGrid')) $('lessonGrid').style.display = 'none';
  if ($('trainScreen')) {
    $('trainScreen').hidden = false;
    $('trainScreen').style.display = 'block';
  }
  $('result')?.classList.remove('show');
  if ($('finishBtn')) $('finishBtn').style.display = 'none';
  loadText();
}

function loadText() {
  if (!current) return;
  const input = $('typing');
  const text = current.texts[textIndex];
  startTime = null;
  finished = false;
  errors = 0;
  streak = 0;
  errorChars = {};
  if (input) {
    input.value = '';
    input.disabled = false;
    input.className = '';
    input.focus();
  }
  if ($('lessonTitle')) $('lessonTitle').textContent = `${current.icon} ${current.title} — Texto ${textIndex + 1}/${current.texts.length}`;
  if ($('verse')) $('verse').innerHTML = `<strong>💡 Para refletir:</strong> ${current.verse}`;
  renderTarget(text, '');
  updateLive(0, 100, 0, 0);
  if ($('progress')) $('progress').style.width = '0%';
  if ($('timer')) $('timer').textContent = '0s';
  hideFeedback();
  $('result')?.classList.remove('show');
  if ($('finishBtn')) $('finishBtn').style.display = 'none';
}

function renderTarget(text, typed) {
  const target = $('target');
  if (!target) return;
  target.replaceChildren();
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.className = i < typed.length ? (typed[i] === text[i] ? 'correct' : 'wrong') : 'pending';
    if (i === typed.length) span.classList.add('cursor');
    span.textContent = text[i] === ' ' ? '\u00a0' : text[i];
    target.appendChild(span);
  }
}

function updateLive(wpm, acc, err, chain) {
  if ($('liveWpm')) $('liveWpm').textContent = wpm;
  if ($('liveAcc')) $('liveAcc').textContent = `${acc}%`;
  if ($('liveErrors')) $('liveErrors').textContent = err;
  if ($('liveStreak')) $('liveStreak').textContent = chain;
}

function metrics(text, typed) {
  let right = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === text[i]) right++;
  const secs = startTime ? Math.max(1, (Date.now() - startTime) / 1000) : 1;
  const wpm = Math.round((typed.length / 5) / (secs / 60));
  const acc = typed.length ? Math.round((right / typed.length) * 100) : 100;
  return { right, secs, wpm, acc };
}

$('typing')?.addEventListener('input', event => {
  if (finished || !current) return;
  const text = current.texts[textIndex];
  const input = event.currentTarget;
  let typed = input.value;
  if (typed.length > text.length) {
    input.value = typed.slice(0, text.length);
    typed = input.value;
  }
  if (!startTime && typed.length) startTime = Date.now();
  const i = typed.length - 1;
  if (i >= 0) {
    if (typed[i] === text[i]) {
      streak++;
      if (streak === 10) feedback('good', '🔥 <strong>Muito bem!</strong> Você acertou 10 caracteres seguidos. Continue com boa postura!');
    } else {
      errors++;
      streak = 0;
      const expected = text[i];
      const got = typed[i];
      errorChars[expected] = (errorChars[expected] || 0) + 1;
      input.classList.add('error');
      setTimeout(() => input.classList.remove('error'), 250);
      feedback('bad', `🟡 <strong>Ops! Na posição ${i + 1}.</strong> O caractere era <b>${expected === ' ' ? 'ESPAÇO' : expected}</b> e apareceu <b>${got === ' ' ? 'ESPAÇO' : got}</b>. Use Backspace e tente de novo.`);
    }
  }
  renderTarget(text, typed);
  const result = metrics(text, typed);
  updateLive(result.wpm, result.acc, errors, streak);
  if ($('progress')) $('progress').style.width = `${(typed.length / text.length) * 100}%`;
  if ($('timer')) $('timer').textContent = `${Math.round(result.secs)}s`;
  if (typed.length >= text.length) checkText();
});

function checkText() {
  const text = current.texts[textIndex];
  const typed = $('typing').value;
  const result = metrics(text, typed);
  if (result.acc >= 90) feedback('good', `🌟 <strong>Que legal!</strong> Sua precisão foi de ${result.acc}% e você digitou ${result.wpm} PPM.`);
  else if (result.acc >= 80) feedback('warn', `👍 <strong>Bom trabalho!</strong> Precisão: ${result.acc}%. Vamos tentar mais uma vez, com calma.`);
  else feedback('bad', `💪 <strong>Vamos tentar de novo!</strong> Precisão: ${result.acc}%. Respire, digite devagar e tente novamente.`);

  if (result.acc < 80) {
    setTimeout(() => { if (!finished) loadText(); }, 1400);
    return;
  }
  if (textIndex < current.texts.length - 1) {
    finished = true;
    setTimeout(() => { textIndex++; loadText(); }, 900);
    return;
  }

  finished = true;
  const p = profile();
  if (!p) return;
  const old = p.lessons[current.id] || { xp: 0, wpm: 0, completed: false, acc: 0 };
  const gained = xpFor(result.wpm, result.acc);
  p.lessons[current.id] = {
    xp: (Number(old.xp) || 0) + gained,
    wpm: Math.max(Number(old.wpm) || 0, result.wpm),
    completed: true,
    acc: Math.max(Number(old.acc) || 0, result.acc),
    errors
  };
  p.name = student();
  p.class = $('studentClass')?.value.trim() || '';
  save();
  $('typing').disabled = true;
  if ($('finalXp')) $('finalXp').textContent = `+${gained} XP`;
  if ($('wpm')) $('wpm').textContent = result.wpm;
  if ($('acc')) $('acc').textContent = `${result.acc}%`;
  if ($('errors')) $('errors').textContent = errors;
  if ($('elapsed')) $('elapsed').textContent = `${Math.round(result.secs)}s`;
  if ($('coach')) $('coach').innerHTML = coachTip(result.acc, result.wpm, errorChars);
  if ($('resultVerse')) $('resultVerse').innerHTML = `<strong>✨ Para levar para a vida:</strong> ${current.verse}`;
  $('result')?.classList.add('show');
  if ($('finishBtn')) $('finishBtn').style.display = 'inline-block';
}

function coachTip(acc, wpm, chars) {
  const entries = Object.entries(chars).sort((a, b) => b[1] - a[1]).slice(0, 3);
  let message = acc >= 95 && wpm >= 25
    ? '<strong>Parabéns, agente!</strong> Você foi muito bem. Continue com boa postura e ajude um colega.'
    : acc >= 90
      ? '<strong>Muito bem!</strong> Sua precisão está ótima. Mantenha os dedos em ASDF e JKL;.'
      : '<strong>Bom progresso!</strong> Vá com calma, mantenha a postura correta e acerte cada caractere.';
  if (entries.length) message += '<br><br><strong>Caracteres para treinar mais:</strong> ' + entries.map(([char, count]) => `<b>${char === ' ' ? 'espaço' : char}</b> (${count}x)`).join(', ') + '.';
  return message;
}

$('nextTextBtn')?.addEventListener('click', () => {
  if (!current) return;
  if (textIndex < current.texts.length - 1) {
    textIndex++;
    loadText();
  } else feedback('warn', 'Este já é o último texto da missão. Finalize para receber seu resultado.');
});
$('resetBtn')?.addEventListener('click', () => { if (current) loadText(); });
function backToLessons() {
  if ($('trainScreen')) {
    $('trainScreen').style.display = 'none';
    $('trainScreen').hidden = true;
  }
  if ($('lessonGrid')) $('lessonGrid').style.display = 'grid';
  renderHome();
}
$('backBtn')?.addEventListener('click', backToLessons);
$('finishBtn')?.addEventListener('click', backToLessons);
$('homeBtn')?.addEventListener('click', backToLessons);

$('exportBtn')?.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ranking_digitacao_nic.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

$('importFile')?.addEventListener('change', event => {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!imported || typeof imported !== 'object' || Array.isArray(imported)) throw new Error('invalid');
      state = { ...state, ...imported };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      renderHome();
      renderRanking();
      renderPerformance();
      alert('Ranking importado com sucesso!');
    } catch {
      alert('Arquivo inválido. Escolha um JSON exportado pelo Treino NIC.');
    }
    event.target.value = '';
  };
  reader.readAsText(file);
});

function syncStudent() {
  currentKey = profileKey();
  if (currentKey) {
    const p = profile();
    p.name = student();
    p.class = $('studentClass')?.value.trim() || '';
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* O treino ainda pode ser usado sem persistência. */ }
  }
  renderHome();
  renderRanking();
  renderPerformance();
}
$('studentName')?.addEventListener('change', syncStudent);
$('studentClass')?.addEventListener('change', syncStudent);

if ($('studentName')) $('studentName').value = window.NIC?.store?.get('nomeAluno', '') || '';
syncStudent();
window.addEventListener('nic:desempenho-aberto', renderPerformance);
