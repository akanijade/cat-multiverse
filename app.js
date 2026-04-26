const universes = [
  {
    name: "Space Cats",
    color: "#0b0f2a",
    textColor: "#ffffff",
    lore: "Nebula Cat bends gravity with a meow.",
    image: "images/cat1.png",
    sound: "sounds/space.mp3"
  },
  {
    name: "Cyber Cats",
    color: "#111",
    textColor: "#00ffcc",
    lore: "Hacker Cat controls the entire internet.",
    image: "images/cat2.png",
    sound: "sounds/cyber.mp3"
  },
  {
    name: "Medieval Cats",
    color: "#3b2f2f",
    textColor: "#fff3d6",
    lore: "Sir Whiskers defends Yarn Kingdom.",
    image: "images/cat3.png",
    sound: "sounds/medieval.mp3"
  },
  {
    name: "Void Cats",
    color: "#000",
    textColor: "#ff4d4d",
    lore: "This cat should not exist.",
    image: "images/cat4.png",
    sound: "sounds/void.mp3"
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
let doubleOwned = false;
let autoOwned = false;
let lastTime = localStorage.getItem("lastTime");

const title = document.getElementById("title");
const lore = document.getElementById("lore");
const catImage = document.getElementById("catImage");
const btn = document.getElementById("btn");
const app = document.getElementById("app");

const audio = new Audio();


if (cats > 50) {
  load({
    name: "FINAL BOSS CAT",
    color: "#200000",
    textColor: "#ff0000",
    lore: "You have awakened the Cat Overlord.",
    image: "images/bosscat.png"
  });
}

// function addCat() {
//   cats++;
//   localStorage.setItem("catPoints", cats);
//   updateUI();
// }
function addCat(amount = 1) {
  cats += amount;
  localStorage.setItem("catPoints", cats);
  updateUI();
  checkUnlocks();
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
  if (cats >= 10) {
    cats -= 10;
    doubleOwned = true;
    updateUI();
  }
}

function buyAuto() {
  if (cats >= 25) {
    cats -= 25;
    autoOwned = true;
    setInterval(() => addCat(1), 2000);
    updateUI();
  }
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

  let earned = Math.floor(seconds * 0.2);
  if (earned > 0) addCat(earned);
}

window.addEventListener("beforeunload", () => {
  localStorage.setItem("lastTime", Date.now());
});

calculateOffline();


function exportSave() {
  const save = {
    cats,
    doubleOwned,
    autoOwned
  };

  prompt("Copy your save:", btoa(JSON.stringify(save)));
}


function importSave() {
  let data = prompt("Paste save code:");
  if (!data) return;

  let save = JSON.parse(atob(data));

  cats = save.cats;
  doubleOwned = save.doubleOwned;
  autoOwned = save.autoOwned;

  updateUI();
}

function checkUnlocks() {
  if (cats > 100) {
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
// function addCat() {
//   cats += skills.doubleCats ? 2 : 1;
// }
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
  if (!collected.includes(catName)) {
    collected.push(catName);
    localStorage.setItem("cats", JSON.stringify(collected));
  }
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

  // // sound (optional, won’t break if missing)
  // if (u.sound) {
  //   audio.src = u.sound;
  //   audio.volume = 0.4;
  //   audio.play().catch(() => {});
  // }
  if (u.sound) {
    playSound(u.sound);
  }
}

// const audio = new Audio();

function playSound(src) {
  if (!src) return;

  audio.pause();
  audio.currentTime = 0;
  audio.src = src;

  audio.volume = 0.4;

  audio.play().catch(() => {
    console.log("Audio blocked until user interacts.");
  });
}

// click
// btn.addEventListener("click", () => {
//   index = (index + 1) % universes.length;
//   load(universes[index]);
// });
btn.addEventListener("click", () => {
  addCat();
  index = (index + 1) % universes.length;
  load(universes[index]);
});

// secret universe unlock (press CATS)
let secretCode = "";
document.addEventListener("keydown", (e) => {
  secretCode += e.key.toLowerCase();
  if (secretCode.includes("cats")) {
    load({
      name: "⭐ GOD CAT REALM",
      color: "#1a001f",
      textColor: "#ff00ff",
      lore: "You unlocked the origin of all cats.",
      image: "images/cat5.png",
      sound: null
    });
    secretCode = "";
  }
});

// start
load(universes[index]);