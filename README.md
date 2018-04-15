# microbit

The [micro:bit](http://microbit.org/guide/features/) controller is yet another type of programmable hardware unit, just like ``Arduino Uno``.

### Labyrinth

This code is [public domain](https://en.wikipedia.org/wiki/Public-domain_software).

This is my first serious program for the ``micro:bit`` controller. It utilizes the embedded buttons and the accelerometer sensor. The game generates random [perfect maze](https://en.wikipedia.org/wiki/Maze#Solving_mazes) and the player starts from the upper left corner. The goal of the game is to get to the other 3 corners and then get back to the upper left corner. You can navigate the maze by tilting the ``micro:bit`` unit in the direction where you want the player to go. The corner destinations are marked with slowly blinking points and the player is marked with fast blinking point.

At the beginning you can choose the maze size. Currently the maze size is limited to 9x9 but it is safe to use sizes up to 12x12 and probably even bigger before you reach the RAM limitations. The maze generation is based on the [randomized Prim's algorithm](https://en.wikipedia.org/wiki/Maze_generation_algorithm#Randomized_Prim's_algorithm).

Use buttons ``A`` and ``B`` to select the initial maze size. Then press buttons ``A`` and ``B`` together in order to start the game. Tilt the device in the direction where you want to go. That's all. When you finish the game press the reset button.

You can also [give it a try](https://makecode.microbit.org/_R37T4raz7dP5) in the ``Microsoft MakeCode`` online environment and play the game in the ``micro:bit`` simulator.
