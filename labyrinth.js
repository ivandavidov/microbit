let maze: boolean[] = []

let stack: number[] = []

let masterX: number = 1;
let masterY: number = 1;

const MIN_SIZE = 2
const MAX_SIZE = 5
const DEF_SIZE = 3

let size: number = DEF_SIZE
let generated = false;

let playerX: number = 0
let playerY: number = 0

let playerState: boolean = false
let cornerState: boolean = false

let nextEvent: number = 0

let cornersReached: boolean[] = []

cornersReached[0] = false;
cornersReached[1] = false;
cornersReached[2] = false;

let gameOver: boolean = false;

let secondStage: boolean = false;

basic.showNumber(size)

for (let x: number = 0; x < size; x++) {
    for (let y: number = 0; y < size; y++) {
        setCell(x, y, false, false, false, false)
    }
}

function setCell(x: number, y: number, up: boolean, down: boolean, left: boolean, right: boolean) {
    let pos: number = (size * x + y) * 4
    maze[pos] = up
    maze[pos + 1] = down
    maze[pos + 2] = left
    maze[pos + 3] = right
}

function getXFromPos(pos: number): number {
    let x: number = (pos / 4) % size
    let y: number = ((pos / 4) - x) / size

    return x
}

function getYFromPos(pos: number): number {
    let x: number = (pos / 4) % size
    let y: number = ((pos / 4) - x) / size

    return y
}

function getX(cell: number): number {
    let pos: number = cell * 4;
    return getXFromPos(pos)
}

function getY(cell: number): number {
    let pos: number = cell * 4;
    return getYFromPos(pos)
}

function getUp(cell: number): boolean {
    let pos: number = cell * 4
    return maze[pos]
}

function setUp(cell: number, path: boolean) {
    let pos: number = cell * 4
    return maze[pos] = path
}

function getDown(cell: number): boolean {
    let pos: number = cell * 4
    return maze[pos + 1]
}

function setDown(cell: number, path: boolean) {
    let pos: number = cell * 4
    return maze[pos + 1] = path
}

function getLeft(cell: number): boolean {
    let pos: number = cell * 4
    return maze[pos + 2]
}

function setLeft(cell: number, path: boolean) {
    let pos: number = cell * 4
    return maze[pos + 2] = path
}

function getRight(cell: number): boolean {
    let pos: number = cell * 4
    return maze[pos + 3]
}

function setRight(cell: number, path: boolean) {
    let pos: number = cell * 4
    return maze[pos + 3] = path
}

function getMaxFallenWalls(cell: number): number {
    let maxWalls: number = 4

    let x: number = getX(cell)
    let y: number = getY(cell)

    if (x == 0 || x == size - 1) {
        maxWalls--
    }

    if (y == 0 || y == size - 1) {
        maxWalls--
    }

    return maxWalls
}

function getActualFallenWalls(cell: number): number {
    let fallenWalls: number = 0

    let up: boolean = getUp(cell)
    let down: boolean = getDown(cell)
    let left: boolean = getLeft(cell)
    let right: boolean = getRight(cell)

    if (up) {
        fallenWalls++
    }

    if (down) {
        fallenWalls++
    }

    if (left) {
        fallenWalls++
    }

    if (right) {
        fallenWalls++
    }

    return fallenWalls
}

function breakUpWall(cell: number) {
    let x: number = getX(cell)
    let y: number = getY(cell)

    setUp(cell, true)

    if (y = 0) {
        return
    }

    let upCell = cell - size
    setDown(upCell, true)
}

function breakDownWall(cell: number) {
    let x: number = getX(cell)
    let y: number = getY(cell)

    setDown(cell, true)

    if (y == size - 1) {
        return
    }

    let downCell = cell + size
    setUp(downCell, true)
}

function breakLeftWall(cell: number) {
    let x: number = getX(cell)
    let y: number = getY(cell)

    setLeft(cell, true)

    if (x == 0) {
        return
    }

    let leftCell = cell - 1
    setRight(leftCell, true)
}

function breakRightWall(cell: number) {
    let x: number = getX(cell)
    let y: number = getY(cell)

    setRight(cell, true)

    if (x == size - 1) {
        return
    }

    let rightCell = cell + 1
    setLeft(rightCell, true)
}

function findCenterCell(): number {
    let center: number = size / 2
    return center
}

function drawMaze(center: number) {
    basic.clearScreen()

    let cellX: number = getX(center)
    let cellY: number = getY(center)

    for (let x: number = 0; x < size; x++) {
        for (let y: number = 0; y < size; y++) {
            let cell: number = size * y + x
            let cellX: number = 2 * x + 1 + masterX
            let cellY: number = 2 * y + 1 + masterY
            drawCell(cell, cellX, cellY)
        }
    }

    //for (let x: number = -1; x < 2; x++) {
    //    for (let y: number = -1; y < 2; y++) {
    //        let cell: number = cellX + x + (y * size)
    //        let posX: number = 2 - (x * 2)
    //        let posY: number = 2 - (y * 2)
    //        drawCell(cell, posX, posY)
    //    }
    //}

    //drawCell(0, 1, 1)
    //drawCell(1, 3, 1)
    //drawCell(2, 5, 1)
    //drawCell(3, 1, 3)
    //drawCell(1, 3, 1)
    //drawCell(center - 1 - size, 1, 1)
    //drawCell(center - 0 - size, 3, 1)
    //drawCell(center - 1 - 0, 1, 3)
}

