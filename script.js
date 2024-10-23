//mettre score dans le local storage
//localStorage.setItem("score", score);
let score = 0;
let bestscore = 0;

const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time-left");
const bestScoreDisplay = document.getElementById("best-score");

//gameTime correspond au temps total de la partie
//spawnRate correspond au temps entre chaque apparition d'objet
//maxObjects correspond au nombre maximum d'objets affichés en même temps

const levels = {
  easy: {
    gameTime: 30,
    spawnRate: 1500,
    maxObjects: 3,
    music: "sons/music_lvl1.mp3",
  },
  medium: {
    gameTime: 20,
    spawnRate: 1000,
    maxObjects: 4,
    music: "sons/music_lvl2.mp3",
  },
  hard: {
    gameTime: 15,
    spawnRate: 700,
    maxObjects: 5,
    music: "sons/music_lvl3.mp3",
  },
};

function startGame(level) {
  const {
    gameTime: time,
    spawnRate: rate,
    maxObjects: objects,
    music: music,
  } = levels[level]; // Destructuring de l'objet levels[level] pour récupérer les valeurs gameTime, spawnRate et maxObjects dans des variables distinctes (time, rate et objects)
  gameTime = time;
  spawnRate = rate;
  maxObjects = objects;
  score = 0;
  timeLeft = gameTime;


  document.getElementById("level-select").style.display = "none";
  document.getElementById("game-info").style.display = "block";
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;

  gameInterval = setInterval(updateGameTime, 1000);
  spawnInterval = setInterval(spawnObject, spawnRate);
  if (music) {
    const audio = new Audio(music);
    audio.play();
  }

  setTimeout(endGame, gameTime * 1000);
}

function updateGameTime() {
  timeLeft--;
  timeDisplay.textContent = timeLeft;
}

function spawnObject() {
  if (gameArea.children.length < maxObjects) {
    const object = document.createElement("img");
    const type = getObjectType();
    object.classList.add("object", type);

    if (type === "pinata") {
      object.src = "img/pinata.png";
    }
    if (type === "crane") {
      object.src = "img/crane.png";
    }
    if (type === "cactus") {
      object.src = "img/cactus.png";
    }

    object.style.position = "absolute";
    object.style.top = Math.random() * (gameArea.clientHeight - 60) + "px";
    object.style.left = Math.random() * (gameArea.clientWidth - 60) + "px";
    object.style.width = "70px";
    object.style.height = "70px";

    object.addEventListener("click", () => handleObjectClick(type, object));

    gameArea.appendChild(object);

    setTimeout(() => {
      if (object.parentElement) {
        gameArea.removeChild(object);
      }
    }, spawnRate);
  }
}

function getObjectType() {
  const rand = Math.random();
  if (rand < 0.8) return "pinata"; // 80% de chance
  if (rand < 0.95) return "cactus"; // 15% de chance (entre 0.8 et 0.95)
  return "crane"; // 5% de chance (entre 0.95 et 1)
}

function handleObjectClick(type, object) {
  if (type === "pinata") {
    score++;
    const audio = new Audio("sons/pinata.wav");
    audio.play();
  } else if (type === "crane") {
    score += 5;
    const audio = new Audio("sons/Light4.wav");
    audio.play();
  } else if (type === "cactus") {
    score -= 2;
    const audio = new Audio("sons/cactus1.wav");
    audio.play();
  }

  scoreDisplay.textContent = score;
  bestscore = score;

  gameArea.removeChild(object);
}

function handleBestScore (bestscore) {
  bestscore = localStorage.getItem("score");
  
  if (bestscore === undefined || bestscore < score) {
    localStorage.setItem("score", score);
    const audio = new Audio("sons/win_guitarBrass.wav");
    audio.play();
    alert("Nouveau record battu !");
  } else {
    const audio = new Audio("sons/Error_guitarBrass.wav");
    audio.play();
    alert("Looser");
  }
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  alert("Temps écoulé! Votre score est : " + score);

  handleBestScore();
  bestScoreDisplay.textContent = bestscore;

  resetGame();
}

function resetGame() {
  document.getElementById("game-info").style.display = "none";
  document.getElementById("level-select").style.display = "block";
  gameArea.innerHTML = "";
  // score = 0;
}

// function clearLocalStorage() {
//   localStorage.clear();
//   console.log("vidage du localStorage ");
// }
