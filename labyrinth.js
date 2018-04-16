/*
                This code is PUBLIC DOMAIN

                   Author: Ivan Davidov

          http://github/com/ivandavidov/microbit

  The game generates random maze and puts the player at the
  top left corner. The end goal is to reach the other three
  corners which are marked with slowly blinking dots and then
  return back to the top left corner.

  The player dot blinks faster and it is always at the center
  of the display. You can navigate the player by tilting the
  micro:bit device at the direction where you want the player
  to go.

  In the beginning of the game you can choose the maze size.
  The default size is 5x5. Use buttons A or B to change the
  maze size. The max size is limited to 9 but this can be
  changed quite easily in the program.

  Start the game by pressing buttons A and B together. You
  will see an hourglass icon which indicates that the maze
  is being generated. After a while it will disappear and
  you can start playing the game.

  Use the reset button to start new game.

  The magze generation algorithm is based on the randomized
  Prim's algorithm. 

  http://en.wikipedia.org/wiki/Maze_generation_algorithm#Randomized_Prim's_algorithm

  http://weblog.jamisbuck.org/2011/1/10/maze-generation-prim-s-algorithm

*/

// The maze grid, represented as one-dimensional array.
// JavaScript sucks when we deal with 2D+ arrays.
let maze: boolean[] = []

// Initial offset coordinates when drawing the maze.
let masterX: number = 1;
let masterY: number = 1;

// Maze size constants.
const MIN_SIZE = 2
const MAX_SIZE = 9
const DEF_SIZE = 5

// Initial maze size.
let size: number = DEF_SIZE

// Is the maze generated?
let generated = false;

// Initial player position as cell coordinates.
let playerX: number = 0
let playerY: number = 0

// These are used to handle the point blinking.
let playerState: boolean = false
let cornerState: boolean = false

// How often to generate custom events in milliseconds.
const EVENT_TIME: number = 100

// Counter for the custom events.
let nextEvent: number = 0

// Keep track of reached corners.
let cornersReached: boolean[] = []
cornersReached[0] = false;
cornersReached[1] = false;
cornersReached[2] = false;

// Not theat this flag has nothing to do with
// the function "game.gameOver()".
let gameOver: boolean = false;

// Game stage flag. The first stage is to reach
// the other three corners. The second stage is
// to reach the upper left corner of the maze.
let secondStage: boolean = false

// At what tilt degrees to consider that we have
// "move" event and "flat" event.
const TILT_DEGREES_MOVE: number = 15
const TILT_DEGREES_FLAT: number = 10

// Board's tilt position. False means almost no tilt.
let mbState: boolean = false

// Brightness levels.
let BRIGHTNESS_WALL: number = 16
let BRIGHTNESS_CORNER: number = 64
let BRIGHTNESS_PLAYER: number = 255

// Display the initial maze size.
basic.showNumber(size)

// Initialize all maze cells with solid walls.
for (let x: number = 0; x < size; x++) {
    for (let y: number = 0; y < size; y++) {
        setCell(x, y, false, false, false, false)
    }
}

// Build individual maze cell.
function setCell(x: number, y: number, north: boolean, south: boolean, west: boolean, east: boolean) {
    let pos: number = (size * x + y) * 4
    maze[pos] = north
    maze[pos + 1] = south
    maze[pos + 2] = west
    maze[pos + 3] = east
}

// Get the 'y' coordinate of a maze cell. The input is
// the position of the first cell wall in the maze array.
function getXFromPos(pos: number): number {
    let x: number = (pos / 4) % size
    let y: number = ((pos / 4) - x) / size

    return x
}

// Get the 'y' coordinate of a maze cell. The input is
// the position of the first cell wall in the maze array.
function getYFromPos(pos: number): number {
    let x: number = (pos / 4) % size
    let y: number = ((pos / 4) - x) / size

    return y
}

// Get the 'x' coordinate of a maze cell.
// The input is the cell position in the maze.
function getX(cell: number): number {
    let pos: number = cell * 4;
    return getXFromPos(pos)
}

// Get the 'y' coordinate of a maze cell.
// The input is the cell position in the maze.
function getY(cell: number): number {
    let pos: number = cell * 4;
    return getYFromPos(pos)
}

