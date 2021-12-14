const canvas = document.getElementById("tetris"); //llama al canvas en el JavaScript
const ctx = canvas.getContext("2d"); // el contexto será en 2 dimenciones
let contador = 0; // contador
const puntaje = document.getElementById("puntaje"); // puntos para el contador
let contadorFallos = 0;

const scale = 20; // tamaño de la ficha

ctx.scale(scale, scale); //la escala del canvas para ver el juego 20 columnas y 25 filas dependiendo del alto y ancho del canvas

const tWidth = canvas.width / scale;
const tHeight = canvas.height / scale;

const pieces = [
  // dibuja las piezas
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 2, 0, 0],
    [0, 2, 0, 0],
    [0, 2, 0, 0],
    [0, 2, 0, 0],
  ],
  [
    [0, 0, 0],
    [3, 3, 0],
    [0, 3, 3],
  ],
  [
    [0, 0, 0],
    [0, 4, 4],
    [4, 4, 0],
  ],
  [
    [5, 0, 0],
    [5, 0, 0],
    [5, 5, 0],
  ],
  [
    [0, 0, 6],
    [0, 0, 6],
    [0, 6, 6],
  ],
  [
    [0, 0, 0],
    [7, 7, 7],
    [0, 7, 0],
  ],
];
const colors = [
  // da color a cada pieza
  null,
  "#FF0D72",
  "#0DC2FF",
  "#0DFF72",
  "#F538FF",
  "#FF8E0D",
  "#FFE138",
  "#3877FF",
];

let arena = [];

let rand;

const player = {
  // constante de tipo objeto
  pos: { x: 0, y: 1 }, //posicion de la pieza
  matrix: null,
  color: null,
};

rand = Math.floor(Math.random() * pieces.length); // elige pieza al azar
player.matrix = pieces[rand];
player.color = colors[rand + 1];

function drawMatrix(matrix, x, y) { // muestra las piezas dibujadas dentro del tablero
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j]) ctx.fillRect(x + j, y + i, 1, 1);
    }
  }
}

function rotateMatrix(matrix, dir) { // rotación de piezas
  this.newMatrix = [];

  for (let i in matrix) this.newMatrix.push([]);

  if (dir === 1) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        this.newMatrix[j][matrix.length - i - 1] = matrix[i][j];
      }
    }
  } else {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        this.newMatrix[matrix.length - j - 1][i] = matrix[i][j];
      }
    }
  }

  return this.newMatrix;
}

function collides(player, arena) { // colisiones
  for (let i = 0; i < player.matrix.length; i++) {
    for (let j = 0; j < player.matrix[i].length; j++) {
      if (
        player.matrix[i][j] &&
        arena[player.pos.y + i + 1][player.pos.x + j + 1]
      )
        return 1;
    }
  }

  return 0;
}

function mergeArena(matrix, x, y) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      arena[y + i + 1][x + j + 1] = arena[y + i + 1][x + j + 1] || matrix[i][j];
    }
  }
}

function clearBlocks() {
  for (let i = 1; i < arena.length - 2; i++) {
    this.clear = 1;

    for (let j = 1; j < arena[i].length - 1; j++) {
      if (!arena[i][j]) this.clear = 0;
    }

    if (this.clear) {
      let r = new Array(tWidth).fill(0); // se llena el tablero con 0
      r.push(1);
      r.unshift(1);

      arena.splice(i, 1);
      arena.splice(1, 0, r);
      contador += 10; // cada fila eliminada suma 10 puntos
      puntaje.innerHTML = "Puntos: " + contador; // función para ejecutar el conteo de puntos
    }
  }
}

function drawArena() {
  for (let i = 1; i < arena.length - 2; i++) {
    for (let j = 1; j < arena[i].length - 1; j++) {
      if (arena[i][j]) {
        ctx.fillStyle = colors[arena[i][j]];
        ctx.fillRect(j - 1, i - 1, 1, 1);
      }
    }
  }
}

function initArena() {
  arena = [];

  const r = new Array(tWidth + 2).fill(1);
  arena.push(r);

  for (let i = 0; i < tHeight; i++) {
    let row = new Array(tWidth).fill(0);
    row.push(1);
    row.unshift(1);

    arena.push(row);
  }

  arena.push(r);
  arena.push(r);
}

function gameOver() { // reincia el juego desde 0
  for (let j = 1; j < arena[1].length - 1; j++)
    if (arena[1][j]) {
      document.querySelector("#perdiste").style.display = "flex";
      contador = 0;
      return initArena();
    }

  return;
}

let interval = 1000;
let lastTime = 0;
let count = 0;

function update(time = 0) {
  const dt = time - lastTime; 
  lastTime = time;
  count += dt;

  if (count >= interval) {
    player.pos.y++;
    count = 0;
  }

  if (collides(player, arena)) {
    mergeArena(player.matrix, player.pos.x, player.pos.y - 1);
    clearBlocks();
    gameOver();

    player.pos.y = 1;
    player.pos.x = 0;

    rand = Math.floor(Math.random() * pieces.length);
    player.matrix = pieces[rand];
    player.color = colors[rand + 1];

    interval = 1000;
  }

  ctx.fillStyle = "#000"; // dibuja fondo del tetris
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawArena(); // acción para ejecutar el dibujo de cada ficha
  ctx.fillStyle = player.color;
  drawMatrix(player.matrix, player.pos.x, player.pos.y);

  requestAnimationFrame(update); // llama a esta funcion update
}

document.addEventListener("keydown", function (tecla) {
  //movimiento de fichas mendiante teclas

  if (tecla.key === "ArrowLeft" && interval - 1) {
    player.pos.x--;
    if (collides(player, arena)) player.pos.x++;
  } else if (tecla.key === "ArrowRight" && interval - 1) {
    player.pos.x++;
    if (collides(player, arena)) player.pos.x--;
  } else if (tecla.key === "ArrowDown") {
    player.pos.y++;
    count = 0;
  } else if (tecla.key === "ArrowUp") {
    player.matrix = rotateMatrix(player.matrix, 1);
    if (collides(player, arena))
      player.matrix = rotateMatrix(player.matrix, -1);
  } else if (event.keyCode === 32) {
    interval = 1;
  }
});

// botones
document.querySelector("#izquierda").addEventListener("click", () => {
  if(interval - 1) {
    player.pos.x--;
    if (collides(player, arena)) player.pos.x++;
  }
});

document.querySelector("#derecha").addEventListener("click", () => {
  if(interval - 1) {
    player.pos.x++;
    if (collides(player, arena)) player.pos.x--;
  }
});

document.querySelector("#abajo").addEventListener("click", () => {
  if(interval - 1) {
    player.pos.y++;
    count = 0;
  }
});

document.querySelector("#cambiar").addEventListener("click", () => {
    player.matrix = rotateMatrix(player.matrix, -1);
});

document.querySelector("#reiniciar").addEventListener("click", () => {
  window.location.reload()
});

document.querySelector("#reiniciar2").addEventListener("click", () => {
  window.location.reload()
});

initArena();
update();