function drawCell(cell: number, posX: number, posY: number) {
    if (!getUp(cell)) {
        drawUpWall(posX, posY)
    }

    if (!getDown(cell)) {
        drawDownWall(posX, posY)
    }

    if (!getLeft(cell)) {
        drawLeftWall(posX, posY)
    }

    if (!getRight(cell)) {
        drawRightWall(posX, posY)
    }
}

function drawUpWall(posX: number, posY: number) {
    let x: number = posX - 1
    let y: number = posY - 1

    for (let i: number = 0; i < 3; i++) {
        led.plot(x + i, y)
    }
}

function drawDownWall(posX: number, posY: number) {
    let x: number = posX - 1
    let y: number = posY + 1

    for (let i: number = 0; i < 3; i++) {
        led.plot(x + i, y)
    }
}

function drawLeftWall(posX: number, posY: number) {
    let x: number = posX - 1
    let y: number = posY - 1

    for (let i: number = 0; i < 3; i++) {
        led.plot(x, y + i)
    }
}

function drawRightWall(posX: number, posY: number) {
    let x: number = posX + 1
    let y: number = posY - 1

    for (let i: number = 0; i < 3; i++) {
        led.plot(x, y + i)
    }
}

function checkUp(cell: number): boolean {
    let whole: boolean = true

    let x: number = getX(cell)
    let y: number = getY(cell)

    if (y == 0) {
        return true
    }

    let nextCell: number = size * (y - 1) + x
    let fallen: number = getActualFallenWalls(nextCell)

    return fallen == 0
}

function checkDown(cell: number): boolean {
    //basic.showNumber(55)
    let x: number = getX(cell)
    let y: number = getY(cell)

    if (y == size - 1) {
        return true
    }

    let nextCell: number = size * (y + 1) + x
    let fallen: number = getActualFallenWalls(nextCell)

    //basic.showNumber(fallen)

    return fallen == 0
}

function checkLeft(cell: number): boolean {
    let whole: boolean = true

    let x: number = getX(cell)
    let y: number = getY(cell)

    if (x == 0) {
        return true
    }

    let nextCell: number = size * y + x - 1
    let fallen: number = getActualFallenWalls(nextCell)

    return fallen == 0
}

function checkRight(cell: number): boolean {
    let whole: boolean = true

    let x: number = getX(cell)
    let y: number = getY(cell)

    if (x == size - 1) {
        return true
    }

    let nextCell: number = size * y + x + 1
    let fallen: number = getActualFallenWalls(nextCell)

    return fallen == 0
}

function generateMaze() {
    let cell: number = Math.random(size * size)
    //let cell: number = 3
    stack.push(cell)
    estimate(1)
    //sweepMaze()
}

function sweepMaze() {
    /*
    There is some bug when we have 4x4 maze and probably
    the issue is with all even sized mazes, even though
    the bug appears only in 4x4 mazes. This hacky trick
    checks the edge cells and opens them if necessary.
    */

    if (getActualFallenWalls(0) == 0) {
        breakDownWall(0)
    }

    if (getActualFallenWalls(size - 1) == 0) {
        breakDownWall(size - 1)
    }

    if (getActualFallenWalls(size * (size - 1)) == 0) {
        breakUpWall(size * (size - 1))
    }

    if (getActualFallenWalls(size * size - 1) == 0) {
        breakUpWall(size * size - 1)
    }
}

function estimate(count: number) {
    //if (count > 5) {
    //    return
    //}

    if (stack.length == 0) {
        return
    }

    let cell: number = stack.pop()
    let max: number = getMaxFallenWalls(cell)
    let fallen: number = getActualFallenWalls(cell)

    let index: number = Math.random(max - fallen)
    //let index: number = 0
    let paths: boolean[] = []

    paths[0] = !checkUp(cell)
    paths[1] = !checkDown(cell)
    paths[2] = !checkLeft(cell)
    paths[3] = !checkRight(cell)

    if (getX(cell) == 0) {
        paths[2] = true
    }

    if (getX(cell) == size - 1) {
        paths[3] = true
    }

    if (getY(cell) == 0) {
        paths[0] = true
    }

    if (getY(cell) == size - 1) {
        paths[1] = true
    }

    let wallNum: number = -1;
    for (let i: number = 0; i < 4; i++) {
        if (paths[i] == false) {
            index--
        }

        if (index < 0) {
            wallNum = i
            break
        }
    }

    /*
    if (count == 7) {
        basic.showNumber(cell)
        basic.showNumber(wallNum)
        basic.showString("" + paths[0])
        basic.showString("" + paths[1])
        basic.showString("" + paths[2])
        basic.showString("" + paths[3])
    }
    */

    let nextCell: number = breakWall(cell, wallNum)

    if (nextCell >= 0) {
        stack.push(cell)
        stack.push(nextCell)
    }

    estimate(++count)
}

