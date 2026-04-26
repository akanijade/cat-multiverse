const universes = [
  {
    name: "Space Cats",
    color: "#0b0f2a",
    textColor: "#ffffff",
    lore: "Nebula Cat bends gravity with a meow.",
    image: "images/cat1.png",
    sound: "sounds/space.wav"
  },
  {
    name: "Cyber Cats",
    color: "#111",
    textColor: "#00ffcc",
    lore: "Hacker Cat controls the entire internet.",
    image: "images/cat2.png",
    sound: "sounds/cyber.wav"
  },
  {
    name: "Medieval Cats",
    color: "#3b2f2f",
    textColor: "#fff3d6",
    lore: "Sir Whiskers defends Yarn Kingdom.",
    image: "images/cat3.png",
    sound: "sounds/medieval.wav"
  },
  {
    name: "Void Cats",
    color: "#000",
    textColor: "#ff4d4d",
    lore: "This cat should not exist.",
    image: "images/cat4.png",
    sound: "sounds/void.wav"
  }
];

const skills = {
  doubleCats: false,
  autoCollector: false
};

const rarities = [
  { name: "Common", chance: 0.6 },
  { name: "Rare", chance: 0.3 },
  { name: "Epic", chance: 0.09 },
  { name: "Legendary", chance: 0.01 }
];

let index = 0;
let collected = JSON.parse(localStorage.getItem("cats")) || [];
let cats = parseInt(localStorage.getItem("catPoints")) || 0;
let lastTime = localStorage.getItem("lastTime");
let bossUnlocked = false;
let autoInterval = null;
let isMuted = false;

let doubleOwned = JSON.parse(localStorage.getItem("doubleOwned")) || false;
let autoOwned = JSON.parse(localStorage.getItem("autoOwned")) || false;

if (autoOwned) {
  autoInterval = setInterval(() => addCat(1), 2000);
}

const title = document.getElementById("title");
const lore = document.getElementById("lore");
const catImage = document.getElementById("catImage");
const btn = document.getElementById("btn");
const app = document.getElementById("app");

const audio = new Audio();


function addCat(amount = 1) {
  let multiplier = doubleOwned ? 2 : 1;
  cats += amount * multiplier;

  localStorage.setItem("catPoints", cats);
  updateUI();
  checkBoss();
  updateProgress();
}

function updateUI() {
  document.getElementById("catCount").textContent = `🐱 Cats: ${cats}`;
}

function unlockDouble() {
  if (cats >= 10) {
    skills.doubleCats = true;
  }
}

function buyDouble() {
  if (cats >= 10 && !doubleOwned) {
    cats -= 10;
    doubleOwned = true;

    localStorage.setItem("doubleOwned", true);

    updateUI();
  }
}


function buyAuto() {
  if (cats >= 25 && !autoOwned) {
    cats -= 25;
    autoOwned = true;

    localStorage.setItem("autoOwned", true);

    if (!autoInterval) {
      autoInterval = setInterval(() => addCat(1), 2000);
    }

    updateUI();
  }
}

function stopAuto() {
  clearInterval(autoInterval);
  autoInterval = null;
}

function getRarity() {
  let roll = Math.random();
  let sum = 0;

  for (let r of rarities) {
    sum += r.chance;
    if (roll < sum) return r.name;
  }
}
console.log("You found a", getRarity(), "cat!");


function calculateOffline() {
  if (!lastTime) return;

  let diff = Date.now() - lastTime;
  let seconds = Math.floor(diff / 1000);

  let earned = Math.min(Math.floor(seconds * 0.2), 500);
  if (earned > 0) addCat(earned);
}

window.addEventListener("beforeunload", () => {
  localStorage.setItem("lastTime", Date.now());
});

calculateOffline();


function exportSave() {
  const save = {
    cats,
    collected,
    doubleOwned,
    autoOwned,
    bossUnlocked
  };

  const encoded = btoa(JSON.stringify(save));
  prompt("Copy your save:", encoded);
}

