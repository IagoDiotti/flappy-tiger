const GAME_SPEED = 0.01;
const SPACE_BETWEEN_PIPES = 20;
const PIPE_WIDTH = 50;
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const PIPE_MOVEMENT = 4;

const main = document.querySelector("#main");
//main.style.width = `${SCREEN_WIDTH}px`;
//main.style.height = `${SCREEN_HEIGHT}px`;
//main.style.position = "absolute";
//main.style.backgroundImage = "fundo.png"; // Define a imagem de fundo
//main.style.backgroundSize = "cover"; // Ajusta a imagem para cobrir todo o elemento
//main.style.backgroundRepeat = "no-repeat"; // Evita repetição da imagem

const pipes = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scoreTimer() {
  while (true) {
    await sleep(1000);
    if (gameStarted) {
      let score = Number(document.getElementById("score").textContent);
      document.getElementById("score").textContent = ++score;
    } else {
      document.getElementById("score").textContent = 0;
    }
  }
}
scoreTimer();

let lastPipeTime = 0;
const PIPE_INTERVAL = 2000; // Intervalo para criar canos (em milissegundos)

function dropPipes() {
  pipes.forEach((pipe, index) => {
    const left = getLeft(pipe);
    if (left < -PIPE_WIDTH) {
      pipe.remove();
      pipes.splice(index, 1);
    }
  });
}

function movePipe(pipe) {
  const left = getLeft(pipe);
  const nextLeft = left - PIPE_MOVEMENT;
  setLeft(pipe, nextLeft);
}

function movePipes() {
  pipes.forEach((pipe) => {
    movePipe(pipe);
  });
}

function createPipes(screen) {
  const screenWidth = getWidth(screen);
  const screenHeight = document.body.clientHeight; // Usa a altura do body;

  const topHeightProportion = parseInt(Math.random() * 60);
  const bottomHeightProportion =
    100 - topHeightProportion - SPACE_BETWEEN_PIPES;

  const topHeight = screenHeight * (topHeightProportion / 100);
  const bottomHeight = screenHeight * (bottomHeightProportion / 100);

  console.log(document.body.clientHeight);

  const topPipe = createRectangle({
    width: PIPE_WIDTH,
    height: topHeight,
    backgroundColor: "green",
    top: 0,
    left: window.innerWidth, // Posiciona o pipe fora da tela, no lado direito do body
    zIndex: 10,
    border: "2px solid red",
  });
  const bottomPipe = createRectangle({
    width: PIPE_WIDTH,
    height: bottomHeight,
    backgroundColor: "green",
    top: screenHeight - bottomHeight,
    left: window.innerWidth, // Posiciona o pipe fora da tela, no lado direito do body
    zIndex: 10,
  });
  pipes.push(topPipe, bottomPipe);

  draw(topPipe, screen);
  draw(bottomPipe, screen);
}

function getWidth(element) {
  return parseFloat(window.getComputedStyle(element).width);
}

function getHeight(element) {
  return parseFloat(window.getComputedStyle(element).height);
}

function getTop(element) {
  return parseFloat(element.style.top) || 0;
}

function getLeft(element) {
  return parseFloat(element.style.left) || 0;
}

function setTop(element, top) {
  element.style.top = `${top}px`;
}

function setLeft(element, left) {
  element.style.left = `${left}px`;
}

function moveToDirection({ element, direction = "left", speed = 1 } = {}) {
  const top = getTop(element);
  const left = getLeft(element);
  switch (direction) {
    case "top":
      setTop(element, top - speed);
      break;
    case "left":
      setLeft(element, left + speed);
      break;
    case "right":
      setLeft(element, left - speed);
      break;
    case "bottom":
      setTop(element, top + speed);
      break;
    default:
      throw new InvalidDirectionError(
        `The direction "${direction}" is invalid!`
      );
  }
}

class InvalidDirectionError extends Error {}

function createRectangle({
  top = 0,
  left = 0,
  width = 32,
  height = 34,
  backgroundColor = "red",
} = {}) {
  const rectangle = document.createElement("div");
  rectangle.style.top = `${top}px`;
  rectangle.style.left = `${left}px`;
  rectangle.style.width = `${width}px`;
  rectangle.style.height = `${height}px`;
  rectangle.style.backgroundColor = backgroundColor;
  rectangle.style.position = "absolute";
  return rectangle;
}

function draw(what, where) {
  where.appendChild(what);
}

const personagem = document.querySelector("#personagem");
const GRAVITY = 0.2;
const JUMP_HEIGHT = 5;

let personagemVelocityY = 0;
let gameStarted = false;
let isPerdelMane = false;

function resetCharacter() {
  isPerdelMane = false;
  const PERSONAGEM_INITIAL_TOP = SCREEN_HEIGHT / 2 - getHeight(personagem) / 2;
  gameStarted = false;
  personagemVelocityY = 0;
  setTop(personagem, PERSONAGEM_INITIAL_TOP);
  // Para cada cano no array, remove o elemento da tela
  pipes.forEach((pipe) => pipe.remove());
  // Esvazia o array para começar do zero na próxima partida
  pipes.length = 0;
}

function detectCollision() {
  if (isPerdelMane) {
    return;
  }

  const personagem = document.querySelector("#personagem");
  const personagemTop = parseFloat(personagem.style.top);
  const personagemBottom = window.innerHeight - personagemTop + 40;
  let detectedPipes = [];

  pipes.forEach((pipe) => {
    let left = parseFloat(pipe.style.left);
    if (left >= 100 && left <= 155) {
      console.log("ó o gás");
      detectedPipes.push(pipe);
    }
  });

  if (detectedPipes.length > 0) {
    const [topPipe, bottomPipe] = detectedPipes;
    const topPipeBottom = parseFloat(topPipe.style.height);
    const bottomPipeTop = parseFloat(bottomPipe.style.height);
    console.log(
      `topPipeBottom=${topPipeBottom}, bottomPipeTop=${bottomPipeTop}`
    );
    console.log(
      `personagemTop=${personagemTop} personagemBottom=${personagemBottom}`
    );
    if (!(bottomPipeTop < personagemBottom && topPipeBottom < personagemTop)) {
      alert("perdel mané");
      isPerdelMane = true;
      resetCharacter();
    }
  }
}

function gameLoop(currentTime) {
  // Toda a lógica do jogo só roda se gameStarted for true
  if (gameStarted) {
    // 1. LÓGICA DO PERSONAGEM (seu código original, já está correto)
    personagemVelocityY += GRAVITY;
    let newTop = getTop(personagem) + personagemVelocityY;
    const personagemHeight = getHeight(personagem);

    if (newTop < 0) {
      newTop = 0;
      personagemVelocityY = 0;
    }
    setTop(personagem, newTop);

    // Verifica colisão com o chão
    if (newTop + personagemHeight > SCREEN_HEIGHT) {
      resetCharacter();
    }

    detectCollision();

    // 2. LÓGICA DOS CANOS (agora dentro do if)
    movePipes();
    dropPipes();

    // Cria um novo par de canos a cada PIPE_INTERVAL
    if (currentTime - lastPipeTime > PIPE_INTERVAL) {
      lastPipeTime = currentTime;
      createPipes(main);
    }
  }

  // Pede ao navegador para chamar gameLoop novamente no próximo quadro
  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    if (!gameStarted) {
      gameStarted = true;
    }
    personagemVelocityY = -JUMP_HEIGHT;
  }
});

resetCharacter();
gameLoop();
