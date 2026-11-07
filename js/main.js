/* ==========================================================
   main.js — বেলুন, মোমবাতি, উইশ স্টিকার, কার্ড ও থিম
   ----------------------------------------------------------
   বেলুন: টানা আসবে, আলাদা আলাদা লেনে, দ্রুত গতিতে।
   পপ শব্দ: কোডের ভেতরে তৈরি (কোনো বাইরের ফাইল লাগে না)।
   ========================================================== */

const COLORS = ["#ff8fb1", "#ffd166", "#06d6a0", "#118ab2", "#c77dff", "#ff9f1c", "#4cc9f0", "#f72585"];

const $ = id => document.getElementById(id);

/* ---------- থিম ---------- */
function applyTheme(name) {
  if (!CONFIG.THEME_NAMES.includes(name)) name = CONFIG.THEME_NAMES[0];
  CONFIG.theme = name;
  document.documentElement.setAttribute("data-theme", name);
}

/* ---------- কার্ড ---------- */
function renderCard() {
  $("nameLine").textContent = "Dear " + CONFIG.name + ",";
  $("headline").textContent = CONFIG.headline;
  $("cheer").textContent = CONFIG.cheer;
  const photo = $("photo");
  photo.innerHTML = "";
  if (CONFIG.photo) {
    const img = document.createElement("img");
    img.src = CONFIG.photo;
    img.alt = "";
    img.onerror = () => { photo.textContent = "🎉"; };
    photo.appendChild(img);
  } else {
    photo.textContent = "🎉";
  }
}

function renderBottomLetters() {
  const box = $("bottomText");
  box.innerHTML = "";
  [...CONFIG.bottomText].forEach((ch, i) => {
    const s = document.createElement("span");
    s.textContent = ch === " " ? "\u00A0" : ch;
    s.style.animationDelay = (i * 0.03) + "s";
    box.appendChild(s);
  });
}

/* ---------- কাউন্টার ---------- */
let popped = 0;

function updateCounter() {
  $("popCount").textContent = popped;
  $("needCount").textContent = CONFIG.balloonsNeeded;
}

/* ---------- ছোট ইফেক্ট ---------- */
function burstConfetti(big) {
  const layer = $("decoLayer");
  const n = big ? 60 : 24;
  for (let i = 0; i < n; i++) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = COLORS[i % COLORS.length];
    c.style.animationDuration = (2.5 + Math.random() * 2) + "s";
    c.style.animationDelay = Math.random() * 0.5 + "s";
    layer.appendChild(c);
    setTimeout(() => c.remove(), 4800);
  }
}

