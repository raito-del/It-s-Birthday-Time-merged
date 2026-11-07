/* ==========================================================
   config.js — তোমার সব কনটেন্ট এখানে
   ----------------------------------------------------------
   প্রতিটা লাইনের উপরে কমেন্ট দেওয়া আছে।
   ছবি রাখার জায়গা: assets/ ফোল্ডার
   ========================================================== */

const CONFIG = {

  /* ---------- ১ম পেজ: স্বাগত ---------- */

  // বন্ধুর নাম (স্বাগত পেজ ও কার্ডে আসবে)
  name: "Taiyaba",

  // ছোট নাম/নিকনেম (নামের নিচে দেখাবে; খালি রাখলে দেখাবে না)
  nickname: "লেদা বাচ্চা",

  // স্বাগত পেজের ওপরের ছোট লাইন (অক্ষর একটা একটা করে ভাসবে)
  welcomeLine: "Wishing you the happiest day",

  // স্বাগত পেজের ছবি (assets/intro.jpg)। খালি রাখলে 🎂 দেখাবে।
  introPhoto: "assets/intro.jpg",

  // স্বাগত পেজের নামের নিচের লেখা
  introText: "Someone very special is turning a year older today. I made this little world just for you. Tap Next to begin ✨",

  // ব্যাকগ্রাউন্ড গান। assets/ ফোল্ডারে ফাইল রাখো, যেমন assets/birthday.mp3
  music: "assets/birthday.mp3",

  /* ---------- বেলুন ও উইশ পেজ ---------- */

  // কতগুলো বেলুন ফাটালে মোমবাতি আসবে
  balloonsNeeded: 21,

  // উইশ পেজের শিরোনাম ও উপ-লেখা
  reelTitle: "Your wishes ✨",
  reelSub: "Every balloon you popped carried its own word",

  // বেলুনের কিওয়ার্ড ও লাইন। প্রতিটা আইটেম একটা বেলুনের জন্য।
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
  ],

  /* ---------- কার্ড ---------- */

  // কার্ডের বড় শিরোনাম
  headline: "Happy Birthday!",

  // কার্ডের ছবি (assets/photo.jpg)। খালি রাখলে 🎉 দেখাবে।
  photo: "assets/photo.jpg",

  // ছবির নিচের লেখা (একটা একটা করে ভেসে উঠবে)
  bottomText: "Another year older. Same chaos. Happy birthday, লেদা বাচ্চা. Stay mad, stay you. 🎉",

  // "Let's celebrate" চাপলে যে লেখা আসবে
  cheer: "Happy Birthday, my friend! 🥳",

  /* ---------- ৩য় পেজ: মেমোরি (3D ঘূর্ণায়মান ছবি) ---------- */

  // মেমোরি পেজের শিরোনাম
  memoriesTitle: "Our memories 💖",

  // মেমোরির ছবি ও ক্যাপশন (assets/memory1.jpg ... memory9.jpg)
  memories: [
    { photo: "assets/memory1.jpg", caption: "Our squad day together 💕" },
    { photo: "assets/memory2.jpg", caption: "Pink café vibes and happy faces ✨" },
    { photo: "assets/memory3.jpg", caption: "Our fun day out together 🌿" },
    { photo: "assets/memory4.jpg", caption: "Campus squad, thumbs up 👍" },
    { photo: "assets/memory5.jpg", caption: "Group selfie with the crew 📸" },
    { photo: "assets/memory6.jpg", caption: "Phone break under the trees 📱" },
    { photo: "assets/memory7.jpg", caption: "Hanging out on the field 🏏" },
    { photo: "assets/memory8.jpg", caption: "Walking together, always 💕" },
    { photo: "assets/memory9.jpg", caption: "Pretty smile, pretty memory 🌼" }
  ],

  /* ---------- বন্ধুদের শুভেচ্ছা ----------
     নতুন বন্ধু যোগ করতে: { name: "নাম", message: `লেখা` },
     লেখা একাধিক লাইনে হলে ব্যাকটিক (`) দিয়ে ঘেরো।
     খালি রাখলে এই অংশ লুকিয়ে যাবে।
  ---------------------------------------------------- */
  friendWishes: [
    { name: "Mim", message: `Happy birthday, picchu! 🎂

Keep smiling, keep dreaming, and keep shining. May your big dreams turn into beautiful realities.

your kolizer mim` },

    { name: "Wasika", message: `Happy birthday, Taiyaba 🎉
নতুন বছরে তোর সব স্বপ্ন পূরণ হোক। তুই যেখানেই থাকিস না কেন, তোর উপস্থিতিটা সবসময় বোঝা যায়। সব কথা সবার মনে গেঁথে যায়।

আর তুই যেভাবে সবসময় আমাকে সাপোর্ট করিস তার জন্য আমি অনেক blessed … এভাবেই হাসতে থাকিস, ছোটো বাচ্চার মতো।

তোর ওয়াসিকা। 🌸` },

    { name: "Labbaik", message: `Happy birthday! 🥳

Assalamualaikum, Taiyaba.

🎊 Happy Birthday! 🎊
May your birthday be full of love, laughter and blessings. Enjoy every single moment today. Hope your day is as awesome as you are 🎉✨

Have a wonderful day! ✨` }
  ],

  /* ---------- চিঠি ("Open my letter" বোতাম) ---------- */
  letter: `Dear Taiyaba,

Happy birthday! একটা বছর বড় হয়ে গেলি, কিন্তু আমাদের মধ্যের এই পাগলামিটা একই রকম আছে। 😄

Honestly, তোর মতো একজন বন্ধু পাওয়াটা অনেক বড় ব্যাপার। যেকোনো সমস্যায়, যেকোনো সময়ে শুধু একবার বলিস। আমরা তোর পাশে আছি, সবসময়।

Stay healthy, stay happy, আর নিজের মতো থাক। তোর প্রতিটা দিন যেন ভালো কাটে।

Love,
তোর বন্ধু saduuuuuuuuuuuuuuuuuuuuuuuu 💛`,

  /* ---------- থিম ---------- */

  // ডিফল্ট থিম (themes.css এর নাম)
  theme: "sunshine",

  // Customize প্যানেলে যে থিমগুলো দেখাবে
  THEME_NAMES: ["sunshine", "pastel", "ocean", "party"]
};