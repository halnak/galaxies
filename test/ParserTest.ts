import assert from 'assert';
import { parsePuzzle } from '../src/Parser';
import { Puzzle } from '../src/Puzzle';
import fs from 'fs';

describe('parser', function() {

    // Testing Strategy:
    //      Partition on read origin: from file, from string

    const correctCenters = [
    {row: 1, col: 0.5},
    {row: 1, col: 4},
    {row: 1, col: 6},
    {row: 2, col: 2.5},
    {row: 2.5, col: 4},
    {row: 4, col: 1},
    {row: 3, col: 6},
    {row: 4, col: 4},
    {row: 4.5, col: 6},
    {row: 5.5, col: 2},
    {row: 5.5, col: 6},
    {row: 6, col: 4},
    {row: 6.5, col: 0.5},
    {row: 6.5, col: 6}
    ];

    /**
     * Asserts that `puzzle` has size `size`.
     *
     * @param puzzle the queried Puzzle object
     * @param correctSize the expected size of the puzzle, must be a positive integer
     */
     function assertPuzzleSize(puzzle: Puzzle, correctSize: number): void {
        assert.strictEqual(puzzle.getSize(), correctSize, "Expected puzzle to have the correct size");
    };

    /**
     * Asserts that `puzzle` has the same galaxy centers as `correctCenters`.
     *
     * @param puzzle the queried Puzzle object
     * @param correctCenters a list containing the correct regions
     */
     function assertPuzzleCenters(puzzle: Puzzle, correctSize: number, correctCenters: Array<{row: number, col: number}>): void {
        const size = puzzle.getSize();
        assert.strictEqual(size, correctSize, "Expected puzzle to have correct size");
        const returnedCenters = puzzle.getCenters();
        assert.strictEqual(returnedCenters.length, correctCenters.length,
                            "Expected puzzle to have the correct number of galaxy centers");
        var count = 0;
        for (const c of returnedCenters){ 
            for (const corrC of correctCenters){
                if ((c.row === corrC.row) && (c.col === corrC.col)){
                    count++;
                    continue;
                }
            }
        }
        assert.strictEqual(correctCenters.length, count, `Expected puzzle to have the correct centers`);
    }

    it("blank puzzle, string read from file", function() {
        const stringFromFile = fs.readFileSync('././puzzles/ga-1-1-1-blank', { encoding: 'utf-8' });
        const puzzleFromFile = parsePuzzle(stringFromFile);
        assertPuzzleSize(puzzleFromFile, 7);
        assertPuzzleCenters(puzzleFromFile, 7, correctCenters);
    });

    it("blank puzzle, hard-coded input string", function() {
        const inputString = `7x7
        1,0.5   | [(0,1) (2,1)] + [(2,0) (2,1)]
        1,4     | [(0,3) (2,3)] [(0,5) (2,5)] + [(2,3) (2,5)]
        1,6     | [(0,5) (2,5)] + [(2,5) (2,7)]
        2,2.5   | [(0,3) (4,3)] [(0,4) (4,4)] + [(4,2) (4,3)]
        2.5,4   | [(2,3) (3,3)] [(2,5) (3,5)] + [(2,3) (2,5)] [(3,3) (3,5)]
        3,1     | [(0,1) (2,1)] [(4,1) (6,1)] + [(2,0) (2,1)] [(4,1) (4,2)]
        3,6     | [(2,5) (4,5)] + [(2,5) (2,7)] [(4,5) (4,7)]
        4,4     | [(3,3) (5,3)] [(3,5) (5,5)] + [(3,3) (3,5)] [(5,3) (5,5)]
        4.5,6   | [(4,5) (5,5)] + [(4,5) (4,7)] [(5,5) (5,7)]
        5.5,2   | [(4,1) (7,1)] [(4,3) (7,3)] + [(4,1) (4,3)]
        5.5,6   | [(5,5) (6,5)] + [(5,5) (5,7)] [(6,5) (6,7)]
        6,4     | [(5,3) (7,3)] [(5,5) (7,5)] + [(5,3) (5,5)]
        6.5,0.5 | [(6,1) (7,1)] + [(6,0) (6,1)]
        6.5,6   | [(6,5) (7,5)] + [(6,5) (6,7)]
        `;
        const puzzleFromString = parsePuzzle(inputString);
        assertPuzzleSize(puzzleFromString, 7);
        assertPuzzleCenters(puzzleFromString, 7, correctCenters);
    });
});