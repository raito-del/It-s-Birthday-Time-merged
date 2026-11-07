/* ==========================================================
   admin.js — অ্যাডমিন প্যানেল ও কাস্টমাইজ
   ----------------------------------------------------------
   • উপরে ডানে "A" → পাসওয়ার্ড → Customize → পেজ ট্যাব
   • প্রতিটা বদল সাথে সাথে পেজে দেখা যাবে
   • এই ব্রাউজারে সেভ হয়; ⬇ config.js ডাউনলোড করে GitHub এ দিলে সবার জন্য বদলাবে
   • পাসওয়ার্ড বদলাতে নিচের ADMIN_PASSWORD লাইনটা বদলাও
   ========================================================== */

/* পাসওয়ার্ড (এখন: 394) */
const ADMIN_PASSWORD = "394";

const SAVE_KEY = "birthdaySite:config:v2";

function mk(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

/* ---------- সেভ / লোড ---------- */
function saveConfig() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(CONFIG));
    return "ok";
  } catch (e) {
    return e && e.name === "QuotaExceededError" ? "full" : "off";
  }
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    Object.keys(saved).forEach(k => { CONFIG[k] = saved[k]; });
  } catch (e) {}
}

let saveTimer = null;

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const r = saveConfig();
    if (r === "ok") setStatus("✓ সেভ হয়েছে");
    else if (r === "full") setStatus("⚠️ ব্রাউজারে জায়গা শেষ। ছবি/গান কম দাও, বা config.js ডাউনলোড করে রাখো।");
    else setStatus("ℹ️ এই জায়গায় ব্রাউজারে সেভ বন্ধ। config.js ডাউনলোড করে রাখো।");
  }, 400);
}

function setStatus(t) { $("admStatus").textContent = t; }

/* ---------- ছবি ও গান প্রসেস ---------- */
function compressImage(file, maxW = 900) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const sc = Math.min(1, maxW / img.width);
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * sc);
        c.height = Math.round(img.height * sc);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = r.result;
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/* ---------- বেলুনের লেখা ↔ টেক্সট ---------- */
function itemsToText(items) {
  return items.map(it => it.word ? `${it.word} | ${it.line}` : it.line).join("\n");
}

function textToItems(text) {
  return text.split("\n").filter(l => l.trim()).map(l => {
    const idx = l.indexOf("|");
    if (idx === -1) return { word: "", line: l.trim() };
    return { word: l.slice(0, idx).trim(), line: l.slice(idx + 1).trim() };
  });
}

/* ---------- ফিল্ড তৈরির সহায়ক ---------- */
function inputField(label, value, onChange, multi = false) {
  const w = mk("div", "adm-field");
  w.appendChild(mk("label", "", label));
  const el = mk(multi ? "textarea" : "input");
  el.value = value ?? "";
  el.oninput = () => onChange(el.value);
  w.appendChild(el);
  return w;
}

function imageField(label, obj, prop) {
  const w = mk("div", "adm-field");
  w.appendChild(mk("label", "", label));
  const row = mk("div", "adm-img");

  const src = obj[prop];
  const prev = mk("div", "adm-prev");
  if (src) {
    const im = mk("img");
    im.src = src;
    im.onerror = () => { prev.textContent = "⚠️"; };
    prev.appendChild(im);
  } else {
    prev.textContent = "🖼️";
  }

  const right = mk("div", "adm-imgRight");

  const url = mk("input");
  url.placeholder = "ছবির লিংক বা assets/xyz.jpg";
  url.value = src && !src.startsWith("data:") ? src : "";
  url.onchange = () => { obj[prop] = url.value.trim(); App.refresh(); renderTab(); };

  const up = mk("button", "adm-btn", "📤 ছবি আপলোড");
  const file = mk("input");
  file.type = "file";
  file.accept = "image/*";
  file.style.display = "none";
  up.onclick = () => file.click();
  file.onchange = async () => {
    const f = file.files[0];
    if (!f) return;
    setStatus("ছবি প্রসেস হচ্ছে...");
    try {
      obj[prop] = await compressImage(f);
      App.refresh();
      renderTab();
    } catch (e) {
      setStatus("⚠️ এই ছবিটি পড়া গেল না");
    }
  };

  const del = mk("button", "adm-btn ghost", "🗑 মুছুন");
  del.onclick = () => { obj[prop] = ""; App.refresh(); renderTab(); };

  right.append(url, up, del, file);
  row.append(prev, right);
  w.appendChild(row);
  return w;
}

