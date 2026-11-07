/* ==========================================================
   main.js — বেলুন, মোমবাতি, উইশ স্টিকার, কার্ড ও থিম
   ----------------------------------------------------------
   এই ফাইলে সাধারণত কিছু বদলানোর দরকার নেই।
   লেখা/ছবি বদলাতে → config.js বা অ্যাডমিন প্যানেল
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

/* ---------- বেলুন ---------- */
let balloonTimer = null;
let spawnedCount = 0;

function startBalloons() {
  const layer = $("intro");
  layer.classList.remove("hidden");
  popped = 0;
  spawnedCount = 0;
  updateCounter();
  spawnBalloon();
  balloonTimer = setInterval(() => {
    if (!$("intro").classList.contains("hidden") && !$("candleWrap").classList.contains("hidden")) {
      clearInterval(balloonTimer);
      return;
    }
    spawnBalloon();
  }, 900);
}

function spawnBalloon() {
  if ($("intro").classList.contains("hidden")) return;
  if (spawnedCount >= CONFIG.balloonsNeeded + 10) return;
  spawnedCount++;

  const b = document.createElement("div");
  b.className = "balloon";
  b.style.left = (5 + Math.random() * 85) + "%";
  b.style.setProperty("--dur", (7 + Math.random() * 5) + "s");

  const col = COLORS[Math.floor(Math.random() * COLORS.length)];
  b.innerHTML = '<div class="b-body" style="background:' + col + '"></div>';

  b.addEventListener("click", () => popBalloonAt(b));
  $("intro").appendChild(b);
  setTimeout(() => { if (b.parentNode) b.remove(); }, 12000);
}

function popBalloonAt(b) {
  if (b.classList.contains("pop")) return;
  b.classList.add("pop");

  const r = b.getBoundingClientRect();
  popBurst(r.left + r.width / 2, r.top + r.height / 2);

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
    setTimeout(() => showCandle(), 500);
  }
}

/* ---------- মোমবাতি ---------- */
function showCandle() {
  clearInterval(balloonTimer);
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

/* ---------- থিম বাটন (Customize প্যানেলের জন্য) ---------- */
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