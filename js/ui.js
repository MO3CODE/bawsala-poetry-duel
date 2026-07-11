/**
 * ui.js — واجهة المستخدم والعرض
 * يشمل: التنقل بين الشاشات، عرض القصائد، الكروت، الفائز، الكونفيتي
 */

import { S, saveState } from './state.js';
import { DATA } from './data.js';
import { SFX } from './audio.js';
import { RING, setTimerDur, resetBell, resetTimer, drawTimer } from './game.js';

const $ = id => document.getElementById(id);

/* ================= التنقل ================= */

export function showScreen(id) {
  const prev = document.querySelector('.screen.active');
  if (prev && prev.id !== 's-winner') S.lastScreen = prev.id;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = $(id);
  el.classList.add('active');
  el.querySelectorAll('.fade-in').forEach(e => {
    e.style.animation = 'none';
    e.offsetHeight;
    e.style.animation = '';
  });
  document.querySelectorAll('.host-tab').forEach(t => t.classList.remove('on'));
  const map = {
    's-rules':'s-rules','s-r1':'intro-1','s-r2-list':'intro-2',
    's-r2-play':'intro-2','s-r3-list':'intro-3','s-r3-play':'intro-3',
    's-r4-list':'intro-4','s-r4-play':'intro-4','s-winner':'s-winner'
  };
  const tab = document.querySelector(`.host-tab[data-goto="${map[id]||''}"]`);
  if (tab) tab.classList.add('on');
  const started = S.gameStarted;
  const clean = (id === 's-winner' || id === 's-setup');
  $('topbar').classList.toggle('visible', started && !clean);
  $('hostbar').classList.toggle('visible', started && !clean);
  if (id === 's-winner') showWinner();
  saveState();
}

export function goto(key) {
  if (key.startsWith('intro-')) { openRoundIntro(+key.split('-')[1]); }
  else showScreen(key);
}

export function openRoundIntro(n) {
  S.round = n;
  const r = DATA.rounds[n];
  $('ri-badge').textContent = n === 4 ? 'الجولة النهائية' : ['','الجولة الأولى','الجولة الثانية','الجولة الثالثة'][n];
  $('ri-title').textContent = r.name;
  $('ri-desc').innerHTML = r.desc;
  $('ri-time').textContent = r.time + 'ث';
  $('ri-pts').textContent = '+' + r.pts;
  $('ri-go').onclick = () => enterRound(n);
  setTimerDur(r.time);
  showScreen('s-round-intro');
}

export function enterRound(n) {
  S.round = n;
  setTimerDur(DATA.rounds[n].time);
  resetBell();
  if (n === 1) { renderR1(); showScreen('s-r1'); }
  if (n === 2) { openPoem(0); }
  if (n === 3) { openTopic(0); }
  if (n === 4) { openWord(0); }
}

/* ================= الأسماء والنقاط والكروت ================= */

export function refreshNames() {
  $('nameA').textContent = S.teams.A.name;
  $('nameB').textContent = S.teams.B.name;
  document.querySelectorAll('.dyn-nameA').forEach(e => e.textContent = S.teams.A.name);
  document.querySelectorAll('.dyn-nameB').forEach(e => e.textContent = S.teams.B.name);
}

export function updateScores() {
  $('scoreA').textContent = S.teams.A.score;
  $('scoreB').textContent = S.teams.B.score;
}

export function flashPanel(t) {
  const p = $('panel' + t);
  p.classList.remove('flash');
  p.offsetHeight;
  p.classList.add('flash');
}

export function renderCards(t) {
  const wrap = $('cards' + t);
  wrap.innerHTML = '';
  const team = S.teams[t];
  for (let i = 0; i < team.cards; i++) {
    const c = document.createElement('div');
    c.className = 'help-card' + (i < team.burned ? ' burned' : '');
    c.textContent = '🃏';
    c.title = i < team.burned ? 'بطاقة محروقة — اضغط للتراجع' : 'استعانة بصديق — اضغط لحرق البطاقة';
    c.onclick = () => {
      if (i < team.burned) { team.burned--; }
      else { team.burned++; SFX.burn(); }
      renderCards(t);
      saveState();
    };
    wrap.appendChild(c);
  }
}

