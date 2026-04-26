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
  bossMode: false,
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

if (game.upgrades.auto && !autoInterval) {
  startAuto();
}

function addCat(amount = 1) {
  let multiplier = game.upgrades.double ? 2 : 1;

  game.points += amount * multiplier;

  updateBossState(); // 👈 ONLY HERE

  saveGame();
  updateUI();
  updateProgress();
}

function updateUI() {
  document.getElementById("catCount").textContent =
    `🐱 Cats: ${game.points}`;

  // 👑 Boss button
  document.getElementById("bossBtn").style.display =
    game.points >= 100 ? "inline-block" : "none";

  // 🧠 Double upgrade
  const doubleBtn = document.getElementById("doubleBtn");
  if (doubleBtn) {
    doubleBtn.disabled = game.upgrades.double;
    doubleBtn.textContent = game.upgrades.double
      ? "✔ Owned (Double Cats)"
      : "Double Cats (10 🐱)";
  }

  // 🤖 Auto button reset when NOT running
  const autoBtn = document.getElementById("autoBtn");
  if (autoBtn && !autoInterval) {
    autoBtn.textContent = "Upgrade Auto Cats";
  }
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

    const btn = document.getElementById("doubleBtn");
    btn.classList.add("disabled");
    btn.disabled = true;
    btn.textContent = "✔ Owned (Double Cats)";
  }
}

function buyAuto() {
  if (game.points >= 25 && !game.upgrades.auto) {
    game.points -= 25;
    game.upgrades.auto = true;

    saveGame();
    updateUI();

    document.getElementById("autoBtn").textContent = "Auto Cats Upgraded";
  }
}

function startAuto() {
  if (autoInterval) return;

  autoInterval = setInterval(() => addCat(1), 2000);
}

function stopAuto() {
  clearInterval(autoInterval);
  autoInterval = null;

  const btn = document.getElementById("autoBtn");
  if (btn) btn.textContent = "Start Auto Cats";
}
function toggleAuto() {
  const btn = document.getElementById("autoBtn");

  if (autoInterval) {
    stopAuto();
    btn.textContent = "Start Auto Cats";
  } else {
    startAuto();
    btn.textContent = "Auto Running...";
  }
}

function getRarity(catName = "") {
  // FORCE special cats
  if (catName.includes("GOD CAT")) return "MYTHIC";
  if (catName.includes("CAT OVERLORD")) return "BOSS";

  let roll = Math.random();
  let sum = 0;

  for (let r of rarities) {
    sum += r.chance;
    if (roll < sum) return r.name;
  }

  return "Common";
}
function rarityStyle(rarity) {
  switch (rarity) {
    case "MYTHIC":
      return "🔥 MYTHIC";
    case "BOSS":
      return "👑 BOSS";
    case "Legendary":
      return "✨ Legendary";
    default:
      return rarity;
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

function updateBossState() {
  if (game.points >= 100 && !game.bossMode) {
    game.bossMode = true;
    loadBoss();
  }
}
function loadBoss() {
  load({
    name: "👑 CAT OVERLORD",
    color: "#100000",
    textColor: "#ff0000",
    lore: "Boss mode active.",
    image: "images/boss.png",
    sound: "sounds/boss.wav"
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
    rarity: getRarity(catName)
  });

  saveGame();
  updateGallery();
}

// 🌠 load universe
function load(u) {
  game.bossMode = false; // ✅ ONLY THIS RESET

  game.activeUniverse = u.name;
  portal();
  glitch();

  document.body.style.background = u.color;
  document.body.style.setProperty("--text-color", u.textColor);

  title.textContent = "🐱 " + u.name;
  lore.textContent = u.lore;
  catImage.src = u.image;

  if (!game.collection.find(c => c.name === u.name)) {
    collectCat(u.name);
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
  let percent = Math.min((game.points / 100) * 100, 100);

  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").textContent =
    `Boss Progress: ${game.points}/100`;
}

function updateGallery() {
  const list = document.getElementById("catList");

  list.innerHTML = game.collection
    .map(c => `🐱 ${c.name} (${rarityStyle(c.rarity)})`)
    .join("<br>");
}

function resetGame() {
  if (!confirm("Reset EVERYTHING?")) return;

  localStorage.removeItem("gameSave");

  game = structuredClone(defaultState); // ✅ RESET MEMORY TOO
  index = 0;
  autoInterval = null;

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

  index = (index + 1) % universes.length;
  const next = universes[index];

  game.activeUniverse = next.name; // 👈 IMPORTANT

  load(next);
  updateBossState();

  if (next.sound) {
    playSound(next.sound);
  }

  saveGame();
});

// secret universe unlock (press CATS)
let buffer = "";

document.addEventListener("keydown", (e) => {
  if (e.key.length !== 1) return;

  buffer += e.key.toLowerCase();
  buffer = buffer.slice(-10);

  if (buffer.includes("cats")) {
    game.points += 1;

    load({
      name: "⭐ GOD CAT REALM",
      color: "#1a001f",
      textColor: "#ff00ff",
      lore: "You unlocked the origin of all cats.",
      image: "images/cat5.png",
      sound: "sounds/secret.wav"
    });

    saveGame();
    updateUI();
    updateProgress();

    buffer = "";
  }
});

function initGame() {
  load(universes[index]);
  updateUI();
  updateProgress();
  if (game.upgrades.double) {
  const btn = document.getElementById("doubleBtn");
  btn.classList.add("disabled");
  btn.disabled = true;
  btn.textContent = "✔ Owned (Double Cats)";
}
if (game.upgrades.auto && !autoInterval) {
  startAuto();
}
}

initGame();