function popBurst(x, y) {
  for (let i = 0; i < 14; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.style.left = x + "px";
    p.style.top = y + "px";
    p.style.background = COLORS[i % COLORS.length];
    const a = Math.random() * Math.PI * 2;
    const d = 40 + Math.random() * 70;
    p.style.setProperty("--x", Math.cos(a) * d + "px");
    p.style.setProperty("--y", Math.sin(a) * d + "px");
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

/* ---------- পপ শব্দ (কোডের ভেতরেই তৈরি) ---------- */
let audioCtx = null;

function playPop() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime;

    // "ফট" অংশ: নিচে নামা একটা সুর
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(620, t);
    o.frequency.exponentialRampToValueAtTime(110, t + 0.12);
    g.gain.setValueAtTime(0.45, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start(t);
    o.stop(t + 0.17);

    // "টট" অংশ: ছোট একটা নয়েজ ঝলক
    const len = Math.floor(audioCtx.sampleRate * 0.04);
    const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = audioCtx.createBufferSource();
    const f = audioCtx.createBiquadFilter();
    const g2 = audioCtx.createGain();
    src.buffer = buf;
    f.type = "highpass";
    f.frequency.value = 1200;
    g2.gain.value = 0.35;
    src.connect(f);
    f.connect(g2);
    g2.connect(audioCtx.destination);
    src.start(t + 0.01);
  } catch (e) {}
}

/* ---------- বেলুন ---------- */
let balloonTimer = null;
let laneBag = [];
const LANES = 8;

// লেন একটা একটা করে ঘুরবে, যাতে বেলুনগুলো একজায়গায় জড়ো না হয়
function nextLane() {
  if (!laneBag.length) {
    laneBag = [];
    for (let i = 0; i < LANES; i++) laneBag.push(i);
    for (let i = laneBag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [laneBag[i], laneBag[j]] = [laneBag[j], laneBag[i]];
    }
  }
  return laneBag.pop();
}

function canSpawn() {
  return !$("intro").classList.contains("hidden") && $("candleWrap").classList.contains("hidden");
}

function startBalloons() {
  $("intro").classList.remove("hidden");
  $("candleWrap").classList.add("hidden");
  popped = 0;
  updateCounter();
  spawnBalloon();
  scheduleNextSpawn();
}

function scheduleNextSpawn() {
  clearTimeout(balloonTimer);
  if (!canSpawn()) return;
  balloonTimer = setTimeout(() => {
    spawnBalloon();
    scheduleNextSpawn();
  }, 550 + Math.random() * 450);
}

function spawnBalloon() {
  if (!canSpawn()) return;
  // একসাথে খুব বেশি বেলুন স্ক্রিনে থাকবে না
  if ($("intro").querySelectorAll(".balloon").length >= 22) return;

  const lane = nextLane();
  const left = 4 + lane * 11.5 + (Math.random() * 4 - 2);

  const b = document.createElement("div");
  b.className = "balloon";
  b.style.left = left + "%";
  // গতি: 4.5 থেকে 7 সেকেন্ডে স্ক্রিন পার হবে
  b.style.setProperty("--dur", (4.5 + Math.random() * 2.5) + "s");

  const col = COLORS[Math.floor(Math.random() * COLORS.length)];
  b.innerHTML = '<div class="b-body" style="background:' + col + '"></div>';

  b.addEventListener("click", () => popBalloonAt(b));
  b.addEventListener("animationend", () => b.remove());
  $("intro").appendChild(b);
}

function popBalloonAt(b) {
  if (b.classList.contains("pop")) return;
  b.classList.add("pop");

  const r = b.getBoundingClientRect();
  popBurst(r.left + r.width / 2, r.top + r.height / 2);
  playPop();

  popped++;
  updateCounter();

  const idx = popped - 1;
  const item = CONFIG.balloonItems[idx];
  const text = item
    ? (item.word ? item.word + ": " + item.line : item.line)
    : "Bonus wish #" + (idx - CONFIG.balloonItems.length + 1) + " 🎈";
  addSticker(item ? item.word || "" : "Bonus", text);
  setTimeout(() => b.remove(), 300);

  if (popped >= CONFIG.balloonsNeeded) {
    clearTimeout(balloonTimer);
    setTimeout(() => showCandle(), 500);
  }
}

// ট্যাব অন্য কাজে ব্যস্ত থাকার পর ফিরে এলে বেলুন আবার চালু হবে
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && canSpawn()) scheduleNextSpawn();
});

/* ---------- মোমবাতি ---------- */
function showCandle() {
  clearTimeout(balloonTimer);
  $("candleWrap").classList.remove("hidden");
  $("flame").onclick = blowCandle;
}

function blowCandle() {
  const f = $("flame");
  if (f.classList.contains("out")) return;
  f.classList.add("out");
  burstConfetti(true);
  setTimeout(() => {
    $("intro").classList.add("hidden");
    showReel();
  }, 1200);
}

/* ---------- উইশ পেজ (স্টিকার) ---------- */
function addSticker(word, text) {
  const s = document.createElement("div");
  s.className = "sticker";
  s.style.background = COLORS[Math.floor(Math.random() * COLORS.length)] + "55";
  s.innerHTML = '<span class="kw"></span><span class="tx"></span>';
  s.querySelector(".kw").textContent = word;
  s.querySelector(".tx").textContent = text;
  $("stickers").appendChild(s);
}

function showReel() {
  $("reel").classList.remove("hidden");
  renderReel();
}

$("openCard").onclick = () => {
  $("reel").classList.add("hidden");
  $("card").classList.remove("hidden");
  renderCard();
  renderBottomLetters();
  $("cheer").classList.add("hidden");
  $("celebrate").style.display = "";
};

$("celebrate").onclick = () => {
  $("celebrate").style.display = "none";
  $("cheer").classList.remove("hidden");
  burstConfetti(true);
};

/* ---------- অন্যান্য ফাংশন বাইরে থেকে ডাকার জন্য ---------- */
window.App = {
  applyTheme,
  renderCard,
  renderBottomLetters,
  updateCounter
};

/* ---------- শুরু ---------- */
(function init() {
  applyTheme(CONFIG.theme);
  renderCard();
  renderBottomLetters();
  updateCounter();
})();