/* drawTimer is imported from game.js and re-exported for external use */
export { drawTimer };


/* ================= الجولة 1 ================= */

export function renderR1() {
  const wrap = $('r1-verses');
  wrap.innerHTML = '';
  DATA.r1Verses.forEach((v, i) => {
    const d = document.createElement('div');
    d.className = 'verse';
    d.style.animationDelay = (i * .25) + 's';
    d.textContent = v;
    wrap.appendChild(d);
  });
}

/* ================= الجولة 2 ================= */

export function renderPoemGrid() {
  const g = $('poemGrid');
  g.innerHTML = '';
  DATA.poems.forEach((p, i) => {
    const b = document.createElement('button');
    b.className = 'pick-card' + (S.done.poems.has(i) ? ' done' : '');
    b.innerHTML = `<div>القصيدة ${i+1} ${p.repeat ? '<span class="pc-sub">(تكرار)</span>' : ''}</div>
      <div class="pc-poem">${p.lines[0]}</div>
      <div class="pc-sub">${p.lines.length} أبيات</div>`;
    b.onclick = () => openPoem(i);
    g.appendChild(b);
  });
}

export function openPoem(i) {
  S.poemState = {idx: i, revealed: 1};
  S.done.poems.add(i);
  resetTimer();
  resetBell();
  renderPoemPlay();
  showScreen('s-r2-play');
}

export function renderPoemPlay() {
  const st = S.poemState, p = DATA.poems[st.idx];
  $('r2-counter').textContent = `القصيدة ${st.idx+1} من ${DATA.poems.length} · البيت ${st.revealed} من ${p.lines.length}` + (p.repeat ? ' · (تكرار)' : '');
  const wrap = $('r2-verses');
  wrap.innerHTML = '';
  wrap.classList.toggle('long', p.lines.length > 4);
  p.lines.slice(0, st.revealed).forEach((v, idx) => {
    const d = document.createElement('div');
    d.className = 'verse ' + (idx === st.revealed - 1 ? 'current' : 'prev');
    d.textContent = v;
    wrap.appendChild(d);
  });
  const btn = $('btnReveal');
  if (st.revealed < p.lines.length)            btn.textContent = 'البيت التالي ⤵';
  else if (st.idx < DATA.poems.length - 1)     btn.textContent = 'القصيدة التالية ⏭';
  else                                          btn.textContent = 'انتهت القصائد ✓';
  btn.disabled = (st.revealed >= p.lines.length && st.idx >= DATA.poems.length - 1);
}

export function revealNext() {
  const st = S.poemState, p = DATA.poems[st.idx];
  if (st.revealed < p.lines.length) { st.revealed++; renderPoemPlay(); resetTimer(); }
  else if (st.idx < DATA.poems.length - 1) { openPoem(st.idx + 1); }
  saveState();
}

/* ================= الجولة 3 ================= */

export function renderTopicGrid() {
  const g = $('topicGrid');
  g.innerHTML = '';
  const icons = ['🏠','💔','💪','🧳','🤲'];
  DATA.topics.forEach((t, i) => {
    const b = document.createElement('button');
    b.className = 'pick-card' + (S.done.topics.has(i) ? ' done' : '');
    b.innerHTML = `<div style="font-size:1.6em">${icons[i]}</div><div>${t}</div>`;
    b.onclick = () => openTopic(i);
    g.appendChild(b);
  });
}

