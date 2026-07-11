/**
 * game.js — منطق اللعبة الأساسي
 * يشمل: بداية اللعبة، النقاط، الأدوار، الجرس، المؤقت، البطاقات
 *
 * ملاحظة: لتجنب الاعتماد الدائري مع ui.js، يتم تمرير دوال UI
 * عبر دالة init() تُستدعى من main.js
 */

import { S, saveState } from './state.js';
import { DATA } from './data.js';
import { audio, SFX } from './audio.js';

/* دوال UI تُضخّ من main.js عند التهيئة */
let _ui = {};
export function initGame(uiFunctions) {
  _ui = uiFunctions;
}

const $ = id => document.getElementById(id);

/* ================= بداية اللعبة ================= */

export function stepPlayers(t, d) {
  const el = $('pc' + t);
  let v = +el.textContent + d;
  v = Math.max(1, Math.min(6, v));
  el.textContent = v;
}

export function startGame() {
  audio();
  S.teams.A.name   = $('inNameA').value.trim() || 'الفريق الأول';
  S.teams.B.name   = $('inNameB').value.trim() || 'الفريق الثاني';
  S.teams.A.cards  = +$('pcA').textContent;
  S.teams.B.cards  = +$('pcB').textContent;
  S.teams.A.score  = 0; S.teams.A.burned = 0;
  S.teams.B.score  = 0; S.teams.B.burned = 0;
  S.round    = 1;
  S.turn     = null;
  S.bellLock = null;
  S.done.poems.clear();
  S.done.topics.clear();
  S.done.words.clear();
  S.gameStarted = true;
  _ui.refreshNames();
  _ui.renderCards('A');
  _ui.renderCards('B');
  _ui.updateScores();
  _ui.showScreen('s-rules');
  saveState();
}

/* ================= النقاط والدور ================= */

export function changeScore(t, d) {
  S.teams[t].score = Math.max(0, S.teams[t].score + d);
  _ui.updateScores();
  if (d > 0) { _ui.flashPanel(t); SFX.award(); }
  saveState();
}

export function awardPoint(t) {
  const pts = DATA.rounds[S.round].pts;
  S.teams[t].score += pts;
  _ui.updateScores();
  _ui.flashPanel(t);
  SFX.award();
  resetBell();
  if (S.timer.running) toggleTimer();
  /* الجولة الثانية: النقطة تكشف البيت التالي تلقائياً */
  if ($('s-r2-play').classList.contains('active')) {
    const st = S.poemState, p = DATA.poems[st.idx];
    if (st.revealed < p.lines.length) {
      st.revealed++;
      _ui.renderPoemPlay();
      resetTimer();
    }
  }
  saveState();
}

export function setTurn(t, force) {
  if (force) S.turn = t;
  else S.turn = (S.turn === t) ? null : t;
  $('panelA').classList.toggle('turn', S.turn === 'A');
  $('panelB').classList.toggle('turn', S.turn === 'B');
  saveState();
}

/* ▶ نقل الدور لفريق وتشغيل المؤقت مباشرة */
export function turnAndStart(t) {
  audio();
  setTurn(t, true);
  resetBell();
  resetTimer();
  toggleTimer();
}

/* 🎲 قرعة الدور العشوائية */
let drawing = false;
export function drawTurn() {
  if (drawing) return;
  drawing = true;
  resetBell();
  audio();
  let cur = Math.random() < .5 ? 'A' : 'B';
  const total = 12 + Math.floor(Math.random() * 2);
  let n = 0, delay = 90;
  (function step() {
    cur = cur === 'A' ? 'B' : 'A';
    setTurn(cur, true);
    SFX.tick();
    n++;
    if (n < total) {
      delay *= 1.13;
      setTimeout(step, delay);
    } else {
      drawing = false;
      SFX.award();
      _ui.flashPanel(cur);
      const color = cur === 'A' ? 'var(--teamA)' : 'var(--teamB)';
      $('bell-status').innerHTML = `🎲 يبدأ: <span style="color:${color}">${S.teams[cur].name}</span>`;
      saveState();
    }
  })();
}

/* ================= بطاقات الاستعانة بصديق ================= */

export function burnCard(t) {
  const team = S.teams[t];
  if (team.burned < team.cards) {
    team.burned++;
    SFX.burn();
    _ui.renderCards(t);
    saveState();
  }
}

/* ================= المؤقت / البوصلة ================= */

export const RING = 2 * Math.PI * 80;

export function setTimerDur(sec) {
  S.timer.dur = sec;
  resetTimer();
}

export function drawTimer() {
  const t = S.timer, frac = t.left / t.dur;
  $('timer-num').textContent = Math.ceil(t.left);
  $('ringProg').style.strokeDashoffset = RING * (1 - frac);
  $('needle').style.transform = `rotate(${(1 - frac) * 360}deg)`;
  $('timer-num').classList.toggle('warn', t.left <= 3.05 && t.running);
}

let lastWholeSec = null;

function tickLoop(ts) {
  const t = S.timer;
  if (!t.running) return;
  const dt = (ts - t.lastTs) / 1000;
  t.lastTs = ts;
  t.left = Math.max(0, t.left - dt);
  const w = Math.ceil(t.left);
  if (w !== lastWholeSec) {
    lastWholeSec = w;
    if (t.left > 0) SFX.tick();
  }
  drawTimer(); /* local drawTimer */
  if (t.left <= 0) {
    t.running = false;
    SFX.buzz();
    $('btnTimer').textContent = '▶ تشغيل المؤقت';
    return;
  }
  t.raf = requestAnimationFrame(tickLoop);
}

export function toggleTimer() {
  const t = S.timer;
  audio();
  if (t.running) {
    t.running = false;
    $('btnTimer').textContent = '▶ تشغيل المؤقت';
  } else {
    if (t.left <= 0) t.left = t.dur;
    t.running = true;
    t.lastTs = performance.now();
    lastWholeSec = Math.ceil(t.left);
    SFX.tick();
    $('btnTimer').textContent = '⏸ إيقاف مؤقت';
    requestAnimationFrame(tickLoop);
  }
  saveState();
}

export function resetTimer() {
  const t = S.timer;
  t.running = false;
  t.left = t.dur;
  lastWholeSec = null;
  $('btnTimer').textContent = '▶ تشغيل المؤقت';
  drawTimer();
  saveState();
}

/* ================= الجرس ================= */

export function ringBell(t) {
  audio();
  if (S.bellLock) return;
  S.bellLock = t;
  SFX.bell();
  const name = S.teams[t].name;
  const color = t === 'A' ? 'var(--teamA)' : 'var(--teamB)';
  $('bell-status').innerHTML = `🔔 الأسبقية: <span style="color:${color}">${name}</span>`;
  $('bellBtn' + t).classList.add('won');
  setTurn(t, true);
  if (S.timer.running) toggleTimer();
  const ef = $('edge-flash');
  ef.style.background = `radial-gradient(120% 120% at ${t === 'A' ? '100%' : '0%'} 50%, ${t === 'A' ? 'rgba(217,113,59,.5)' : 'rgba(63,168,184,.5)'} 0%, transparent 60%)`;
  ef.classList.remove('on');
  ef.offsetHeight;
  ef.classList.add('on');
  saveState();
}

export function resetBell() {
  S.bellLock = null;
  $('bell-status').textContent = '';
  $('bellBtnA').classList.remove('won');
  $('bellBtnB').classList.remove('won');
  saveState();
}
