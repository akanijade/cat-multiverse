const universes = [
  {
    name: "Space Cats",
    color: "#0b0f2a",
    textColor: "#ffffff",
    lore: "Nebula Cat controls gravity fields with a meow.",
    image: "images/cat1.png"
  },
  {
    name: "Cyber Cats",
    color: "#111",
    textColor: "#00ffcc",
    lore: "This cat hacks WiFi just by blinking.",
    image: "images/cat2.png"
  },
  {
    name: "Medieval Cats",
    color: "#3b2f2f",
    textColor: "#fff3d6",
    lore: "Sir Whiskers protects the kingdom of Yarnshire.",
    image: "images/cat3.png"
  },
  {
    name: "Void Cats",
    color: "#000",
    textColor: "#ff4d4d",
    lore: "No one has ever successfully pet this cat.",
    image: "images/cat4.png"
  }
];

let index = 0;

const title = document.getElementById("title");
const lore = document.getElementById("lore");
const catImage = document.getElementById("catImage");
const btn = document.getElementById("btn");
const app = document.getElementById("app");

function loadUniverse(u) {
  document.body.style.background = u.color;
  document.body.style.color = u.textColor;

  app.style.color = u.textColor;

  title.textContent = `🐱 ${u.name}`;
  lore.textContent = u.lore;
  catImage.src = u.image;

  catImage.style.transform = "scale(1.1)";
  setTimeout(() => {
    catImage.style.transform = "scale(1)";
  }, 300);
}

btn.addEventListener("click", () => {
  index = (index + 1) % universes.length;
  loadUniverse(universes[index]);
});

// load first universe
loadUniverse(universes[index]);