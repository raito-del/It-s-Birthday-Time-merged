/* ==========================================================
   pages.js — স্বাগত পেজ, উইশ পেজ, মেমোরি (3D), শুভেচ্ছা শিট,
              বন্ধুর চিঠি, লাইটবক্স, মিউজিক
   ----------------------------------------------------------
   ফ্লো: বেলুন → মোমবাতি → উইশ → কার্ড → স্বাগত পেজ → মেমোরি
   লেখা ও ছবি বদলাতে → অ্যাডমিন প্যানেল (উপরে ডানে "A") বা config.js
   ========================================================== */

/* অক্ষর একটা একটা করে ভাসানো */
function lettersInto(el, text, step = 0.04) {
  el.innerHTML = "";
  [...text].forEach((ch, i) => {
    const s = document.createElement("span");
    s.textContent = ch === " " ? "\u00A0" : ch;
    s.style.animationDelay = (i * step) + "s";
    el.appendChild(s);
  });
}

/* লেখা একটা একটা করে টাইপ হওয়া */
function typeText(el, text, speed = 60) {
  clearInterval(el._t);
  const chars = [...text];
  el.textContent = "";
  let i = 0;
  el._t = setInterval(() => {
    el.textContent += chars[i++];
    if (i >= chars.length) clearInterval(el._t);
  }, speed);
}

/* ছবি থাকলে দেখাবে, না থাকলে বা লোড না হলে fallback */
function imgOrFallback(container, src, fallback) {
  container.innerHTML = "";
  if (!src) { container.textContent = fallback; return; }
  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  img.onerror = () => { container.textContent = fallback; };
  container.appendChild(img);
}

/* ---------- স্বাগত ও উইশ পেজের লেখা ---------- */
function renderWelcome() {
  imgOrFallback($("introPhoto"), CONFIG.introPhoto, "🎂");
  lettersInto($("welcomeLine"), CONFIG.welcomeLine || "");
  $("welcomeName").textContent = CONFIG.name;
  $("welcomeNick").textContent = CONFIG.nickname ? "💛 " + CONFIG.nickname + " 💛" : "";
  $("welcomeText").textContent = CONFIG.introText;
}

function renderReel() {
  $("reelTitle").textContent = CONFIG.reelTitle;
  $("reelSub").textContent = CONFIG.reelSub;
}

/* ---------- মিউজিক ---------- */
function setupMusic() { $("bgMusic").src = CONFIG.music || ""; }

$("musicBtn").onclick = () => {
  const a = $("bgMusic");
  if (a.paused) {
    a.play()
      .then(() => { $("musicBtn").textContent = "⏸ Music"; $("musicStatus").textContent = ""; })
      .catch(() => { $("musicStatus").textContent = "Music পাওয়া যায়নি। অ্যাডমিন → গান থেকে ঠিক করো।"; });
  } else {
    a.pause();
    $("musicBtn").textContent = "▶ Music";
  }
};

/* ---------- কার্ড → স্বাগত পেজ ---------- */
$("toMemories").onclick = () => {
  $("card").classList.add("hidden");
  const w = $("welcome");
  w.classList.remove("hidden", "leaving");
  burstConfetti(true);
};

$("welcomeNext").onclick = () => {
  const w = $("welcome");
  w.classList.add("leaving");
  setTimeout(() => {
    w.classList.add("hidden");
    openMemories();
  }, 600);
};

/* ---------- মেমোরি পেজ ---------- */
let memBuilt = false;

function openMemories() {
  $("memories").classList.remove("hidden");
  buildMemories(true);
  burstConfetti(true);
}

function numBadge(i) {
  const n = document.createElement("div");
  n.className = "num";
  n.textContent = i + 1;
  return n;
}

function buildMemories(animate) {
  memBuilt = true;
  $("memTitle").textContent = CONFIG.memoriesTitle;

  const car = $("carousel");
  car.innerHTML = "";
  const list = CONFIG.memories;
  const n = list.length || 1;
  const radius = window.innerWidth < 600 ? 150 : 260;

  list.forEach((m, i) => {
    const item = document.createElement("div");
    item.className = "c3d";
    item.style.setProperty("--a", (i * 360 / n) + "deg");
    item.style.setProperty("--r", radius + "px");

    if (m.photo) {
      const img = document.createElement("img");
      img.src = m.photo;
      img.alt = "Memory " + (i + 1);
      img.onerror = () => { img.remove(); item.appendChild(numBadge(i)); };
      item.appendChild(img);
    } else {
      item.appendChild(numBadge(i));
    }

    item.onclick = () => openLightbox(i);
    car.appendChild(item);
  });

  buildFriends();
  $("wishesBtn").classList.toggle("hidden", !(CONFIG.friendWishes || []).length);

  const nick = CONFIG.nickname ? ` (${CONFIG.nickname})` : "";
  const final = `Happy Birthday, ${CONFIG.name}${nick}! 🎂`;
  if (animate) {
    typeText($("finalLine"), final, 70);
  } else {
    clearInterval($("finalLine")._t);
    $("finalLine").textContent = final;
  }
}

