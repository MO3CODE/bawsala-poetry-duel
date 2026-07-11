# 🧭 المساجلة الشعرية — نادي بوصلة الثقافي (Bawsala Poetry Duel)

تطبيق ويب تفاعلي متكامل (صفحة واحدة - Single Page Application) لإدارة وتحكيم مسابقة **المساجلة الشعرية** بطريقة سينمائية وحماسية. تم تصميم وبرمجة اللعبة خصيصاً لـ **نادي بوصلة الثقافي** لتنظيم الفعاليات الشعرية التنافسية.

[English Version Below](#english-version)

---

## 🎨 مميزات اللعبة

- **تصميم بصري فاخر:** واجهات متجاوبة، وتدرجات لونية غامقة مريحة للعين مع طابع عربي تقليدي باستخدام خطوط (أميري، عارف رقعة، وتجوال).
- **أصوات تفاعلية ذكية (WebAudio API):** توليد النغمات والمؤثرات الصوتية (صوت الجرس، تكات المؤقت، وصوت الفوز) برمجياً دون الحاجة لتحميل ملفات صوتية خارجية.
- **تأثيرات حركية ومؤثرات بصرية:** حركة وميض أطراف الشاشة عند الضغط على الجرس، وتأثير الـ Confetti المتساقط عند إعلان الفريق الفائز.
- **إدارة كاملة للمباراة:** شاشة إعداد مخصصة لإدخال أسماء الفرق وتحديد عدد بطاقات المساعدة لكل فريق بناءً على عدد اللاعبين.
- **أربعة جولات متنوعة ومصممة بدقة:**
  1. **حرف وحرف:** تناوب تقليدي على الحروف مع مؤقت تنازلي (10 ثوانٍ).
  2. **أكمل الشطر:** كشف تدريجي للأبيات مع إمكانية منح نقاط للفريق الأسرع.
  3. **التحدي الموضوعي:** مواضيع شعرية محددة تتناوب الفرق على الإلقاء فيها.
  4. **الضربة القاضية:** جولة حماسية تعتمد على سرعة الضغط على الجرس لإلقاء بيت يحتوي على كلمة معينة.

---

## ⌨️ اختصارات لوحة المفاتيح للمسيّر (مهم جداً)

لإدارة الفعالية بسلاسة وسرعة، يمكن للمسيّر التحكم بالكامل باستخدام لوحة المفاتيح:

| المفتاح | الوظيفة |
| :--- | :--- |
| `Space` (المسطرة) | تشغيل / إيقاف المؤقت التنازلي |
| `Enter` / `NumpadEnter` | الانتقال للخطوة التالية (البيت التالي / الموضوع التالي / الكلمة التالية) |
| `1` / `Numpad1` | جرس **الفريق الأول** (له الأسبقية بالرد) |
| `2` / `Numpad2` | جرس **الفريق الثاني** (له الأسبقية بالرد) |
| `3` / `Numpad3` | حرق بطاقة استعانة بصديق لـ **الفريق الأول** |
| `4` / `Numpad4` | حرق بطاقة استعانة بصديق لـ **الفريق الثاني** |
| `Arrow Right` (سهم يمين) | منح نقطة لـ **الفريق الأول** |
| `Arrow Left` (سهم يسار) | منح نقطة لـ **الفريق الثاني** |
| `R` / `r` | إعادة ضبط المؤقت والجرس |
| `F` / `f` | تفعيل / إلغاء وضع ملء الشاشة (Fullscreen) |
| `Escape` (في شاشة الفائز) | العودة للشاشة السابقة لمراجعة النتائج |

---

## 🚀 التشغيل المباشر والاستضافة

### التشغيل المحلي:
يمكنك ببساطة تحميل الملف المسمى `index.html` وتشغيله على أي جهاز (حتى بدون إنترنت) عن طريق النقر المزدوج عليه.

### الاستضافة عبر جيت هب (GitHub Pages):
تمت تهيئة المشروع للعمل مباشرة على خدمة GitHub Pages المجانية:
1. اذهب إلى إعدادات المستودع على جيت هب (**Settings**).
2. اختر قسم **Pages** من القائمة الجانبية.
3. تحت خيار **Build and deployment**، اختر الفرع `main` والمجلد `/ (root)`.
4. اضغط على **Save**، وخلال دقائق سيكون موقع اللعبة متاحاً للجميع عبر الإنترنت.

---

<a name="english-version"></a>

# 🧭 Bawsala Poetry Duel

An interactive, single-page web application designed to run and referee **Poetry Duel** competitions with a cinematic, highly engaging style. Created specifically for **Bawsala Cultural Club**.

## 🎨 Features

- **Premium Aesthetics:** Responsive dark mode layout styled with HSL colors and elegant Arabic typography (Amiri, Aref Ruqaa, Tajawal).
- **Synthesized Audio (WebAudio API):** Sound effects (buzzer, clock ticking, winning fanfare, and bell) are synthesized natively in the browser without requiring external audio assets.
- **Dynamic Visuals:** Screen edge flashing triggers on buzzer press, and a confetti particle system celebrates the winning team.
- **Complete Game Management:** Setup screen to customize team names and friend-aid card counts.
- **Four Distinct Duel Rounds:**
  1. **Letter-by-Letter:** Classical turn-based poetry chaining with a 10-second timer.
  2. **Complete the Verse:** Show segments step-by-step; the fastest team gains points.
  3. **Thematic Challenge:** Chaining poetry around selected themes (e.g., Homeland, Sorrows, Pride).
  4. **Knockout Round:** High-stakes round using the buzzer for speed matching a single word.

## ⌨️ Host Keyboard Shortcuts

Hosts can run the entire game smoothly using the following keyboard shortcuts:

| Key | Action |
| :--- | :--- |
| `Space` | Start / Pause the countdown timer |
| `Enter` / `NumpadEnter` | Trigger Next Action (Next Verse / Next Theme / Next Word) |
| `1` / `Numpad1` | Ring buzzer for **Team 1** |
| `2` / `Numpad2` | Ring buzzer for **Team 2** |
| `3` / `Numpad3` | Burn friend-aid card for **Team 1** |
| `4` / `Numpad4` | Burn friend-aid card for **Team 2** |
| `Arrow Right` | Award point to **Team 1** |
| `Arrow Left` | Award point to **Team 2** |
| `R` / `r` | Reset the timer and buzzer |
| `F` / `f` | Toggle Fullscreen mode |
| `Escape` (On Winner Screen) | Go back to review results |

## 🚀 How to Run & Deploy

### Locally:
Simply download `index.html` and double-click it. It runs entirely client-side and offline.

### GitHub Pages Deployment:
1. Go to repository **Settings** on GitHub.
2. Navigate to **Pages** in the sidebar.
3. Under **Build and deployment**, select branch `main` and folder `/ (root)`.
4. Click **Save**. The live game URL will be ready within minutes.