/* ---------- প্রতিটা পেজের কাস্টমাইজ ফিল্ড ---------- */
const TABS = [
  ["welcome", "স্বাগত"], ["balloons", "বেলুন"], ["reel", "উইশ"], ["card", "কার্ড"],
  ["memories", "মেমোরি"], ["friends", "শুভেচ্ছা"], ["letter", "চিঠি"],
  ["music", "গান"], ["theme", "থিম"], ["export", "এক্সপোর্ট"]
];

let curTab = "welcome";

const BUILD = {
  welcome: () => [
    imageField("স্বাগত পেজের ছবি", CONFIG, "introPhoto"),
    inputField("ওপরের ছোট লাইন", CONFIG.welcomeLine, v => { CONFIG.welcomeLine = v; App.refresh(); }),
    inputField("নাম (বড় করে দেখাবে, কার্ডেও যাবে)", CONFIG.name, v => { CONFIG.name = v; App.refresh(); }),
    inputField("ছোট নাম / নিকনেম (নামের নিচে)", CONFIG.nickname, v => { CONFIG.nickname = v; App.refresh(); }),
    inputField("নামের নিচের লেখা", CONFIG.introText, v => { CONFIG.introText = v; App.refresh(); }, true)
  ],

  balloons: () => [
    inputField("কতগুলো বেলুন ফাটালে মোমবাতি আসবে", CONFIG.balloonsNeeded, v => {
      const n = parseInt(v, 10);
      if (n > 0) { CONFIG.balloonsNeeded = n; App.refresh(); }
    }),
    inputField("বেলুনের লেখা: প্রতি লাইনে একটা — কিওয়ার্ড | লাইন", itemsToText(CONFIG.balloonItems), v => {
      CONFIG.balloonItems = textToItems(v);
      scheduleSave();
    }, true)
  ],

  reel: () => [
    inputField("উইশ পেজের শিরোনাম", CONFIG.reelTitle, v => { CONFIG.reelTitle = v; App.refresh(); }),
    inputField("উইশ পেজের উপ-লেখা", CONFIG.reelSub, v => { CONFIG.reelSub = v; App.refresh(); }, true)
  ],

  card: () => [
    inputField("কার্ডের শিরোনাম", CONFIG.headline, v => { CONFIG.headline = v; App.refresh(); }),
    imageField("কার্ডের ছবি", CONFIG, "photo"),
    inputField("ছবির নিচের লেখা (একটা একটা করে ভাসবে)", CONFIG.bottomText, v => { CONFIG.bottomText = v; App.refresh(); }, true),
    inputField("Celebrate-এ যে লেখা আসবে", CONFIG.cheer, v => { CONFIG.cheer = v; App.refresh(); })
  ],

  memories: () => {
    const out = [
      inputField("মেমোরি পেজের শিরোনাম", CONFIG.memoriesTitle, v => { CONFIG.memoriesTitle = v; App.refresh(); })
    ];
    CONFIG.memories.forEach((m, i) => {
      const box = mk("div", "adm-card");
      box.appendChild(mk("b", "", `ছবি ${i + 1}`));
      box.appendChild(imageField("ছবি", m, "photo"));
      box.appendChild(inputField("ক্যাপশন", m.caption, v => { m.caption = v; App.refresh(); }, true));
      const del = mk("button", "adm-btn ghost", "🗑 এই ছবি মুছুন");
      del.onclick = () => { CONFIG.memories.splice(i, 1); App.refresh(); renderTab(); };
      box.appendChild(del);
      out.push(box);
    });
    const add = mk("button", "adm-btn", "➕ নতুন ছবি যোগ");
    add.onclick = () => { CONFIG.memories.push({ photo: "", caption: "" }); App.refresh(); renderTab(); };
    out.push(add);
    return out;
  },

  friends: () => {
    const out = [mk("p", "adm-note", "বন্ধুর নাম আর শুভেচ্ছা যোগ/বদল/মুছে দাও। মেমোরি পেজে Friends' Wishes-এ নামে ক্লিক করলে চিঠি খুলবে।")];
    CONFIG.friendWishes.forEach((w, i) => {
      const box = mk("div", "adm-card");
      box.appendChild(inputField("নাম", w.name, v => { w.name = v; App.refresh(); }));
      box.appendChild(inputField("শুভেচ্ছা", w.message, v => { w.message = v; App.refresh(); }, true));
      const del = mk("button", "adm-btn ghost", "🗑 মুছুন");
      del.onclick = () => { CONFIG.friendWishes.splice(i, 1); App.refresh(); renderTab(); };
      box.appendChild(del);
      out.push(box);
    });
    const add = mk("button", "adm-btn", "➕ নতুন বন্ধু");
    add.onclick = () => { CONFIG.friendWishes.push({ name: "নতুন বন্ধু", message: "Happy birthday!" }); App.refresh(); renderTab(); };
    out.push(add);
    return out;
  },

  letter: () => [
    inputField("চিঠির লেখা", CONFIG.letter, v => { CONFIG.letter = v; App.refresh(); }, true)
  ],

  music: () => {
    const up = mk("button", "adm-btn", "🎵 গান আপলোড (সর্বোচ্চ ৪MB)");
    const file = mk("input");
    file.type = "file";
    file.accept = "audio/*";
    file.style.display = "none";
    up.onclick = () => file.click();
    file.onchange = async () => {
      const f = file.files[0];
      if (!f) return;
      if (f.size > 4 * 1024 * 1024) { setStatus("⚠️ গান ৪MB এর বেশি। ছোট ফাইল দাও।"); return; }
      CONFIG.music = await readAsDataURL(f);
      App.refresh();
      renderTab();
    };
    const isData = (CONFIG.music || "").startsWith("data:");
    return [
      inputField("গানের লিংক বা ফাইল পথ (যেমন assets/birthday.mp3)", isData ? "" : CONFIG.music, v => {
        CONFIG.music = v.trim();
        App.refresh();
      }),
      mk("p", "adm-note", isData ? "✓ আপলোড করা গান এখন চালু আছে" : ""),
      up,
      file
    ];
  },

  theme: () => {
    const wrap = mk("div", "adm-themes");
    CONFIG.THEME_NAMES.forEach(name => {
      const b = mk("button");
      b.dataset.swatch = name;
      b.title = name;
      b.onclick = () => { CONFIG.theme = name; App.refresh(); };
      wrap.appendChild(b);
    });
    return [mk("p", "adm-note", "একটা রঙের থিম বেছে নাও"), wrap];
  },

  export: () => {
    const b1 = mk("button", "adm-big", "⬇ config.js ডাউনলোড");
    b1.onclick = exportConfig;
    const note = mk("p", "adm-note", "এই ফাইল দিয়ে js/config.js বদলালে সবার জন্য পেজ বদলাবে। ছবি ও গানও ফাইলের ভেতরে থাকবে।");
    const b2 = mk("button", "adm-big ghost", "↺ সব রিসেট (ডিফল্টে ফিরবে)");
    b2.onclick = resetAll;
    return [b1, note, b2];
  }
};

