let container = document.querySelector("#container");
let player = document.querySelector("#player");
let block = document.querySelector("#block");
let road = document.querySelector("#road");
let cloud = document.querySelector("#cloud");
let score = document.querySelector("#score");
let gameOver = document.querySelector("#gameOver");

const som_HIT = new Audio();
som_HIT.src = './efeitos/efeitos_hit.wav';
const som_Jump = new Audio();
som_Jump.src = './efeitos/efeitos_pulo.wav';

let interval = null;
let playerScore = 0;
let currentLevel = 0;

// Configurações de níveis de dificuldade
const levels = [
  { speed: 40, obstacleGap: 100, speedIncrementInterval: 1000 },
  { speed: 60, obstacleGap: 100, speedIncrementInterval: 500 }
];

// Função para atualizar os parâmetros do nível
const updateLevel = () => {
  const { speed, obstacleGap, speedIncrementInterval } = levels[currentLevel];
  block.style.animationDuration = `${obstacleGap / speed}s`;

  clearInterval(interval);
  interval = setInterval(scoreCounter, speedIncrementInterval);
};

// Função para incrementar o score
const scoreCounter = () => {
  playerScore++;
  score.innerHTML = `Score <b>${playerScore}</b>`;
  updateLevel(); // Verificar e atualizar o nível atual
  // Verificar se o jogador passou para o próximo nível
  if (playerScore % 16 === 0 && currentLevel < levels.length - 1) {
    currentLevel++;
    updateLevel(); // Atualizar o nível
  }
 
};

// Evento para iniciar o jogo
window.addEventListener("keydown", (start) => {
  if (start.code == "Space") {
    gameOver.style.display = "none";
    block.classList.add("blockActive");
    road.firstElementChild.style.animation = "roadAnimate 6s linear infinite";
    cloud.firstElementChild.style.animation = "cloudAnimate 50s linear infinite";

    playerScore = 0;
    currentLevel = 0;
    scoreCounter(); // Iniciar a contagem do score
  }
});

// Evento para pular o personagem
window.addEventListener("keydown", (e) => {
  if (e.key == "ArrowUp") {
    som_Jump.play();
    if (player.classList != "playerActive") {
      player.classList.add("playerActive");

      setTimeout(() => {
        player.classList.remove("playerActive");
      }, 500);
    }
  }
});

// Verificar colisão com o obstáculo
let result = setInterval(() => {
  let playerBottom = parseInt(getComputedStyle(player).getPropertyValue("bottom"));
  let blockLeft = parseInt(getComputedStyle(block).getPropertyValue("left"));

  if (playerBottom <= 90 && blockLeft >= 16 && blockLeft <= levels[currentLevel].obstacleGap) {
    som_HIT.play();

    gameOver.style.display = "block";
    block.classList.remove("blockActive");
    road.firstElementChild.style.animation = "none";
    cloud.firstElementChild.style.animation = "none";
    clearInterval(interval);
    playerScore = 0;
  }
}, 10);
