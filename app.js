const universes = [
  {
    name: "Space Cats",
    color: "#0b0f2a",
    lore: "Nebula Cat controls gravity fields with a meow.",
    image: "images/cat1.png"
  },
  {
    name: "Cyber Cats",
    color: "#111",
    lore: "This cat hacks WiFi just by blinking.",
    image: "images/cat2.png"
  },
  {
    name: "Medieval Cats",
    color: "#3b2f2f",
    lore: "Sir Whiskers protects the kingdom of Yarnshire.",
    image: "images/cat3.png"
  },
  {
    name: "Void Cats",
    color: "#000",
    lore: "No one has ever successfully pet this cat.",
    image: "images/cat4.png"
  }
];

let index = 0;

const title = document.getElementById("title");
const lore = document.getElementById("lore");
const catImage = document.getElementById("catImage");
const btn = document.getElementById("btn");

btn.addEventListener("click", () => {
  index = (index + 1) % universes.length;

  const u = universes[index];

  document.body.style.background = u.color;
  title.textContent = `🐱 ${u.name}`;
  lore.textContent = u.lore;
  catImage.src = u.image;

  catImage.style.transform = "scale(1.1)";
  setTimeout(() => {
    catImage.style.transform = "scale(1)";
  }, 300);
});
