# microbit

The [micro:bit](http://microbit.org/guide/features/) controller is yet another type of programmable hardware unit, just like ``Arduino Uno``.

### Labyrinth

This is my first serious program for the ``micro:bit`` controller. It utilizes the embedded buttons and the accelerometer sensor. The game generates random [perfect maze](https://en.wikipedia.org/wiki/Maze#Solving_mazes) and the player starts from the upper left corner. The goal of the game is to get to the other 3 corners and then get back to the upper left corner. You can navigate the maze by tilting the ``micro:bit`` unit in the direction where you want the player to go. The corner destinations are marked with slowly blinking points and the player is marked with fast blinking point.

At the beginning you can choose the maze size. Currently the maze size is limited to 5x5 because the maze creation algorithm is based on [recursive backtracker](https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker) and the hardware can't handle the recursion depth (16KB RAM). This can be solved by switching to the [randomized Prim's algorithm](https://en.wikipedia.org/wiki/Maze_generation_algorithm#Randomized_Prim's_algorithm) which I used when I was young student and I was experimenting with 2D graphics.

Use buttons ``A`` and ``B`` to select the initial maze size. Then press buttons ``A`` and ``B`` together in order to start the game. Tilt the device in the direction where you want to go. That's all. When you finish the game press the reset button.

The code can be placed directly in the [online JavaScript IDE](https://makecode.microbit.org) and the game can be played in the emulator, although the tilting doesn't work that well there.

Note that currently there is a bug in the maze generation process which sometimes makes the 4x4 maze unsolvable. The issue never appeared in the other maze sizes, although in theory it should affect the other maze sizes as well. Nevertheless, my experiments show that the issue can be observed only sometimes in 4x4 mazes.