export function openTopic(i) {
  S.topicIdx = i;
  S.done.topics.add(i);
  $('r3-word').textContent = DATA.topics[i];
  $('r3-counter').textContent = `التحدي الموضوعي · الموضوع ${i+1} من ${DATA.topics.length} · أبيات في موضوع:`;
  const btn = $('btnNextTopic');
  btn.disabled = i >= DATA.topics.length - 1;
  btn.textContent = i >= DATA.topics.length - 1 ? 'انتهت المواضيع ✓' : 'الموضوع التالي ⏭';
  resetTimer();
  resetBell();
  showScreen('s-r3-play');
}

export function nextTopic() {
  if (S.topicIdx < DATA.topics.length - 1) openTopic(S.topicIdx + 1);
}

/* ================= الجولة 4 ================= */

export function renderWordGrid() {
  const g = $('wordGrid');
  g.innerHTML = '';
  DATA.words.forEach((w, i) => {
    const b = document.createElement('button');
    b.className = 'pick-card' + (S.done.words.has(i) ? ' done' : '');
    b.innerHTML = `<div style="font-family:var(--font-poem);font-size:1.3em">${w}</div>`;
    b.onclick = () => openWord(i);
    g.appendChild(b);
  });
}

export function openWord(i) {
  S.wordIdx = i;
  S.done.words.add(i);
  $('r4-word').textContent = DATA.words[i];
  $('r4-counter').innerHTML = `الضربة القاضية · الكلمة ${i+1} من ${DATA.words.length} · بيتٌ فيه كلمة: <b style="color:var(--gold-bright)">الأسبقية بالجرس 🔔</b>`;
  const btn = $('btnNextWord');
  btn.disabled = i >= DATA.words.length - 1;
  btn.textContent = i >= DATA.words.length - 1 ? 'انتهت الكلمات ✓' : 'الكلمة التالية ⏭';
  resetTimer();
  resetBell();
  showScreen('s-r4-play');
}

export function nextWord() {
  if (S.wordIdx < DATA.words.length - 1) openWord(S.wordIdx + 1);
}

/* ================= الفائز ================= */

export function showWinner() {
  const a = S.teams.A, b = S.teams.B;
  $('fcNameA').textContent = a.name;
  $('fcNameB').textContent = b.name;
  $('fcScoreA').textContent = a.score;
  $('fcScoreB').textContent = b.score;
  let title;
  if (a.score > b.score)      title = `🎉 ${a.name}`;
  else if (b.score > a.score) title = `🎉 ${b.name}`;
  else                        title = 'تعادل الفريقان!';
  $('winner-name').textContent = title;
  SFX.win();
  launchConfetti();
}

/* ================= الكونفيتي ================= */

let confettiRunning = false;

export function launchConfetti() {
  if (confettiRunning) return;
  confettiRunning = true;
  const cv = $('confetti-canvas'), ctx = cv.getContext('2d');
  cv.width = innerWidth;
  cv.height = innerHeight;
  const colors = ['#CFA349','#EBCB7F','#D9713B','#3FA8B8','#F2E8D5'];
  const parts = Array.from({length: 180}, () => ({
    x: Math.random() * cv.width,
    y: -20 - Math.random() * cv.height * .5,
    w: 6 + Math.random() * 8,
    h: 10 + Math.random() * 10,
    vy: 2 + Math.random() * 3.5,
    vx: -1.5 + Math.random() * 3,
    rot: Math.random() * Math.PI,
    vr: -.1 + Math.random() * .2,
    c: colors[Math.floor(Math.random() * colors.length)]
  }));
  const t0 = performance.now();
  (function frame(ts) {
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts.forEach(p => {
      p.y += p.vy;
      p.x += p.vx + Math.sin(ts / 300 + p.y / 50) * .6;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      if (p.y > cv.height + 30) { p.y = -20; p.x = Math.random() * cv.width; }
    });
    if (ts - t0 < 9000) requestAnimationFrame(frame);
    else { ctx.clearRect(0, 0, cv.width, cv.height); confettiRunning = false; }
  })(t0);
}

/* ================= ملء الشاشة ================= */

export function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}
