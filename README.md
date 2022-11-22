### Galaxy Puzzle

A web-page playable version of the online puzzle game Galaxies (puzzles referenced from [KrazyDad](https://krazydad.com/galaxies/)). 

In Galaxies, you begin with a grid of galaxy centers (represented by dots) which can be anywhere on the grid. You must add lines along the gridlines to create galaxy borders around each center. There must be:
1. Exactly one galaxy center in each region created by the lines
2. Each galaxy center must be exactly in the center, both horizontally and vertically
3. Each galaxy region must be rotationally symmetric about 180 degrees

![Empty Puzzle (example):](/img/galaxy_unsolved.JPG.jpg "Unsolved Galaxy Puzzle 1")

![Correctly Solved Puzzle (example):](/img/galaxy_solved.JPG "Solved Galaxy Puzzle 1")

### Usage

The game can be run by running "npm-watchify-client" and navigating to the galaxy-client.html page. Lines can be added by clicking over the specific grid line, and can be removed in the same manner.

Correctness of the solution can be checked using the "Check Solved" button, which will textually display whether the solution is correct. No visual indication will be given for correct or incorrect lines placed on the board without hitting "Check Solved". 

### Notes

This game has not yet finished implementation. This is a personal project I worked on for a few weeks in the Summer of 2022 in my spare time. I focused on the tests, which have all been implemented, and then implemented a majority of the basic, crude functionality. Going forward, I hope to complete the few unimplemented functions, optimize test checks and check reps (by overriding the equality function for lines and centers), and improve the aesthetic of the client page. ### Galaxy Puzzle

