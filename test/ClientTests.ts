import assert from 'assert';
import { Client } from '../src/GalaxyClient';

describe('client', function() {
    // Testing Strategy: 
    //  client creation (constructor()):
    //      Partition on puzzle string input: 
    //          - invalid puzzle to parse
    //          - valid puzzle to parse
    //  hasLine(), addLine(), removeLine():
    //      Partition on grid line: 
    //          - line was not set
    //          - line was set
    //  checkSolved():
    //      Partition on puzzle state: 
    //          - client's puzzle empty
    //          - client's puzzle unsolved (>0 lines but no lines in correct positions)
    //          - client's puzzle partially solved (>=1 line in correct position)
    //          - client's puzzle fully solved (all lines in correct positions with no extra lines)
    //  getPuzzle():
    //      Partition on client's puzzle state: 
    //          - client's puzzle empty
    //          - client's puzzle unsolved (>0 lines but no lines in correct positions)
    //          - client's puzzle partially solved (>=1 line in correct position)
    //          - client's puzzle fully solved (all lines in correct positions with no extra lines)
    //  HTML Page, displayPuzzle() (manual):
    //      Partition on canvas click: 
    //          - grid line was empty
    //          - grid line had a line placed on it
    //      Partition on puzzle progress and checkSolved button: 
    //          - client's puzzle empty
    //          - client's puzzle unsolved (>0 lines but no lines in correct positions)
    //          - client's puzzle partially solved (>=1 line in correct position)
    //          - client's puzzle fully solved (all lines in correct positions with no extra lines)

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

    it('Constructing invalid puzzle', function() {
        const nonIntString = `7x7
        1,0.5   | [(0,1.5) (2,1)] + [(2,0) (2,1)]
        1,4     | [(0,3) (2,3)] [(0,5) (2,5)] + [(2,3) (2,5)]
        1,6     | [(0,5) (2,5)] + [(2,5) (2,7)]
        2,2.5   | [(0,3) (4,3)] [(0,4) (4,4)] + [(4,2) (4,3)]
        2.5,4   | [(2,3) (3,3)] [(2,5) (3,5)] + [(2,3) (2,5)] [(3,3) (3,5)]
        3,1     | [(0,1) (2,1)] [(4,1) (6,1)] + [(2,0) (2,1)] [(4,1) (4,2)]
        3,6     | [(2,5) (4,5)] + [(2,5.5) (2,7)] [(4,5) (4,7)]
        4,4     | [(3,3) (5,3)] [(3,5) (5,5)] + [(3,3) (3,5)] [(5,3) (5,5)]
        4.5,6   | [(4,5) (5,5)] + [(4,5) (4,7)] [(5,5) (5,7)]
        5.5,2   | [(4,1) (7,1.5)] [(4,3) (7,3)] + [(4,1) (4,3)]
        5.5,6   | [(5,5) (6,5)] + [(5,5) (5,7)] [(6,5) (6,7)]
        6,4     | [(5,3) (7,3)] [(5,5) (7,5)] + [(5,3) (5,5)]
        6.5,0.5 | [(6,1) (7,1)] + [(6,0) (6,1)]
        6.5,6   | [(6,5) (7,5)] + [(6,5) (6,7)]
        `; // Invalid for having non-integer line coordinates

        const centerString = `7x7
        0,0.5   | [(0,1) (2,1)] + [(2,0) (2,1)]
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
        6.5,7   | [(6,5) (7,5)] + [(6,5) (6,7)]
        `; // Invalid for having 0 and gridSize center coordinates

        try{
            const nonIntClient = new Client(nonIntString);
            const centerClient = new Client(centerString);
            assert(false, 'Client should not be constructed from invalid puzzle');
        }catch{
            assert(true);
        }
        return;
    });

    it('Constructing valid puzzle', function() {
        const client = new Client(inputString);
        try{
            const client = new Client(inputString);
        }catch{
            assert(false, 'Client should be constructed from valid puzzle');
        }
        return;
    });

    it('Adding and removing a line', function() {
        const client = new Client(inputString);
        client.addLine({row: 1, col: 2}, {row: 1, col: 3});
        assert(client.hasLine({row: 1, col: 2}, {row: 1, col: 3}), 'Line added to grid should be detected');
        client.removeLine({row: 1, col: 2}, {row: 1, col: 3});
        assert(!client.hasLine({row: 1, col: 2}, {row: 1, col: 3}), 'Removed line should not be detected as a line');
        assert(!client.hasLine({row: 3, col: 3}, {row: 3, col: 4}), 'Empty line should not be detected as a line');
        return;
    });
    
    it('Adding and removing an invalid line', function() {
        const client = new Client(inputString);
        client.addLine({row: 1, col: 2.5}, {row: 1, col: 3.5}); // non-integer coordinates
        assert(!client.hasLine({row: 1, col: 2.5}, {row: 1, col: 3.5}), 'Invalid line should not be detected in puzzle');
        client.removeLine({row: 1, col: 2.5}, {row: 1, col: 3.5});
        assert(!client.hasLine({row: 1, col: 2.5}, {row: 1, col: 3.5}), 'No action should be taken on a non-existant line');

        client.addLine({row: 1, col: 2}, {row: 1, col: 4}); // length > 1
        assert(!client.hasLine({row: 1, col: 2}, {row: 1, col: 4}), 'Invalid line should not be detected in puzzle');
        client.removeLine({row: 1, col: 2}, {row: 1, col: 4});
        assert(!client.hasLine({row: 1, col: 2}, {row: 1, col: 4}), 'No action should be taken on a non-existant line');
        return;
    });

    it('Covers checking an empty puzzle', function() {
        const client = new Client(inputString);
        assert(!client.checkSolved(), 'Empty puzzle should not be solved');

        const puzzle = client.getPuzzle();
        assert(!puzzle.isSolved(), 'Client getPuzzle should have same state of solved as client checkSolved');
        return;
    });

    it('Covers checking a partially filled, all incorrect puzzle', function() {
        const client = new Client(inputString);
        client.addLine({row: 1, col: 2}, {row: 1, col: 3});
        client.addLine({row: 2, col: 2}, {row: 2, col: 3});
        assert(!client.checkSolved(), 'Partially filled puzzle should not be solved');

        const puzzle = client.getPuzzle();
        assert(!puzzle.isSolved(), 'Client getPuzzle should have same state of solved as client checkSolved for incorrect puzzle');
        return;
    });

    it('Covers a partially correct, fully filled puzzle', function() {
        const client = new Client(inputString);
        client.addLine({row: 0, col: 1}, {row: 1, col: 1});
        client.addLine({row: 2, col: 5}, {row: 3, col: 5});
        assert(!client.checkSolved(), 'Fully filled incorrect puzzle should be solved');

        const puzzle = client.getPuzzle();
        assert(!puzzle.isSolved(), 'Client getPuzzle should have same state of solved as client checkSolved for partially correct puzzle');
        return;
    });

    it('Covers checking a correctly filled puzzle', function() {
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

        assert(client.checkSolved(), 'Correctly filled puzzle should be solved');

        const puzzle = client.getPuzzle();
        assert(puzzle.isSolved(), 'Client getPuzzle should have same state of solved as client checkSolved for solved puzzle');
        return;
    });

    it('Manual viewing test: covers adding a line and removing the same line via clicks', function() {
        // 1. Run "npm run watchify-client" (for PUZZLE: ga-1-1-1)
        // 2. Navigate to "galaxy-client.html"
        // 3. Verify that the puzzle displays empty, with regions matching ga-1-1-1 on the example page
        // 4. Click line [(1,2) (1,3)]
        // 5. Visually verify that a line was added
        // 6. Click line [(1,2) (1,3)]
        // 7. Visually verify that a line was removed
    });

    it('Manual viewing test: covers checking solves on an empty puzzle', function() {
        // 1. Run "npm run watchify-client" (for PUZZLE: ga-1-1-1)
        // 2. Navigate to "galaxy-client.html"
        // 3. Verify that the puzzle displays empty, with galaxy centers matching on krazydad.com Book 1 Volume 1 Puzzle 1
        // 4. Click the "Check Solved" button (empty puzzle)
        // 5. Visually verify that the puzzle does not indicate fully solved
    });

    it('Manual viewing test: covers checking solved on a partially solved puzzle', function() {
        // 1. Run "npm run watchify-client" (for PUZZLE: ga-1-1-1)
        // 2. Navigate to "galaxy-client.html"
        // 3. Verify that the puzzle displays empty, with regions matching kd-1-1-1 on the example page
        // 4. Using the click method, add stars to [(0,1) (1,1)], [(1,1) (2,1)] (Partially solved)
        // 5. Click the "Check Solved" button
        // 6. Visually verify that the puzzle does not indicate fully solved
    });

    it('Manual viewing test: covers checking solved on a fully solved puzzle', function() {
        // 1. Run "npm run watchify-client" (for PUZZLE: ga-1-1-1)
        // 2. Navigate to "galaxy-client.html"
        // 3. Verify that the puzzle displays empty, with galaxy centers matching on krazydad.com Book 1 Volume 1 Puzzle 1
        // 4. Using the click method, add lines to match the solution for Book 1 Volume 1 Puzzle 1
        //         [(0,1) (1,1)],[(1,1) (2,1)],[(2,0) (2,1)],[(0,3) (1,3)],[(1,3) (2,3)],[(0,5) (1,5)],[(1,5) (2,5)],[(2,3) (2,4)],
        //         [(2,4) (2,5)],[(2,5) (2,6)],[(2,6) (2,7)],[(2,3) (3,3)],[(3,3) (4,3)],[(0,4) (1,4)],[(1,4) (2,4)],[(2,4) (3,4)],
        //         [(3,4) (4,4)],[(4,2) (4,3)],[(2,5) (3,5)],[(3,3) (3,4)],[(3,4) (3,5)],[(4,1) (5,1)],[(5,1) (6,1)],[(4,1) (4,2)],
        //         [(3,5) (4,5)],[(4,5) (4,6)],[(4,6) (4,7)],[(4,3) (5,3)],[(3,5) (4,5)],[(4,5) (5,5)],[(5,3) (5,4)],[(5,4) (5,5)],
        //         [(4,5) (4,6)],[(4,6) (4,7)],[(5,5) (5,6)],[(5,6) (5,7)],[(4,1) (5,1)],[(5,1) (6,1)],[(6,1) (7,1)],[(4,3) (5,3)],
        //         [(5,3) (6,3)],[(6,3) (7,3)],[(5,5) (6,5)],[(6,5) (6,6)],[(6,6) (6,7)],[(6,1) (7,1)],[(6,0) (6,1)],[(6,5) (7,5)]
        //         (fully solved)
        // 5. Click the "Check Solved" button
        // 6. Visually verify that the puzzle indicates fully solved
    });
});