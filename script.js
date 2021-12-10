const canvas = document.getElementById("tetris"); //llama al canvas en el JavaScript
const context = canvas.getContext ("2d") // el contexto será en 2 dimenciones

context.fillRect(0,0,1,1)
const scale = 20
context.scale(scale, scale); //la escala del canvas para ver el juego 20 columnas y 25 filas dependiendo del alto y ancho del canvas

const tWidth = canvas.width / scale
const tHeight = canvas.height / scale

const pieces = [
    [
        [1,1],
        [1,1],
    ],
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
    ],
    [
        [0,0,0],
        [0,1,1],
        [1,1,0],
    ],
    [
        [0,0,1],
        [0,0,1],
        [0,1,1],
    ],
    [
        [0,0,0],
        [1,1,1],
        [0,1,0],
    ]
]
const arena = []

const player = {
    pos: {x:0, y:0},
    matrix: pieces [3]
}

function drawMatrix(matrix, x, y) {
    for (let i = 0; i < matrix.length; i++){
        for (let j = 0; j < matrix[i].length; j++){
            if (matrix [i] [j])
                context.fillRect(x + j, y + i, 1, 1)
        }
    }
}

function initArena() {
    const r = new Array(tWidth + 2).fill(1)
    arena.push(r)

    for (let i = 0; i < tHeight; i++){
        let row = new Array(tWidth).fill(0)
        row.push(1)
        row.unshift(1)

        arena.push(row)
    }
        arena.push(r)
}


let interval = 1000
let lastTime = 0
let count= 0

function update(time =0) {
    const dt = time - lastTime
    lastTime = time
    count += dt

    if (count >= interval){
        player.pos.y++
        count = 0
    }

    context.fillStyle = "#000000"
    context.fillRect(0, 0, canvas.clientWidth, canvas.height)

    context.fillStyle = "red"
    drawMatrix(player.matrix, player.pos.x, player.pos.y)

    requestAnimationFrame(update)
}

document.addEventListener('keydown', function(tecla){

    if(tecla.key == "ArrowLeft"){
        player.pos.x--
    }
    if(tecla.key == "ArrowRight"){
        player.pos.x++
    }
    if(tecla.key == "ArrowDown"){
        player.pos.y++
        count = 0
    }
})

initArena()
update()