function renderTabs() {
  const box = $("admTabs");
  box.innerHTML = "";
  TABS.forEach(([id, label]) => {
    const b = mk("button", id === curTab ? "on" : "", label);
    b.onclick = () => { curTab = id; renderTabs(); renderTab(); };
    box.appendChild(b);
  });
}

function renderTab() {
  const body = $("admBody");
  body.innerHTML = "";
  BUILD[curTab]().forEach(n => body.appendChild(n));
}

/* ---------- এক্সপোর্ট ও রিসেট ---------- */
function exportConfig() {
  const text = "/* config.js — Admin থেকে এক্সপোর্ট */\nconst CONFIG = " + JSON.stringify(CONFIG, null, 2) + ";\n";
  const a = mk("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/javascript" }));
  a.download = "config.js";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setStatus("✓ config.js ডাউনলোড হয়েছে");
}

function resetAll() {
  if (!confirm("সব কাস্টমাইজ মুছে ডিফল্টে ফিরবে। নিশ্চিত?")) return;
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
  location.reload();
}

/* ---------- প্যানেল দেখানো ও পাসওয়ার্ড ---------- */
function currentPageId() {
  const vis = id => !$(id).classList.contains("hidden");
  if (vis("memories")) return "memories";
  if (vis("welcome")) return "welcome";
  if (vis("card")) return "card";
  if (vis("reel")) return "reel";
  if (vis("intro")) return "balloons";
  return "welcome";
}