/* ---------- Friends' Wishes শিট ও বন্ধুর চিঠি ---------- */
function buildFriends() {
  const grid = $("flipGrid");
  grid.innerHTML = "";

  (CONFIG.friendWishes || []).forEach((w, i) => {
    const card = document.createElement("div");
    card.className = "flip";
    card.style.animationDelay = (i * 0.1) + "s";

    const face = document.createElement("div");
    face.className = "face front";

    const av = document.createElement("div");
    av.className = "av";
    av.textContent = (w.name || "?").charAt(0).toUpperCase();

    const nm = document.createElement("b");
    nm.textContent = w.name;

    const sm = document.createElement("small");
    sm.textContent = "tap to read 💌";

    face.append(av, nm, sm);
    card.appendChild(face);
    card.onclick = () => openFriendLetter(w);
    grid.appendChild(card);
  });
}

function openWishes() { $("wishSheet").classList.add("open"); }
function closeWishes() { $("wishSheet").classList.remove("open"); }

$("wishesBtn").onclick = openWishes;
$("closeWishes").onclick = closeWishes;
$("wishSheet").onclick = e => { if (e.target.id === "wishSheet") closeWishes(); };

function openFriendLetter(w) {
  $("flName").textContent = "💌 " + w.name;
  $("flMsg").textContent = w.message;
  $("friendLetter").classList.add("open");
}

function closeFriendLetter() { $("friendLetter").classList.remove("open"); }

$("flClose").onclick = closeFriendLetter;
$("friendLetter").onclick = e => { if (e.target.id === "friendLetter") closeFriendLetter(); };

/* ---------- লাইটবক্স ---------- */
let lbIndex = 0;

function openLightbox(i) {
  if (!CONFIG.memories.length) return;
  lbIndex = i;
  updateLightbox();
  $("lightbox").classList.add("open");
}

function closeLightbox() { $("lightbox").classList.remove("open"); }

function updateLightbox() {
  const m = CONFIG.memories[lbIndex];
  const img = $("lbImg");
  img.style.display = m.photo ? "block" : "none";
  img.src = m.photo || "";
  img.onerror = () => { img.style.display = "none"; };
  $("lbCaption").textContent = m.caption;
}

function lbMove(step) {
  const n = CONFIG.memories.length;
  if (!n) return;
  lbIndex = (lbIndex + step + n) % n;
  updateLightbox();
}

$("lbClose").onclick = closeLightbox;
$("lbPrev").onclick = () => lbMove(-1);
$("lbNext").onclick = () => lbMove(1);
$("lightbox").onclick = e => { if (e.target.id === "lightbox") closeLightbox(); };

let touchX = null;
$("lightbox").addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
$("lightbox").addEventListener("touchend", e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) lbMove(dx < 0 ? 1 : -1);
  touchX = null;
});

/* ---------- চিঠি ও রিপ্লে ---------- */
$("letterBtn").onclick = () => $("letterModal").classList.add("open");
$("letterModal").onclick = e => {
  if (e.target.id === "letterModal") $("letterModal").classList.remove("open");
};
$("replayBtn").onclick = () => location.reload();

/* ---------- Escape কী ও তীর কী ---------- */
document.addEventListener("keydown", e => {
  const lbOpen = $("lightbox").classList.contains("open");
  if (lbOpen && e.key === "ArrowLeft") return lbMove(-1);
  if (lbOpen && e.key === "ArrowRight") return lbMove(1);
  if (e.key !== "Escape") return;
  if ($("friendLetter").classList.contains("open")) return closeFriendLetter();
  if (lbOpen) return closeLightbox();
  if ($("wishSheet").classList.contains("open")) return closeWishes();
  if ($("adminPanel").classList.contains("open")) return closeAdmin();
});

/* ---------- শুরু ---------- */
Object.assign(App, { renderWelcome, renderReel, buildMemories });
$("letterText").textContent = CONFIG.letter;
renderWelcome();
renderReel();
setupMusic();
startBalloons();