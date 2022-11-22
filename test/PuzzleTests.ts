import assert from 'assert';
import {Puzzle} from '../src/Puzzle';
import {parsePuzzle} from '../src/Parser';
import { Client } from '../src/GalaxyClient';

/**
 * Test suite for the Puzzle ADT
 */
describe('PuzzleADT', function() {
    /**
     * Testing strategy:
     *
     * getSize(), getLines(), getCenters(), getBlankPuzzleSrtring():
     *    Note puzzle can only be modified by the client. Puzzle always instantiated as empty. 
     *    Partition on state of the puzzle:
     *      - is blank
     *      - is solved correctly
     *      - is partially solved
     *      - is incorrectly solved (any combination of lines with length > 1 which includes 
     *          lines that are not a part of the solution)
     */

     const SIZE = 7;

     const CENTERS = [
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

    const LINES = [
        [{row: 0, col: 1}, {row: 1, col: 1}],
        [{row: 1, col: 1}, {row: 2, col: 1}],
        [{row: 2, col: 0}, {row: 2, col: 1}],
        [{row: 0, col: 3}, {row: 1, col: 3}],
        [{row: 1, col: 3}, {row: 2, col: 3}],
        [{row: 0, col: 5}, {row: 1, col: 5}],
        [{row: 1, col: 5}, {row: 2, col: 5}],
        [{row: 2, col: 3}, {row: 2, col: 4}],
        [{row: 2, col: 4}, {row: 2, col: 5}],
        [{row: 2, col: 5}, {row: 2, col: 6}],
        [{row: 2, col: 6}, {row: 2, col: 7}],
        [{row: 2, col: 3}, {row: 3, col: 3}],
        [{row: 3, col: 3}, {row: 4, col: 3}],
        [{row: 0, col: 4}, {row: 1, col: 4}],
        [{row: 1, col: 4}, {row: 2, col: 4}],
        [{row: 2, col: 4}, {row: 3, col: 4}],
        [{row: 3, col: 4}, {row: 4, col: 4}],
        [{row: 4, col: 2}, {row: 4, col: 3}],
        [{row: 2, col: 5}, {row: 3, col: 5}],
        [{row: 3, col: 3}, {row: 3, col: 4}],
        [{row: 3, col: 4}, {row: 3, col: 5}],
        [{row: 4, col: 1}, {row: 5, col: 1}],
        [{row: 5, col: 1}, {row: 6, col: 1}],
        [{row: 4, col: 1}, {row: 4, col: 2}],
        [{row: 3, col: 5}, {row: 4, col: 5}],
        [{row: 4, col: 5}, {row: 4, col: 6}],
        [{row: 4, col: 6}, {row: 4, col: 7}],
        [{row: 4, col: 3}, {row: 5, col: 3}],
        [{row: 3, col: 5}, {row: 4, col: 5}],
        [{row: 4, col: 5}, {row: 5, col: 5}],
        [{row: 5, col: 3}, {row: 5, col: 4}],
        [{row: 5, col: 4}, {row: 5, col: 5}],
        [{row: 4, col: 5}, {row: 4, col: 6}],
        [{row: 4, col: 6}, {row: 4, col: 7}],
        [{row: 5, col: 5}, {row: 5, col: 6}],
        [{row: 5, col: 6}, {row: 5, col: 7}],
        [{row: 4, col: 1}, {row: 5, col: 1}],
        [{row: 5, col: 1}, {row: 6, col: 1}],
        [{row: 6, col: 1}, {row: 7, col: 1}],
        [{row: 4, col: 3}, {row: 5, col: 3}],
        [{row: 5, col: 3}, {row: 6, col: 3}],
        [{row: 6, col: 3}, {row: 7, col: 3}],
        [{row: 5, col: 5}, {row: 6, col: 5}],
        [{row: 6, col: 5}, {row: 6, col: 6}],
        [{row: 6, col: 6}, {row: 6, col: 7}],
        [{row: 6, col: 1}, {row: 7, col: 1}],
        [{row: 6, col: 0}, {row: 6, col: 1}],
        [{row: 6, col: 5}, {row: 7, col: 5}],
    ];

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

    /**
     * Asserts that calling puzzle.getSize() returns the expected results.
     *
     * @param puzzle a Puzzle object
     * @param correctSize the expected result of calling getSize() on `puzzle`
     */
    function assertGetSize(puzzle: Puzzle, correctSize: number): void {
        assert.strictEqual(puzzle.getSize(), correctSize, "Expected puzzle to have the correct size");
    };

    /**
     * Asserts that calling puzzle.getLines() returns the expected result.
     *
     * @param puzzle a Puzzle object
     * @param correctLines a representation of the expected lines returned by getLines()
     */
    function assertGetLines(puzzle: Puzzle, correctLines: Array<Array<{row: number, col: number}>>): void {
        const size = correctLines.length;
        const returnedLines = puzzle.getLines();
        assert.strictEqual(returnedLines.length, size,
                            "Expected getLines() to return the correct number of lines");
        var count = 0;
        for (const line of returnedLines){ 
            for (const corrLine of correctLines){
                if ((line[0] === corrLine[0]) && (line[1] === corrLine[1])){
                    count++;
                    continue;
                }
            }
        }
        assert(count === size);
    }

    /**
     * Asserts that calling puzzle.getCenters() returns the expected results
     *
     * @param puzzle a Puzzle object
     * @param correctStars a list of the centers expected to be returned by getCenters()
     */
    function assertGetCenters(puzzle: Puzzle, correctCenters: Array<{row: number, col: number}>): void {
        const returnedCenters = puzzle.getCenters();
        assert.deepStrictEqual(new Set(returnedCenters), new Set(correctCenters),
            "Expected getCenters() to return the correct centers");
    }

    it("getCenters(), getLines(); blank puzzle", function() {
        const puzzle = new Puzzle(SIZE, CENTERS, LINES); // note that lines are the solution

        assert.strictEqual(puzzle.getCenters(), CENTERS, "Expected centers to match input");
        assert.strictEqual(puzzle.getLines(), [], "Expected lines to match empty input"); 
    });

    /**
     * Asserts that the getter methods of the puzzle return the expected results.
     *
     * @param puzzle the queried puzzle
     * @param correctSize the expected size
     * @param correctLines a list of the expected lines
     * @param correctCenters a list of the expected centers
     * @throws AssertionError if any of the getter methods does not return the expected results
     */
    function assertGettersOfPuzzle(puzzle: Puzzle,
                                   correctSize: number,
                                   correctLines: Array<Array<{row: number, col: number}>>,
                                   correctCenters: Array<{row: number, col: number}>): void {

        assertGetSize(puzzle, correctSize);
        assertGetLines(puzzle, correctLines);
        assertGetCenters(puzzle, correctCenters);
    }

    it("getter methods and isSolved(); blank puzzle", function() {
        const puzzle = new Puzzle(SIZE, CENTERS, LINES);

        assertGettersOfPuzzle(puzzle, SIZE, [], CENTERS);
        assert(!puzzle.isSolved(), 'Empty puzzle should not be solved');
    });

    it("getter methods and isSolved(); correctly solved puzzle", function() {
        const puzzle = new Puzzle(SIZE, CENTERS, LINES);
        const client = new Client(inputString);

        client.addLine({row: 0, col: 1}, {row: 1, col: 1});
        client.addLine({row: 1, col: 1}, {row: 2, col: 1});
        client.addLine({row: 2, col: 0}, {row: 2, col: 1});
        client.addLine({row: 0, col: 3}, {row: 1, col: 3});
        client.addLine({row: 1, col: 3}, {row: 2, col: 3});
        client.addLine({row: 0, col: 5}, {row: 1, col: 5});
        client.addLine({row: 1, col: 5}, {row: 2, col: 5});
        client.addLine({row: 2, col: 3}, {row: 2, col: 4});
        client.addLine({row: 2, col: 4}, {row: 2, col: 5});
        client.addLine({row: 2, col: 5}, {row: 2, col: 6});
        client.addLine({row: 2, col: 6}, {row: 2, col: 7});
        client.addLine({row: 2, col: 3}, {row: 3, col: 3});
        client.addLine({row: 3, col: 3}, {row: 4, col: 3});
        client.addLine({row: 0, col: 4}, {row: 1, col: 4});
        client.addLine({row: 1, col: 4}, {row: 2, col: 4});
        client.addLine({row: 2, col: 4}, {row: 3, col: 4});
        client.addLine({row: 3, col: 4}, {row: 4, col: 4});
        client.addLine({row: 4, col: 2}, {row: 4, col: 3});
        client.addLine({row: 2, col: 5}, {row: 3, col: 5});
        client.addLine({row: 3, col: 3}, {row: 3, col: 4});
        client.addLine({row: 3, col: 4}, {row: 3, col: 5});
        client.addLine({row: 4, col: 1}, {row: 5, col: 1});
        client.addLine({row: 5, col: 1}, {row: 6, col: 1});
        client.addLine({row: 4, col: 1}, {row: 4, col: 2});
        client.addLine({row: 3, col: 5}, {row: 4, col: 5});
        client.addLine({row: 4, col: 5}, {row: 4, col: 6});
        client.addLine({row: 4, col: 6}, {row: 4, col: 7});
        client.addLine({row: 4, col: 3}, {row: 5, col: 3});
        client.addLine({row: 3, col: 5}, {row: 4, col: 5});
        client.addLine({row: 4, col: 5}, {row: 5, col: 5});
        client.addLine({row: 5, col: 3}, {row: 5, col: 4});
        client.addLine({row: 5, col: 4}, {row: 5, col: 5});
        client.addLine({row: 4, col: 5}, {row: 4, col: 6});
        client.addLine({row: 4, col: 6}, {row: 4, col: 7});
        client.addLine({row: 5, col: 5}, {row: 5, col: 6});
        client.addLine({row: 5, col: 6}, {row: 5, col: 7});
        client.addLine({row: 4, col: 1}, {row: 5, col: 1});
        client.addLine({row: 5, col: 1}, {row: 6, col: 1});
        client.addLine({row: 6, col: 1}, {row: 7, col: 1});
        client.addLine({row: 4, col: 3}, {row: 5, col: 3});
        client.addLine({row: 5, col: 3}, {row: 6, col: 3});
        client.addLine({row: 6, col: 3}, {row: 7, col: 3});
        client.addLine({row: 5, col: 5}, {row: 6, col: 5});
        client.addLine({row: 6, col: 5}, {row: 6, col: 6});
        client.addLine({row: 6, col: 6}, {row: 6, col: 7});
        client.addLine({row: 6, col: 1}, {row: 7, col: 1});
        client.addLine({row: 6, col: 0}, {row: 6, col: 1});
        client.addLine({row: 6, col: 5}, {row: 7, col: 5});

        assertGettersOfPuzzle(puzzle, SIZE, LINES, CENTERS);
        assert(puzzle.isSolved(), 'Correctly solved puzzle should be solved');
    });

    it("getter methods and isSolved(); partially solved puzzle", function() {
        const partialLines = [
            [{row: 0, col: 1}, {row: 1, col: 1}],
            [{row: 1, col: 1}, {row: 2, col: 1}],
            [{row: 2, col: 0}, {row: 2, col: 1}],
        ]
        const puzzle = new Puzzle(SIZE, CENTERS, LINES);
        const client = new Client(inputString);

        client.addLine({row: 0, col: 1}, {row: 1, col: 1});
        client.addLine({row: 1, col: 1}, {row: 2, col: 1});
        client.addLine({row: 2, col: 0}, {row: 2, col: 1});

        assertGettersOfPuzzle(puzzle, SIZE, partialLines, CENTERS);
        assert(!puzzle.isSolved(), 'Partially solved puzzle should not be solved');
    });

    it("getter methods and isSolved(); incorrectly solved", function() {
        const partialLines = [ //incorrect lines
            [{row: 0, col: 2}, {row: 1, col: 2}],
            [{row: 6, col: 6}, {row: 7, col: 6}]
        ]
        const puzzle = new Puzzle(SIZE, CENTERS, LINES);
        const client = new Client(inputString);

        client.addLine({row: 0, col: 2}, {row: 1, col: 2});
        client.addLine({row: 6, col: 6}, {row: 7, col: 6});

        assertGettersOfPuzzle(puzzle, SIZE, partialLines, CENTERS);
        assert(!puzzle.isSolved(), 'Incorrectly solved puzzle should not be solved');
    });

    it("getBlankPuzzleString(); blank puzzle", function() {
        const puzzle = new Puzzle(SIZE, CENTERS, LINES);
        const blankString = puzzle.getBlankPuzzleString();
        const blankPuzzle = parsePuzzle(blankString);

        assertGettersOfPuzzle(blankPuzzle, SIZE, [], CENTERS);
    });

    it("getBlankPuzzleString(); solved puzzle", function() {
        const puzzle = new Puzzle(SIZE, CENTERS, LINES);
        const client = new Client(inputString);

        client.addLine({row: 0, col: 1}, {row: 1, col: 1});
        client.addLine({row: 1, col: 1}, {row: 2, col: 1});
        client.addLine({row: 2, col: 0}, {row: 2, col: 1});
        client.addLine({row: 0, col: 3}, {row: 1, col: 3});
        client.addLine({row: 1, col: 3}, {row: 2, col: 3});
        client.addLine({row: 0, col: 5}, {row: 1, col: 5});
        client.addLine({row: 1, col: 5}, {row: 2, col: 5});
        client.addLine({row: 2, col: 3}, {row: 2, col: 4});
        client.addLine({row: 2, col: 4}, {row: 2, col: 5});
        client.addLine({row: 2, col: 5}, {row: 2, col: 6});
        client.addLine({row: 2, col: 6}, {row: 2, col: 7});
        client.addLine({row: 2, col: 3}, {row: 3, col: 3});
        client.addLine({row: 3, col: 3}, {row: 4, col: 3});
        client.addLine({row: 0, col: 4}, {row: 1, col: 4});
        client.addLine({row: 1, col: 4}, {row: 2, col: 4});
        client.addLine({row: 2, col: 4}, {row: 3, col: 4});
        client.addLine({row: 3, col: 4}, {row: 4, col: 4});
        client.addLine({row: 4, col: 2}, {row: 4, col: 3});
        client.addLine({row: 2, col: 5}, {row: 3, col: 5});
        client.addLine({row: 3, col: 3}, {row: 3, col: 4});
        client.addLine({row: 3, col: 4}, {row: 3, col: 5});
        client.addLine({row: 4, col: 1}, {row: 5, col: 1});
        client.addLine({row: 5, col: 1}, {row: 6, col: 1});
        client.addLine({row: 4, col: 1}, {row: 4, col: 2});
        client.addLine({row: 3, col: 5}, {row: 4, col: 5});
        client.addLine({row: 4, col: 5}, {row: 4, col: 6});
        client.addLine({row: 4, col: 6}, {row: 4, col: 7});
        client.addLine({row: 4, col: 3}, {row: 5, col: 3});
        client.addLine({row: 3, col: 5}, {row: 4, col: 5});
        client.addLine({row: 4, col: 5}, {row: 5, col: 5});
        client.addLine({row: 5, col: 3}, {row: 5, col: 4});
        client.addLine({row: 5, col: 4}, {row: 5, col: 5});
        client.addLine({row: 4, col: 5}, {row: 4, col: 6});
        client.addLine({row: 4, col: 6}, {row: 4, col: 7});
        client.addLine({row: 5, col: 5}, {row: 5, col: 6});
        client.addLine({row: 5, col: 6}, {row: 5, col: 7});
        client.addLine({row: 4, col: 1}, {row: 5, col: 1});
        client.addLine({row: 5, col: 1}, {row: 6, col: 1});
        client.addLine({row: 6, col: 1}, {row: 7, col: 1});
        client.addLine({row: 4, col: 3}, {row: 5, col: 3});
        client.addLine({row: 5, col: 3}, {row: 6, col: 3});
        client.addLine({row: 6, col: 3}, {row: 7, col: 3});
        client.addLine({row: 5, col: 5}, {row: 6, col: 5});
        client.addLine({row: 6, col: 5}, {row: 6, col: 6});
        client.addLine({row: 6, col: 6}, {row: 6, col: 7});
        client.addLine({row: 6, col: 1}, {row: 7, col: 1});
        client.addLine({row: 6, col: 0}, {row: 6, col: 1});
        client.addLine({row: 6, col: 5}, {row: 7, col: 5});

        const blankString = puzzle.getBlankPuzzleString();
        const blankPuzzle = parsePuzzle(blankString);

        assertGettersOfPuzzle(blankPuzzle, SIZE, [], CENTERS);
    });

    it("getBlankPuzzleString(); partially solved puzzle", function() {
        const partialLines = [
            [{row: 0, col: 1}, {row: 1, col: 1}],
            [{row: 1, col: 1}, {row: 2, col: 1}],
            [{row: 2, col: 0}, {row: 2, col: 1}],
        ]
        const puzzle = new Puzzle(SIZE, CENTERS, LINES);
        const client = new Client(inputString);

        client.addLine({row: 0, col: 1}, {row: 1, col: 1});
        client.addLine({row: 1, col: 1}, {row: 2, col: 1});
        client.addLine({row: 2, col: 0}, {row: 2, col: 1});

        const blankString = puzzle.getBlankPuzzleString();
        const blankPuzzle = parsePuzzle(blankString);

        assertGettersOfPuzzle(blankPuzzle, SIZE, [], CENTERS);
    });

    it("getBlankPuzzleString(); invalid puzzle", function() {
        const partialLines = [ //incorrect lines
            [{row: 0, col: 2}, {row: 1, col: 2}],
            [{row: 6, col: 6}, {row: 7, col: 6}]
        ]
        const puzzle = new Puzzle(SIZE, CENTERS, LINES);
        const client = new Client(inputString);

        client.addLine({row: 0, col: 2}, {row: 1, col: 2});
        client.addLine({row: 6, col: 6}, {row: 7, col: 6});

        const blankString = puzzle.getBlankPuzzleString();
        const blankPuzzle = parsePuzzle(blankString);

        assertGettersOfPuzzle(blankPuzzle, SIZE, [], CENTERS);
    });
});