function openAdmin() {
  $("adminPanel").classList.add("open");
  showLock();
}

function closeAdmin() { $("adminPanel").classList.remove("open"); }

function showLock() {
  $("admLock").classList.remove("hidden");
  $("admHome").classList.add("hidden");
  $("admEditor").classList.add("hidden");
  $("admTitle").textContent = "Admin";
  $("admPass").value = "";
  $("admLockMsg").textContent = "";
  setTimeout(() => $("admPass").focus(), 300);
}

function tryUnlock() {
  if ($("admPass").value.trim() === ADMIN_PASSWORD) {
    $("admLock").classList.add("hidden");
    showHome();
  } else {
    $("admLockMsg").textContent = "ভুল পাসওয়ার্ড, আবার চেষ্টা করো";
    $("admPass").value = "";
  }
}

function showHome() {
  $("admHome").classList.remove("hidden");
  $("admEditor").classList.add("hidden");
  $("admTitle").textContent = "Admin";
  setStatus("");
}

function showEditor() {
  curTab = currentPageId();
  $("admHome").classList.add("hidden");
  $("admEditor").classList.remove("hidden");
  $("admTitle").textContent = "Customize";
  renderTabs();
  renderTab();
}

$("adminBtn").onclick = openAdmin;
$("admClose").onclick = closeAdmin;
$("admUnlock").onclick = tryUnlock;
$("admPass").addEventListener("keydown", e => { if (e.key === "Enter") tryUnlock(); });
$("admGoCustomize").onclick = showEditor;
$("admBack").onclick = showHome;
$("admExport").onclick = exportConfig;

/* ---------- পেজ রিফ্রেশ: সব কিছু CONFIG থেকে আবার আঁকে ---------- */
App.refresh = function () {
  App.applyTheme(CONFIG.theme);
  App.renderCard();
  App.renderBottomLetters();
  App.updateCounter();
  App.renderWelcome();
  App.renderReel();
  $("letterText").textContent = CONFIG.letter;

  const a = $("bgMusic");
  const want = CONFIG.music || "";
  if (a.getAttribute("src") !== want) {
    a.pause();
    a.src = want;
    $("musicBtn").textContent = "▶ Music";
  }

  $("wishesBtn").classList.toggle("hidden", !(CONFIG.friendWishes || []).length);
  if (memBuilt) App.buildMemories(false);
  scheduleSave();
};

/* শুরু: সেভ করা কাস্টমাইজ লোড করে পেজে লাগাও */
loadSaved();
App.refresh();