function importSave() {
  let data = prompt("Paste save code:");
  if (!data) return;

  try {
    let save = JSON.parse(atob(data));

    cats = save.cats || 0;
    collected = save.collected || [];
    doubleOwned = save.doubleOwned || false;
    autoOwned = save.autoOwned || false;
    bossUnlocked = save.bossUnlocked || false;

    localStorage.setItem("catPoints", cats);
    localStorage.setItem("cats", JSON.stringify(collected));
    localStorage.setItem("doubleOwned", doubleOwned);
    localStorage.setItem("autoOwned", autoOwned);

    updateUI();
    updateGallery();
    updateProgress();

    alert("Save loaded!");
  } catch (e) {
    alert("Invalid save code.");
  }
}

function checkBoss() {
  if (cats >= 100 && !bossUnlocked) {
    bossUnlocked = true;

    document.getElementById("bossBtn").style.display = "inline-block";

    loadBoss();
  }
}


function loadBoss() {
  load({
    name: "👑 CAT OVERLORD",
    color: "#100000",
    textColor: "#ff0000",
    lore: "You have awakened the final cat entity.",
    image: "images/boss.png"
  });
}

// 🌌 glitch effect
function glitch() {
  document.body.style.filter = "contrast(2) brightness(0.8) hue-rotate(90deg)";
  setTimeout(() => {
    document.body.style.filter = "none";
  }, 200);
}

// 🌀 portal transition
function portal() {
  app.style.transform = "scale(0.8) rotate(2deg)";
  app.style.opacity = "0";

  setTimeout(() => {
    app.style.transform = "scale(1) rotate(0)";
    app.style.opacity = "1";
  }, 300);
}

// 💾 collect cat
function collectCat(catName) {
  let rarity = getRarity();

  collected.push({
    name: catName,
    rarity: rarity
  });

  localStorage.setItem("cats", JSON.stringify(collected));
  updateGallery();
}


// 🌠 load universe
function load(u) {
  portal();
  glitch();

  document.body.style.background = u.color;
  document.body.style.setProperty("--text-color", u.textColor);

  title.textContent = "🐱 " + u.name;
  lore.textContent = u.lore;
  catImage.src = u.image;

  collectCat(u.name);

  if (u.sound) {
    playSound(u.sound);
  }
}

function playSound(src) {
  if (!src) return;

  audio.pause();
  audio.currentTime = 0;

  audio.src = src;
  audio.load(); // 🔥 important for wav reliability
  audio.volume = isMuted ? 0 : 0.4;

  audio.play().catch(err => {
    console.log("Audio blocked or failed:", err);
  });
}

function toggleMute() {
  isMuted = !isMuted;

  if (isMuted) {
    audio.pause();
  }

  document.getElementById("muteBtn").textContent =
    isMuted ? "🔇 Unmute" : "🔊 Mute";
}

document.addEventListener("click", () => {
  audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
  }).catch(() => {});
}, { once: true });


function updateProgress() {
  let percent = Math.min((cats / 100) * 100, 100);

  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").textContent =
    `Boss Progress: ${cats}/100`;
}

function updateGallery() {
  const list = document.getElementById("catList");

  list.innerHTML = collected
    .map(c => `<p>🐱 ${c.name} (${c.rarity})</p>`)
    .join("");
}

function resetGame() {
  if (!confirm("Reset your progress?")) return;

  localStorage.clear();
  location.reload();
}

btn.addEventListener("click", () => {
  addCat();
  checkBoss(); // 🔥 ADD THIS
  index = (index + 1) % universes.length;
  load(universes[index]);
});

// secret universe unlock (press CATS)
let buffer = "";

document.addEventListener("keydown", (e) => {
  if (e.key.length !== 1) return;

  buffer += e.key.toLowerCase();
  buffer = buffer.slice(-10);

  if (buffer.includes("cats")) {
    load({
      name: "⭐ GOD CAT REALM",
      color: "#1a001f",
      textColor: "#ff00ff",
      lore: "You unlocked the origin of all cats.",
      image: "images/cat5.png",
      sound: null
    });

    buffer = "";
  }
});

// start
load(universes[index]);