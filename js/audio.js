/* ================= محرك الأصوات (WebAudio API) ================= */

let AC = null;

/**
 * تهيئة سياق الصوت عند أول تفاعل من المستخدم
 */
export function audio() {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === 'suspended') AC.resume();
  return AC;
}

/**
 * توليد نغمة بسيطة
 * @param {number} freq - التردد بالهيرتز
 * @param {number} dur  - المدة بالثواني
 * @param {string} type - نوع الموجة (sine/square/sawtooth/triangle)
 * @param {number} vol  - مستوى الصوت
 * @param {number} when - التأخير بالثواني
 */
export function tone(freq, dur, type = 'sine', vol = 0.25, when = 0) {
  const ac = audio();
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.connect(g);
  g.connect(ac.destination);
  const t = ac.currentTime + when;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t);
  o.stop(t + dur + 0.05);
}

/**
 * مجموعة المؤثرات الصوتية للعبة
 */
export const SFX = {
  bell()  { tone(1320, .9, 'sine', .35); tone(1760, .7, 'sine', .2, .02); },
  tick()  { tone(880, .08, 'square', .12); },
  buzz()  { tone(160, .7, 'sawtooth', .3); tone(120, .7, 'sawtooth', .25, .05); },
  award() { tone(660, .15, 'sine', .3); tone(880, .15, 'sine', .3, .13); tone(1100, .3, 'sine', .3, .26); },
  burn()  { tone(400, .2, 'triangle', .25); tone(260, .35, 'triangle', .25, .12); },
  win()   { [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, .45, 'sine', .3, i * .16)); }
};
