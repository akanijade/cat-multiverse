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

const defaultState = {
  points: 0,
  collection: [],
  upgrades: {
    double: false,
    auto: false
  },
  bossUnlocked: false
};
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
let lastTime = localStorage.getItem("lastTime");
let autoInterval = null;
let isMuted = false;
let game = loadGame();



const title = document.getElementById("title");
const lore = document.getElementById("lore");
const catImage = document.getElementById("catImage");
const btn = document.getElementById("btn");
const app = document.getElementById("app");

const audio = new Audio();

if (game.upgrades.auto) {
  autoInterval = setInterval(() => addCat(1), 2000);
}

function addCat(amount = 1) {
  let multiplier = game.upgrades.double ? 2 : 1;

  game.points += amount * multiplier;

  saveGame();
  updateUI();
  updateProgress();
  checkBoss();
}

function updateUI() {
  document.getElementById("catCount").textContent =
    `🐱 Cats: ${game.points}`;
}

function unlockDouble() {
  if (cats >= 10) {
    skills.doubleCats = true;
  }
}

function buyDouble() {
  if (game.points >= 10 && !game.upgrades.double) {
    game.points -= 10;
    game.upgrades.double = true;

    saveGame();
    updateUI();
  }
}


function buyAuto() {
  if (game.points >= 25 && !game.upgrades.auto) {
    game.points -= 25;
    game.upgrades.auto = true;

    saveGame();
    updateUI();

    setInterval(() => addCat(1), 2000);
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
  prompt("Copy save:", btoa(JSON.stringify(game)));
}

function importSave() {
  let data = prompt("Paste save:");
  if (!data) return;

  game = JSON.parse(atob(data));
  saveGame();

  updateUI();
  updateGallery();
  updateProgress();
}

function checkBoss() {
  if (game.points >= 100 && !game.bossUnlocked) {
    game.bossUnlocked = true;
    saveGame();

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
  if (game.collection.find(c => c.name === catName)) return;

  game.collection.push({
    name: catName,
    rarity: getRarity()
  });

  saveGame();
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

  if (!game.collection.find(c => c.name === u.name))

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

  list.innerHTML = game.collection
    .map(c => `🐱 ${c.name} (${c.rarity})`)
    .join("<br>");
}

function resetGame() {
  if (!confirm("Reset EVERYTHING?")) return;

  localStorage.removeItem("gameSave");
  location.reload();
}

function loadGame() {
  let saved = localStorage.getItem("gameSave");
  return saved ? JSON.parse(saved) : structuredClone(defaultState);
}

function saveGame() {
  localStorage.setItem("gameSave", JSON.stringify(game));
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