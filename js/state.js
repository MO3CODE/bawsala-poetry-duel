/* ================= حالة اللعبة ================= */
export const S = {
  teams: {
    A:{name:"الفريق الأول", score:0, cards:2, burned:0},
    B:{name:"الفريق الثاني", score:0, cards:2, burned:0}
  },
  round: 1,
  turn: null,
  bellLock: null,
  timer: {dur:10, left:10, running:false, raf:null, lastTs:0},
  poemState: {idx:-1, revealed:0},
  done: {poems:new Set(), topics:new Set(), words:new Set()},
  gameStarted: false,
  lastScreen: null,
  topicIdx: undefined,
  wordIdx: undefined
};

const STORAGE_KEY = 'bawsala_duel_state';

/* ================= الذاكرة المؤقتة ================= */

/**
 * حفظ حالة اللعبة في localStorage
 * يُستدعى تلقائياً بعد كل تغيير في الحالة
 */
export function saveState() {
  if (!S.gameStarted) return;
  const stateCopy = {
    teams: S.teams,
    round: S.round,
    turn: S.turn,
    bellLock: S.bellLock,
    timer: {
      dur: S.timer.dur,
      left: S.timer.left,
      running: false
    },
    poemState: S.poemState,
    topicIdx: S.topicIdx,
    wordIdx: S.wordIdx,
    done: {
      poems: Array.from(S.done.poems),
      topics: Array.from(S.done.topics),
      words: Array.from(S.done.words)
    },
    gameStarted: S.gameStarted,
    lastScreen: S.lastScreen,
    currentScreen: document.querySelector('.screen.active')?.id || 's-setup'
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stateCopy));
}

/**
 * استعادة حالة اللعبة من localStorage عند تحميل الصفحة
 * يعيد اللعبة من حيث توقفت
 */
export function loadState(callbacks) {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return;
  try {
    const saved = JSON.parse(data);
    if (!saved || !saved.gameStarted) return;

    S.teams = saved.teams;
    S.round = saved.round;
    S.turn = saved.turn;
    S.bellLock = saved.bellLock;
    S.timer.dur = saved.timer.dur;
    S.timer.left = saved.timer.left;
    S.timer.running = false;
    S.poemState = saved.poemState;
    S.topicIdx = saved.topicIdx;
    S.wordIdx = saved.wordIdx;
    S.done.poems = new Set(saved.done.poems || []);
    S.done.topics = new Set(saved.done.topics || []);
    S.done.words = new Set(saved.done.words || []);
    S.gameStarted = saved.gameStarted;
    S.lastScreen = saved.lastScreen;

    // استدعاء دوال إعادة التهيئة عبر callbacks
    callbacks.refreshNames();
    callbacks.updateScores();
    callbacks.renderCards('A');
    callbacks.renderCards('B');

    const $ = id => document.getElementById(id);
    $('panelA').classList.toggle('turn', S.turn==='A');
    $('panelB').classList.toggle('turn', S.turn==='B');

    if (S.bellLock) {
      const t = S.bellLock;
      const name = S.teams[t].name;
      const color = t==='A'?'var(--teamA)':'var(--teamB)';
      $('bell-status').innerHTML=`🔔 الأسبقية: <span style="color:${color}">${name}</span>`;
      $('bellBtn'+t).classList.add('won');
    }

    const screenId = saved.currentScreen || 's-rules';
    callbacks.showScreen(screenId);

    if (screenId === 's-r1') {
      callbacks.renderR1();
    } else if (screenId === 's-r2-list') {
      callbacks.renderPoemGrid();
    } else if (screenId === 's-r2-play') {
      callbacks.renderPoemPlay();
    } else if (screenId === 's-r3-list') {
      callbacks.renderTopicGrid();
    } else if (screenId === 's-r3-play') {
      const { DATA } = callbacks;
      const idx = S.topicIdx !== undefined ? S.topicIdx : 0;
      $('r3-word').textContent=DATA.topics[idx];
      $('r3-counter').textContent=`التحدي الموضوعي · الموضوع ${idx+1} من ${DATA.topics.length} · أبيات في موضوع:`;
      const btn=$('btnNextTopic');
      btn.disabled = idx>=DATA.topics.length-1;
      btn.textContent = idx>=DATA.topics.length-1 ? 'انتهت المواضيع ✓' : 'الموضوع التالي ⏭';
    } else if (screenId === 's-r4-list') {
      callbacks.renderWordGrid();
    } else if (screenId === 's-r4-play') {
      const { DATA } = callbacks;
      const idx = S.wordIdx !== undefined ? S.wordIdx : 0;
      $('r4-word').textContent=DATA.words[idx];
      $('r4-counter').innerHTML=`الضربة القاضية · الكلمة ${idx+1} من ${DATA.words.length} · بيتٌ فيه كلمة: <b style="color:var(--gold-bright)">الأسبقية بالجرس 🔔</b>`;
      const btn=$('btnNextWord');
      btn.disabled = idx>=DATA.words.length-1;
      btn.textContent = idx>=DATA.words.length-1 ? 'انتهت الكلمات ✓' : 'الكلمة التالية ⏭';
    }

    callbacks.drawTimer();
  } catch (e) {
    console.error("Error loading state:", e);
  }
}

/**
 * تصفير المسابقة بالكامل والعودة للبداية
 */
export function resetTournament() {
  if (confirm("هل أنت متأكد من تصفير المسابقة والبدء من جديد؟ سيتم حذف جميع النقاط والبطاقات والتقدم الحالي.")) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}
