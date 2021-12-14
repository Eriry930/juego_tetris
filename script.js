const canvas = document.getElementById("tetris"); //llama al canvas en el JavaScript
const ctx = canvas.getContext('2d'); // el contexto será en 2 dimenciones

const scale = 20; // escala de los cuadros

ctx.scale(scale, scale); //la escala del canvas para ver el juego 20 columnas y 25 filas dependiendo del alto y ancho del canvas

const tWidth = canvas.width / scale; //escala a lo ancho
const tHeight = canvas.height / scale; //escala a lo alto

const pieces = [ // dibuja las piezas dentro del tablero
    [
        [1, 1], // cuadrado
        [1, 1]
    ],
    [
        [0, 2, 0, 0], // linea de 4
        [0, 2, 0, 0],
        [0, 2, 0, 0],
        [0, 2, 0, 0]
    ],
    [
        [0, 0, 0], // forma de z
        [3, 3, 0],
        [0, 3, 3]
    ],
    [
        [0, 0, 0], // forma de s
        [0, 4, 4],
        [4, 4, 0]
    ],
    [
        [5, 0, 0],  // forma de L
        [5, 0, 0],
        [5, 5, 0]
    ],
    [
        [0, 0, 6], // forma de L al revez
        [0, 0, 6],
        [0, 6, 6]
    ],
    [
        [0, 0, 0], // forma de T
        [7, 7, 7],
        [0, 7, 0]
    ]
];
const colors = [ // da color a cada pieza
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#76D7C4',
    '#3877FF'
];

let arena = []; 

let rand;

const player = { // constante de tipo objeto
    pos: {x: 0, y: 1}, //posicion de la pieza
    matrix: null,  
    color: null 
}

rand = Math.floor(Math.random() * pieces.length); // elige las piezas aleatoriamente
player.matrix = pieces[rand]; 
player.color = colors[rand+1];

function drawMatrix(matrix, x, y) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j])
                ctx.fillRect(x + j, y + i, 1, 1);
        }
    }
}

function rotateMatrix(matrix, dir) { // le da la rotacion a la ficha 
    let newMatrix = [];

    for (let i in matrix)
        newMatrix.push([]);

    if (dir === 1) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                newMatrix[j][matrix.length - i - 1] = matrix[i][j];
            }
        }
    } else {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                newMatrix[matrix.length - j - 1][i] = matrix[i][j];
            }
        }
    }

    return newMatrix;
}

function collides(player, arena) { // funcion que controla las coliciones
    for (let i = 0; i < player.matrix.length; i++) {
        for (let j = 0; j < player.matrix[i].length; j++) {
            if (player.matrix[i][j] && arena[player.pos.y + i + 1][player.pos.x + j + 1])
                return 1;
        }
    }

    return 0;
}

function mergeArena(matrix, x, y) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            arena[y+i+1][x+j+1] = arena[y+i+1][x+j+1] || matrix[i][j];
        }
    }
}

function clearBlocks() { // funcion que elimina los bloques de la ficha cuando se mueven
    for (let i = 1; i < arena.length-2; i++) {
        let clear = 1;

        for (let j = 1; j < arena[i].length-1; j++) {
            if (!arena[i][j])
                clear = 0;
        }

        if (clear) {
            let r = new Array(tWidth).fill(0); // se llena el tablero con 0
            r.push(1);
            r.unshift(1);

            arena.splice(i, 1);
            arena.splice(1, 0, r);
        }
    }
}

function drawArena() {
    for (let i = 1; i < arena.length-2; i++) {
        for (let j = 1; j < arena[i].length-1; j++) {
            if (arena[i][j]) {
                ctx.fillStyle = colors[arena[i][j]];
                ctx.fillRect(j-1, i-1, 1, 1);
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

function gameOver() { // funcion que reinicia el juego cuando se llenan las filas y no entran mas piezas
    for (let j = 1; j < arena[1].length-1; j++)
        if (arena[1][j])
            return initArena();

    return;
}

let interval = 1000; // intervalo de tiempo
let lastTime = 0;
let count = 0;

function update(time = 0) {

    const dt = time - lastTime; // controla el tiempo en que baja la ficha
    lastTime = time;
    count += dt;

    if (count >= interval) { 
        player.pos.y++;
        count = 0;
    }

    if (collides(player, arena)) {
        mergeArena(player.matrix, player.pos.x, player.pos.y-1);
        clearBlocks(); // llama la funcion para que limpie los bloques
        gameOver(); // llama la funcion gameOven cuando se pierde el juego

        player.pos.y = 1; 
        player.pos.x = 0;

        rand = Math.floor(Math.random() * pieces.length);
        player.matrix = pieces[rand];
        player.color = colors[rand+1];

        interval = 1000; // intervalo de tiempo 
    }

    ctx.fillStyle = " rgba(151, 50, 200, 0.09)"; // dibuja fondo del tetris y le da un efecto de sombra a la ficha     
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawArena(); // acción para ejecutar el dibujo de cada ficha
    ctx.fillStyle = player.color;
    drawMatrix(player.matrix, player.pos.x, player.pos.y);

    requestAnimationFrame(update); 
}


document.addEventListener("keydown", function(tecla) { //movimiento de fichas mendiante teclas

    if (tecla.key === "ArrowLeft" && interval-1) { // tecla hacia la izquierda
        player.pos.x--;
        if (collides(player, arena))
            player.pos.x++;
    } else if (tecla.key === "ArrowRight" && interval-1) { // tecla hacia la derecha
        player.pos.x++;
        if (collides(player, arena))
            player.pos.x--;
    } else if (tecla.key === "ArrowDown") { // tecla hacia abajo
        player.pos.y++;
        count = 0;
    } else if (tecla.key === "ArrowUp") {
        player.matrix = rotateMatrix(player.matrix, 1); // tecla hacia arriba que hace rotar la pieza
        if (collides(player, arena))
            player.matrix = rotateMatrix(player.matrix, -1); // tecla que hace que la pieza vaya hacia abajo más rápido
    } else if (tecla.key === "End") {
        interval = 1;
    }

 

});
initArena();
update();