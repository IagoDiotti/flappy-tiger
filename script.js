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




/*
function scoreTimer(){
  while (true){
      setTimeout(() => {  
        document.getElementById('score').textContent += '1';
      }, (1000)); // 1000 milissegundos = 1 segundos

  }
}
*/


function tickMovement() {
  movePipes();
}

function tickPipeCreation() {
  createPipes(main);
}

function tickPipeDrop() {
  dropPipes();
}
let lastPipeTime = 0;
const PIPE_INTERVAL = 2000; // Intervalo para criar canos (em milissegundos)

function dropPipes() {
  // Usando um loop 'for' de trás para frente para remover com segurança
  for (let i = pipes.length - 1; i >= 0; i--) {
    const pipePair = pipes[i];
    const left = getLeft(pipePair.top); // Pegamos a posição de um dos canos

    if (left < -PIPE_WIDTH) {
      // Removemos os dois elementos da tela
      pipePair.top.remove();
      pipePair.bottom.remove();
      // Removemos o objeto do array
      pipes.splice(i, 1);
    }
  }
}

function movePipe(pipe) {
  const left = getLeft(pipe);
  const nextLeft = left - PIPE_MOVEMENT;
  setLeft(pipe, nextLeft);
}

function movePipes() {
  // Agora 'pipePair' é o objeto {top: ..., bottom: ...}
  pipes.forEach((pipePair) => {
    // Temos que mover CADA cano dentro do par
    movePipe(pipePair.top);
    movePipe(pipePair.bottom);
  });
}

function createPipes(screen) {
  const screenHeight = SCREEN_HEIGHT; // Use SCREEN_HEIGHT dinâmico;

  const minGapTop = 15; // Proporção mínima do topo (ex: 15%)
  const maxGapTop = 65; // Proporção máxima do topo (ex: 65%)
  
  // Garante que o espaço aleatório para o topo seja razoável
  const topHeightProportion = parseInt(Math.random() * (maxGapTop - minGapTop) + minGapTop);
  
  // A folga entre os canos agora é fixa, mas pode ser dinâmica também
  const gapProportion = SPACE_BETWEEN_PIPES; 

  const bottomHeightProportion =
    100 - topHeightProportion - gapProportion;

  const topHeight = screenHeight * (topHeightProportion / 100);
  const bottomHeight = screenHeight * (bottomHeightProportion / 100);

  // Crie o cano superior
  const topPipe = createRectangle({
    width: PIPE_WIDTH,
    height: topHeight,
    top: 0,
    left: SCREEN_WIDTH, // Use SCREEN_WIDTH
  });

  // Crie a "tampa" do cano superior
  const topPipeCap = createRectangle({
    width: 73, // Largura maior para a tampa
    height: 35, // Altura da tampa
    top: topHeight - 30, // Posiciona a tampa na extremidade inferior do cano
    left: -10, // Ajusta para centralizar na largura do cano principal
    className: "pipe-cap" // Adiciona a classe da tampa
  });
  topPipe.appendChild(topPipeCap); // Anexa a tampa ao cano superior

  // Crie o cano inferior
  const bottomPipe = createRectangle({
    width: PIPE_WIDTH,
    height: bottomHeight,
    top: screenHeight - bottomHeight,
    left: SCREEN_WIDTH, // Use SCREEN_WIDTH
  });

  // Crie a "tampa" do cano inferior
  const bottomPipeCap = createRectangle({
    width: 73, // Largura maior para a tampa
    height: 35, // Altura da tampa
    top: -3, // Posiciona a tampa na extremidade superior do cano
    left: -10, // Ajusta para centralizar
    className: "pipe-cap" // Adiciona a classe da tampa
  });
  bottomPipe.appendChild(bottomPipeCap); // Anexa a tampa ao cano inferior
  
  // Modificação: Adicione um objeto que contém ambos os canos e a propriedade `scored`
  pipes.push({
      top: topPipe,
      bottom: bottomPipe,
      scored: false // Para o sistema de pontuação
  });

  draw(topPipe, screen);
  draw(bottomPipe, screen);
}
class InvalidDirectionError extends Error {}

function createRectangle({
  top = 0,
  left = 0,
  width = 32,
  height = 34,
  className = "" // Novo parâmetro para adicionar classes extras
} = {}) {
  const rectangle = document.createElement("div");
  rectangle.classList.add("pipe"); // Todos os canos têm a classe base "pipe"
  
  if (className) { // Se uma classe extra for fornecida, adicione-a
    rectangle.classList.add(className);
  }

  rectangle.style.top = `${top}px`;
  rectangle.style.left = `${left}px`;
  rectangle.style.width = `${width}px`;
  rectangle.style.height = `${height}px`;

  
  rectangle.style.position = "absolute"; // Já está no CSS, mas não custa garantir. Z-index também pode ir para o CSS
  rectangle.style.zIndex = 10; // Z-index para garantir que canos fiquem sobre outros elementos (ajustar se necessário)
  
  return rectangle;
}

function draw(what, where) {
  where.appendChild(what);
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

const personagem = document.querySelector("#personagem");
const GRAVITY = 0.2;
const JUMP_HEIGHT = 5;



let personagemVelocityY = 0;
let gameStarted = false;

function resetCharacter() {
  const PERSONAGEM_INITIAL_TOP = SCREEN_HEIGHT / 2 - getHeight(personagem) / 2;
  gameStarted = false;
  personagemVelocityY = 0;
  setTop(personagem, PERSONAGEM_INITIAL_TOP);
  
  // Lógica correta para remover os canos
  pipes.forEach(pipePair => {
    pipePair.top.remove();
    pipePair.bottom.remove();
  });
  
  pipes.length = 0;
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