function breakWall(cell: number, wall: number): number {
    let nextCell = -1;

    if (wall == -1) {
        return nextCell
    }

    switch (wall) {
        case 0: {
            //breakUpWall(cell)
            nextCell = cell - size
            break
        }
        case 1: {
            //breakDownWall(cell)
            nextCell = cell + size
            break
        }
        case 2: {
            //breakLeftWall(cell)
            nextCell = cell - 1
            break
        }
        case 3: {
            //breakRightWall(cell)
            nextCell = cell + 1
            break
        }
    }

    let fallen: number = getActualFallenWalls(nextCell)

    if (fallen > 0) {
        nextCell = -1
        return
    }

    switch (wall) {
        case 0: {
            breakUpWall(cell)
            //nextCell = cell - size
            break
        }
        case 1: {
            breakDownWall(cell)
            //nextCell = cell + size
            break
        }
        case 2: {
            breakLeftWall(cell)
            //nextCell = cell - 1
            break
        }
        case 3: {
            breakRightWall(cell)
            //nextCell = cell + 1
            break
        }
    }

    return nextCell
}

function drawPlayer() {
    if (!generated || gameOver) {
        return
    }

    if (playerState) {
        led.plot(2, 2)
    } else {
        led.unplot(2, 2)
    }

    playerState = !playerState
}

function drawCorners() {
    if (!generated || gameOver) {
        return
    }

    if (secondStage) {
        if (cornerState) {
            led.plot(masterX + 1, masterY + 1)
        } else {
            led.unplot(masterX + 1, masterY + 1)
        }
    } else {
        if (!cornersReached[0] && cornerState) {
            led.plot(masterX + size * 2 - 1, masterY + 1)
        } else {
            led.unplot(masterX + size * 2 - 1, masterY + 1)
        }

        if (!cornersReached[1] && cornerState) {
            led.plot(masterX + 1, masterY + size * 2 - 1)
        } else {
            led.unplot(masterX + 1, masterY + size * 2 - 1)
        }

        if (!cornersReached[2] && cornerState) {
            led.plot(masterX + size * 2 - 1, masterY + size * 2 - 1)
        } else {
            led.unplot(masterX + size * 2 - 1, masterY + size * 2 - 1)
        }
    }

    cornerState = !cornerState
}

function checkGameState() {
    if (secondStage) {
        if (playerX == 0 && playerY == 0) {
            gameOver = true
            basic.showIcon(IconNames.Yes)
        }
    } else {
        if (playerX == size - 1 && playerY == 0) {
            cornersReached[0] = true
        }

        if (playerX == 0 && playerY == size - 1) {
            cornersReached[1] = true
        }

        if (playerX == size - 1 && playerY == size - 1) {
            cornersReached[2] = true
        }

        if (cornersReached[0] && cornersReached[1] && cornersReached[2]) {
            secondStage = true

            led.unplot(masterX + size * 2 - 1, masterY + 1)
            led.unplot(masterX + 1, masterY + size * 2 - 1)
            led.unplot(masterX + size * 2 - 1, masterY + size * 2 - 1)
        }
    }
}
input.onGesture(Gesture.TiltLeft, () => {
    if (!generated || gameOver) {
        return
    }

    let cell: number = size * playerY + playerX

    if (getLeft(cell)) {
        playerX--
        masterX += 2
        drawMaze(0)
    }
})

input.onGesture(Gesture.TiltRight, () => {
    if (!generated || gameOver) {
        return
    }

    let cell: number = size * playerY + playerX

    if (getRight(cell)) {
        playerX++
        masterX -= 2
        drawMaze(0)
    }
})

input.onGesture(Gesture.LogoDown, () => {
    if (!generated || gameOver) {
        return
    }

    let cell: number = size * playerY + playerX

    if (getUp(cell)) {
        playerY--
        masterY += 2
        drawMaze(0)
    }
})

input.onGesture(Gesture.LogoUp, () => {
    if (!generated || gameOver) {
        return
    }

    //basic.showString("U")

    let cell: number = size * playerY + playerX

    if (getDown(cell)) {
        //basic.showString("" + cell + "" + playerX + "" + playerY)
        playerY++
        masterY -= 2
        drawMaze(0)
    }
})

input.onButtonPressed(Button.AB, () => {
    if (generated || gameOver) {
        return
    }

    generateMaze()
    generated = true
    drawMaze(0)
})

input.onButtonPressed(Button.A, () => {
    if (generated || gameOver) {
        return
    }

    if (size > MIN_SIZE) {
        size--
    }

    basic.showNumber(size)
})

input.onButtonPressed(Button.B, () => {
    if (generated || gameOver) {
        return
    }

    if (size < MAX_SIZE) {
        size++
    }

    basic.showNumber(size)
})

basic.forever(() => {
    if (!gameOver && input.runningTime() / 100 > nextEvent) {
        nextEvent++

        checkGameState()

        if (nextEvent % 2 == 0) {
            drawPlayer()
        }

        if (nextEvent % 5 == 0) {
            drawCorners()
        }
    }
})