// Does this cell has north path?
function getNorth(cell: number): boolean {
    let pos: number = cell * 4
    return maze[pos]
}

// Set the north wall path.
function setNorth(cell: number, path: boolean) {
    let pos: number = cell * 4
    return maze[pos] = path
}

// Does this cell has south path?
function getSouth(cell: number): boolean {
    let pos: number = cell * 4
    return maze[pos + 1]
}

// Set the south path state.
function setSouth(cell: number, path: boolean) {
    let pos: number = cell * 4
    return maze[pos + 1] = path
}

// Does this cell has west path?
function getWest(cell: number): boolean {
    let pos: number = cell * 4
    return maze[pos + 2]
}

// Set the west path state.
function setWest(cell: number, path: boolean) {
    let pos: number = cell * 4
    return maze[pos + 2] = path
}

// Does this cell has east path?
function getEast(cell: number): boolean {
    let pos: number = cell * 4
    return maze[pos + 3]
}

// Set the east wall state.
function setEast(cell: number, path: boolean) {
    let pos: number = cell * 4
    return maze[pos + 3] = path
}

// How many walls can we break in this cell?
function getMaxBrokenWalls(cell: number): number {
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

// How many walls are broken in this cell?
function getActualBrokenWalls(cell: number): number {
    let brokenWalls: number = 0

    if (getNorth(cell)) {
        brokenWalls++
    }

    if (getSouth(cell)) {
        brokenWalls++
    }

    if (getWest(cell)) {
        brokenWalls++
    }

    if (getEast(cell)) {
        brokenWalls++
    }

    return brokenWalls
}

// Break the north wall for this cell.
function breakNorthWall(cell: number) {
    let x: number = getX(cell)
    let y: number = getY(cell)

    setNorth(cell, true)

    if (y = 0) {
        return
    }

    let northCell = cell - size
    setSouth(northCell, true)
}

// Break the south wall for this cell.
function breakSouthWall(cell: number) {
    let x: number = getX(cell)
    let y: number = getY(cell)

    setSouth(cell, true)

    if (y == size - 1) {
        return
    }

    let southCell = cell + size
    setNorth(southCell, true)
}

// Break the west wall for this cell.
function breakWestWall(cell: number) {
    let x: number = getX(cell)
    let y: number = getY(cell)

    setWest(cell, true)

    if (x == 0) {
        return
    }

    let westCell = cell - 1
    setEast(westCell, true)
}

// Break the east wall for this cell.
function breakEastWall(cell: number) {
    let x: number = getX(cell)
    let y: number = getY(cell)

    setEast(cell, true)

    if (x == size - 1) {
        return
    }

    let eastCell = cell + 1
    setWest(eastCell, true)
}

// Draw the maze on the screen with master X/Y offset.
function drawMaze() {
    basic.clearScreen()

    for (let x: number = 0; x < size; x++) {
        for (let y: number = 0; y < size; y++) {
            let cell: number = size * y + x
            let cellX: number = 2 * x + 1 + masterX
            let cellY: number = 2 * y + 1 + masterY

            drawCell(cell, cellX, cellY)
        }
    }
}

// Draw individual maze cell on the screen.
function drawCell(cell: number, posX: number, posY: number) {
    if (!getNorth(cell)) {
        drawNorthWall(posX, posY)
    }

    if (!getSouth(cell)) {
        drawSouthWall(posX, posY)
    }

    if (!getWest(cell)) {
        drawWestWall(posX, posY)
    }

    if (!getEast(cell)) {
        drawEastWall(posX, posY)
    }
}

// Draw north wall at the specified position.
function drawNorthWall(posX: number, posY: number) {
    let x: number = posX - 1
    let y: number = posY - 1

    for (let i: number = 0; i < 3; i++) {
        led.plotBrightness(x + i, y, BRIGHTNESS_WALL)
    }
}

// Draw south wall at the specified position.
function drawSouthWall(posX: number, posY: number) {
    let x: number = posX - 1
    let y: number = posY + 1

    for (let i: number = 0; i < 3; i++) {
        led.plotBrightness(x + i, y, BRIGHTNESS_WALL)
    }
}

// Draw west wall at the specified position.
function drawWestWall(posX: number, posY: number) {
    let x: number = posX - 1
    let y: number = posY - 1

    for (let i: number = 0; i < 3; i++) {
        led.plotBrightness(x, y + i, BRIGHTNESS_WALL)
    }
}

// Draw east wall at the specified position.
function drawEastWall(posX: number, posY: number) {
    let x: number = posX + 1
    let y: number = posY - 1

    for (let i: number = 0; i < 3; i++) {
        led.plotBrightness(x, y + i, BRIGHTNESS_WALL)
    }
}

//Is the north cell intact?
function checkNorth(cell: number): boolean {
    let x: number = getX(cell)
    let y: number = getY(cell)

    if (y == 0) {
        return true
    }

    let nextCell: number = size * (y - 1) + x
    let broken: number = getActualBrokenWalls(nextCell)

    return broken == 0
}

//Is the south cell intact?
function checkSouth(cell: number): boolean {
    let x: number = getX(cell)
    let y: number = getY(cell)

    if (y == size - 1) {
        return true
    }

    let nextCell: number = size * (y + 1) + x
    let broken: number = getActualBrokenWalls(nextCell)

    return broken == 0
}

//Is the west cell intact?
function checkWest(cell: number): boolean {
    let x: number = getX(cell)
    let y: number = getY(cell)

    if (x == 0) {
        return true
    }

    let nextCell: number = size * y + x - 1
    let broken: number = getActualBrokenWalls(nextCell)

    return broken == 0
}

//Is the east cell intact?
function checkEast(cell: number): boolean {
    let x: number = getX(cell)
    let y: number = getY(cell)

    if (x == size - 1) {
        return true
    }

    let nextCell: number = size * y + x + 1
    let broken: number = getActualBrokenWalls(nextCell)

    return broken == 0
}

// Generate new random maze by using the
// randomized Prim's algorithm.
function generateMaze() {
    let initialWall: number = Math.random(2)

    // Always start with the fisrt maze cell.
    if (initialWall == 0) {
        breakSouthWall(0)
    } else {
        breakEastWall(0)
    }

    // Find all adjacent cells which are intact.
    let nextCells: number[] = findNextCells()

    while (nextCells.length > 0) {
        let cellIndex: number = Math.random(nextCells.length)

        removeWall(nextCells[cellIndex])
        nextCells = findNextCells()
    }
}

// Remove random wall for the specified cell.
function removeWall(cell: number) {
    let x: number = getX(cell)
    let y: number = getY(cell)

    let canBreak: boolean[] = []
    let maxCanBreak: number = 0;

    if (x == 0) {
        canBreak[0] = false
    } else if (!checkWest(cell)) {
        canBreak[0] = true
        maxCanBreak++
    }

    if (x == size - 1) {
        canBreak[1] = false
    } else if (!checkEast(cell)) {
        canBreak[1] = true
        maxCanBreak++
    }

    if (y == 0) {
        canBreak[2] = false
    } else if (!checkNorth(cell)) {
        canBreak[2] = true
        maxCanBreak++
    }

    if (y == size - 1) {
        canBreak[3] = false
    } else if (!checkSouth(cell)) {
        canBreak[3] = true
        maxCanBreak++
    }

    let toBreak: number = Math.random(maxCanBreak)
    let wall: number = -1

    for (let i: number = 0; i < canBreak.length; i++) {
        wall++

        if (canBreak[i]) {
            toBreak--
        }

        if (toBreak < 0) {
            break
        }
    }

    switch (wall) {
        case 0: {
            breakWestWall(cell)
            break
        }
        case 1: {
            breakEastWall(cell)
            break
        }
        case 2: {
            breakNorthWall(cell)
            break
        }
        case 3: {
            breakSouthWall(cell)
            break
        }
    }
}

// Find all maze cells that are intact and are
// neighboring broken cells.
function findNextCells(): number[] {
    let nextCells: number[] = []

    for (let i: number = 0; i < size * size; i++) {
        if (getActualBrokenWalls(i) > 0) {
            continue
        }

        if (!checkNorth(i)) {
            nextCells.push(i)
            continue
        }

        if (!checkSouth(i)) {
            nextCells.push(i)
            continue
        }

        if (!checkWest(i)) {
            nextCells.push(i)
            continue
        }

        if (!checkEast(i)) {
            nextCells.push(i)
            continue
        }
    }

    return nextCells
}

// Draw the blinking dot which represents the player
function drawPlayer() {
    if (!generated || gameOver) {
        return
    }

    if (playerState) {
        led.plotBrightness(2, 2, BRIGHTNESS_PLAYER)
    } else {
        led.unplot(2, 2)
    }

    playerState = !playerState
}

// Draw the blinking corner dots.
function drawCorners() {
    if (!generated || gameOver) {
        return
    }

    if (secondStage) {
        if (cornerState) {
            led.plotBrightness(masterX + 1, masterY + 1, BRIGHTNESS_CORNER)
        } else {
            led.unplot(masterX + 1, masterY + 1)
        }
    } else {
        if (!cornersReached[0]) {
            if (cornerState) {
                led.plotBrightness(masterX + size * 2 - 1, masterY + 1, BRIGHTNESS_CORNER)
            } else {
                led.unplot(masterX + size * 2 - 1, masterY + 1)
            }
        }

        if (!cornersReached[1]) {
            if (cornerState) {
                led.plotBrightness(masterX + 1, masterY + size * 2 - 1, BRIGHTNESS_CORNER)
            } else {
                led.unplot(masterX + 1, masterY + size * 2 - 1)
            }
        }

        if (!cornersReached[2]) {
            if (cornerState) {
                led.plotBrightness(masterX + size * 2 - 1, masterY + size * 2 - 1, BRIGHTNESS_CORNER)
            } else {
                led.unplot(masterX + size * 2 - 1, masterY + size * 2 - 1)
            }
        }
    }

    cornerState = !cornerState
}

// Determine the game state.
function checkGameState() {
    if (secondStage && playerX == 0 && playerY == 0) {
        gameOver = true
        led.setDisplayMode(DisplayMode.BackAndWhite)
        basic.showIcon(IconNames.Yes)
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

// Check the board's tilt position and process the
// player's movement accordingly.
function checkBoardTilt() {
    if (!generated || gameOver) {
        return
    }

    let pitch: number = input.rotation(Rotation.Pitch)
    let roll: number = input.rotation(Rotation.Roll)

    let cell: number = size * playerY + playerX

    if (pitch > TILT_DEGREES_MOVE && !mbState && getSouth(cell)) {
        mbState = true
        playerY++
        masterY -= 2
        drawMaze()
    }

    if (pitch < -TILT_DEGREES_MOVE && !mbState && getNorth(cell)) {
        mbState = true
        playerY--
        masterY += 2
        drawMaze()
    }

    if (roll > TILT_DEGREES_MOVE && !mbState && getEast(cell)) {
        mbState = true
        playerX++
        masterX -= 2
        drawMaze()
    }

    if (roll < -TILT_DEGREES_MOVE && !mbState && getWest(cell)) {
        mbState = true
        playerX--
        masterX += 2
        drawMaze()
    }

    if (Math.abs(pitch) < TILT_DEGREES_FLAT && Math.abs(roll) < 10) {
        mbState = false
    }

}

// Generate the maze and start the game.
input.onButtonPressed(Button.AB, () => {
    if (generated || gameOver) {
        return
    }

    basic.showLeds(`
        # # # # #
        . # # # .
        . . # . .
        . # . # .
        # # # # #
        `)

    generateMaze()
    generated = true
    drawMaze()
})

// Decrease the maze size.
input.onButtonPressed(Button.A, () => {
    if (generated || gameOver) {
        return
    }

    if (size > MIN_SIZE) {
        size--
    }

    basic.showNumber(size)
})

// Increase the maze size.
input.onButtonPressed(Button.B, () => {
    if (generated || gameOver) {
        return
    }

    if (size < MAX_SIZE) {
        size++
    }

    basic.showNumber(size)
})

// Generate and handle custom events which produce the
// blinking effect.
basic.forever(() => {
    if (!gameOver && input.runningTime() / EVENT_TIME > nextEvent) {
        nextEvent++

        checkGameState()
        checkBoardTilt()

        // Redraw player every 200 ms.
        if (nextEvent % 2 == 0) {
            drawPlayer()
        }

        // Redraw corner dots every 500 ms.
        if (nextEvent % 5 == 0) {
            drawCorners()
        }
    }
})
