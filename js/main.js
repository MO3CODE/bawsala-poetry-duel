/**
 * main.js — نقطة الدخول الرئيسية
 * يربط كل الوحدات ويهيئ التطبيق
 * يعرض الدوال على window لتعمل مع onclick في HTML
 */

import { S, loadState, resetTournament } from './state.js';
import { DATA } from './data.js';
import { audio } from './audio.js';
import {
  stepPlayers, startGame, changeScore, awardPoint,
  setTurn, turnAndStart, ringBell, resetBell,
  toggleTimer, resetTimer, burnCard, drawTimer, initGame
} from './game.js';
import {
  showScreen, goto, openRoundIntro, enterRound,
  refreshNames, updateScores, flashPanel, renderCards,
  renderR1, renderPoemGrid, renderPoemPlay, revealNext,
  renderTopicGrid, openTopic, nextTopic,
  renderWordGrid, openWord, nextWord,
  toggleFullscreen, launchConfetti
} from './ui.js';

/* حقن دوال UI في game.js لتجنب الاعتماد الدائري */
initGame({
  refreshNames, updateScores, flashPanel, renderCards,
  renderPoemPlay, showScreen
});

const $ = id => document.getElementById(id);

/* ================= تعريض الدوال على window (للـ onclick في HTML) ================= */
Object.assign(window, {
  startGame, stepPlayers,
  changeScore, awardPoint, setTurn, turnAndStart,
  ringBell, resetBell,
  toggleTimer, resetTimer, burnCard,
  showScreen, goto, openRoundIntro, enterRound,
  renderPoemGrid, renderPoemPlay, revealNext,
  renderTopicGrid, openTopic, nextTopic,
  renderWordGrid, openWord, nextWord,
  toggleFullscreen, resetTournament
});
/* كشف S لزر الرجوع في شاشة الفائز */
window._S = S;

/* ================= اختصارات لوحة المفاتيح ================= */
function globalNext() {
  const active = document.querySelector('.screen.active');
  if (!active) return;
  switch (active.id) {
    case 's-r2-play':     revealNext(); break;
    case 's-r3-play':     nextTopic(); break;
    case 's-r4-play':     nextWord(); break;
    case 's-round-intro': $('ri-go').click(); break;
    case 's-setup':       startGame(); break;
  }
}

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') {
    if (e.code === 'Enter') startGame();
    return;
  }
  const inGame   = S.gameStarted;
  const onWinner = $('s-winner').classList.contains('active');
  if (e.code === 'Escape' && onWinner) { showScreen(S.lastScreen || 's-rules'); return; }
  if (onWinner && e.code !== 'KeyF') return;
  switch (e.code) {
    case 'Space':       e.preventDefault(); if (inGame) toggleTimer(); break;
    case 'Enter':
    case 'NumpadEnter': e.preventDefault(); globalNext(); break;
    case 'KeyR':        resetTimer(); resetBell(); break;
    case 'KeyF':        toggleFullscreen(); break;
    case 'Digit1': case 'Numpad1': if (inGame) ringBell('A'); break;
    case 'Digit2': case 'Numpad2': if (inGame) ringBell('B'); break;
    case 'Digit3': case 'Numpad3': if (inGame) burnCard('A'); break;
    case 'Digit4': case 'Numpad4': if (inGame) burnCard('B'); break;
    case 'ArrowRight': e.preventDefault(); if (inGame) awardPoint('A'); break;
    case 'ArrowLeft':  e.preventDefault(); if (inGame) awardPoint('B'); break;
  }
});

/* ================= روابط شريط المسيّر ================= */
document.querySelectorAll('.host-tab').forEach(t =>
  t.addEventListener('click', () => goto(t.dataset.goto))
);

/* ================= شعار شاشة الفائز ================= */
(function () {
  const l = $('logo-hero').cloneNode(true);
  l.id = 'winner-logo';
  l.style.width = 'clamp(80px,8vw,130px)';
  l.style.marginBottom = '1vh';
  l.style.filter = 'drop-shadow(0 0 30px rgba(207,163,73,.35))';
  $('winner-logo-slot').appendChild(l);
})();

/* ================= رسم علامات البوصلة ================= */
(function () {
  const g = $('ticks');
  for (let i = 0; i < 36; i++) {
    const a = i * 10 * Math.PI / 180, big = i % 9 === 0;
    const r1 = big ? 70 : 76, r2 = 88;
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', 100 + r1 * Math.sin(a));
    l.setAttribute('y1', 100 - r1 * Math.cos(a));
    l.setAttribute('x2', 100 + r2 * Math.sin(a));
    l.setAttribute('y2', 100 - r2 * Math.cos(a));
    if (big) l.setAttribute('stroke', '#CFA349');
    g.appendChild(l);
  }
  drawTimer();

  /* استعادة الحالة المحفوظة عند تحميل الصفحة */
  loadState({
    refreshNames, updateScores,
    renderCards, showScreen,
    renderR1, renderPoemGrid, renderPoemPlay,
    renderTopicGrid, renderWordGrid,
    drawTimer, DATA
  });
})();
