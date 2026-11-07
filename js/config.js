/* ==========================================================
   config.js — তোমার সব কনটেন্ট এখানে
   ----------------------------------------------------------
   এই ফাইলটাই সবচেয়ে বেশি বদলাবে। প্রতিটা লাইনের উপরে কমেন্ট আছে।
   ছবি রাখার জায়গা: assets/ ফোল্ডার (GitHub এ আপলোড করো)
   ========================================================== */

const CONFIG = {

  /* ---------- ১ম পেজ: স্বাগত ---------- */

  // বন্ধুর নাম (প্রথম পেজ, কার্ড দুই জায়গাতেই আসবে)
  name: "Taiyaba",

  // ছোট নাম/নিকনেম (স্বাগত পেজে নামের নিচে ও মেমোরির শেষ লাইনে দেখাবে; খালি রাখলে দেখাবে না)
  nickname: "লেদা বাচ্চা",

  // স্বাগত পেজের ওপরের ছোট লাইন (অক্ষর একটা একটা করে ভাসবে)
  welcomeLine: "Happy Birthday to you",

  // উইশ পেজের শিরোনাম ও উপ-লেখা
  reelTitle: "Your wishes ✨",
  reelSub: "Every balloon you popped carried its own word",

  // প্রথম পেজের ছবি। খালি রাখলে 🎂 দেখাবে।  উদাহরণ: assets/intro.jpg
  introPhoto: "",

  // প্রথম পেজের নামের নিচের লেখা
  introText: "Someone very special is turning a year older today. I made this little world just for you. Tap Next to begin ✨",

  // ব্যাকগ্রাউন্ড গান। assets/ এ ফাইল রাখো, যেমন assets/birthday.mp3
  music: "assets/birthday.mp3",

  /* ---------- কার্ড (বেলুনের পরের পেজ) ---------- */

  // কার্ডের বড় শিরোনাম
  headline: "Happy Birthday!",

  // কার্ডের ছবি। খালি রাখলে 🎉 দেখাবে। উদাহরণ: assets/photo.jpg বা ইন্টারনেটের লিংক
  photo: "",

  // ছবির নিচের লেখা (একটা একটা করে ভেসে উঠবে)
  bottomText: "Another year of you being the best person I know. Thanks for every laugh and every late-night call. Hope today is as amazing as you are! 🎂",

  // \"Let's celebrate\" চাপলে যে লেখা আসবে
  cheer: "Happy Birthday, my friend! 🥳",

  /* ---------- ৩য় পেজ: মেমোরি (3D ঘূর্ণায়মান ছবি) ---------- */

  // মেমোরি পেজের শিরোনাম
  memoriesTitle: "Our memories 💖",

  // ৮টা ছবি ও ক্যাপশন (আরও যোগ করতে পারো)। ছবি রাখো assets/memory1.jpg ... memory8.jpg এ
  memories: [
    { photo: "assets/memory1.jpg", caption: "Our squad day together 💕" },
    { photo: "assets/memory2.jpg", caption: "Pink café vibes and happy faces ✨" }
  ],

  /* ---------- বন্ধুদের শুভেচ্ছা (৩য় পেজে ফ্লিপ কার্ড) ----------
     নতুন বন্ধু যোগ করতে: { name: "নাম", message: "শুভেচ্ছা" },
     অ্যারে খালি রাখলে এই সেকশন লুকিয়ে যাবে।
  ---------------------------------------------------- */
  friendWishes: [
    { name: "Rahul", message: "Happy birthday bro! Stay awesome always." },
    { name: "Sumaiya", message: "তুমি সবসময় এমন হাসিখুশি থেকো।" },
    { name: "Karim", message: "Best wishes on your special day!" }
  ],

  // \"Open my letter\" বোতামের চিঠি
  letter: `Dear Taiyaba,

Happy birthday! Thank you for being someone I can always count on.
Every year with you feels like a gift.

Wishing you everything your heart wants.

With love,
Your friend`,

  /* ---------- খেলার নিয়ম ---------- */

  // কতগুলো বেলুন ফাটালে মোমবাতি আসবে (যেমন বয়স 21)
  balloonsNeeded: 21,

  /* ---------- থিম ---------- */

  // ডিফল্ট থিম (themes.css এর নাম)
  theme: "sunshine",

  // Customize প্যানেলে যে থিমগুলো দেখাবে। নতুন থিম যোগ করলে এখানেও নাম দাও।
  THEME_NAMES: ["sunshine", "pastel", "ocean", "party"],

  /* ---------- বেলুনের কিওয়ার্ড ও মোটিভেশন ----------
     প্রতিটা আইটেম একটা বেলুনের জন্য। নতুন আইটেম: { word: "শব্দ", line: "লাইন" },
     লিস্টের চেয়ে বেশি বেলুন ফাটালে "Bonus wish #N" আসবে।
  ---------------------------------------------------- */
  balloonItems: [
    { word: "Courage",    line: "Be brave enough to start, even when it isn't perfect." },
    { word: "Joy",        line: "Find one reason to smile today." },
    { word: "Growth",     line: "Every year is a new chapter. Write it well." },
    { word: "Kindness",   line: "Be the reason someone feels seen." },
    { word: "Dream",      line: "Chase the thing that makes you lose track of time." },
    { word: "Strength",   line: "You have survived every hard day so far." },
    { word: "Friendship", line: "The best people are the ones who show up." },
    { word: "Adventure",  line: "Say yes to the unplanned road trip." },
    { word: "Peace",      line: "Let go of what you can't control." },
    { word: "Focus",      line: "Small steps every day build big things." },
    { word: "Love",       line: "Keep the people who make you feel like home." },
    { word: "Health",     line: "Take care of your body. It carries all your dreams." },
    { word: "Savings",    line: "Save a little, and spend a little on memories too." },
    { word: "Confidence", line: "Your voice matters. Use it loudly." },
    { word: "Laughter",   line: "Laugh loud, even at yourself." },
    { word: "Balance",    line: "Rest is part of the work." },
    { word: "Creativity", line: "Make something messy and beautiful today." },
    { word: "Gratitude",  line: "Count the good things. There are more than you think." },
    { word: "Patience",   line: "Good things bloom in their own time." },
    { word: "Hope",       line: "Tomorrow is a fresh page." },
    { word: "Glow",       line: "Shine in your own light, not someone else's." },
    { word: "Legend",     line: "Another year of being the legend you are." },
    { word: "Cake",       line: "Cake first, worry later. 🎂" }
  ]
};
