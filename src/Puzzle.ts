import assert from 'assert';

/**
 * A mutable Galaxies puzzle board.
 */
 export class Puzzle{
    private readonly size: number;
    private readonly centers: Array<{row: number, col: number}>;
    private readonly lines: Array<Array<{row: number, col: number}>>;
    private readonly solution: Array<Array<{row: number, col: number}>>;

    /**
     * Asserts that the coordinates of `coord` are integers between 0 and `size`, inclusive.
     *
     * @param coord The coordinates of a center or a line endpoint on the puzzle board
     * @param coord.row the row coordinate
     * @param coord.col the column coordinate
     * @param size positive integer representing the size of the puzzle board
     * @param center whether the coordinate is of a center or a line (if center, coordinates do not need to be integers,
     *               and centers cannot appear on the edges such that their coordinates fall equal to 0 or `size`. 
     */
    private assertCoords(coord: {row: number, col: number}, size: number, center=false): void {
        const [min, max] = !center ? [0, size]: [1, size-1];
        assert(min <= coord.row && coord.row <= max, `Expected 'row' coordinate to be between ${min} and ${max}, but got ${coord.row}`);
        assert(min <= coord.col && coord.col <= max, `Expected 'col' coordinate to be between ${min} and ${max}, but got ${coord.col}`);

        if (!center){
            assert(Math.floor(coord.row) === coord.row, `Expected 'row' coordinate to be an integer, but got ${coord.row}`);
            assert(Math.floor(coord.col) === coord.col, `Expected 'col' coordinate to be an integer, but got ${coord.col}`);
        }
    }

    private checkRep():void {
        // assert that `size` is valid
        assert(Math.floor(this.size) === this.size && this.size > 0,
                "Expected `size` to be a positive integer");

        // assert that galaxy center coordinates are between 0 and this.size-1
        for (const center of this.centers) {
            this.assertCoords(center, this.size, true);
        }

        // assert that line coordinates are integers between 1 and this.size
        for (const line of this.lines) {
            for (const coord of line) {
                this.assertCoords(coord, this.size);
            }
        }

        //assert that centers does not contain any duplictes
        assert.strictEqual(new Set(this.centers).size, this.centers.length,
                            "Expected centers to not have any duplicate entries");
    }

    /**
     * Creates a puzzleBoard according to the Puzzle representation. 
     *
     * @param size integer representing the size of the puzzle
     * @param centers List of coordinates of the galaxy centers in the given puzzle.
     *              Must satisfy:
     *              - `row` and `col` are integers such that 1 <= row,col <= size-1
     *              - `centers` has no duplicate entries
     * @param solution List of lists (lines) of the start and end coordinates of 
     *                 lines in the given puzzle. 
     *                 Must satisfy:
     *                 - `row` and `col` are integers such that 0 <= row,col <= size
     *                 - lines are given left to right when horizontal, top to bottom when vertical
     */
    public constructor(size: number,
                       centers: Array<{row: number, col: number}>,
                       solution: Array<Array<{row: number, col: number}>>) {
        this.size = size;

        this.lines = []; 

        this.solution = [];
        for (const line of solution) {
            const componentLines: Array<Array<{row: number, col: number}>> = [];
            assert(line[0]);
            assert(line[1]);

            const start: {row:number, col:number} = line[0];
            const end: {row:number, col:number} = line[1];
            assert((start.row !== end.row) || (start.col !== end.col)); // Line should only be changing in one dimension and should not have length 0
            if (start.row !== end.row){
                for (let i=0; i<(end.row-start.row); i++){ 
                    componentLines.push([{row:start.row+i, col:start.col}, {row:start.row+i+1, col:end.col}]); // Note start.col === end.col
                }
            }else if (start.col !== end.col){
                for (let i=0; i<(end.col-start.col); i++){ 
                    componentLines.push([{row:start.row, col:start.col+i}, {row:end.row, col:start.col+i+1}]); // Note start.row === end.row
                }
            }

            this.solution.concat(componentLines);
        }

        this.centers = [];
        for (const coord of centers) {
            this.centers.push({row: coord.row, col: coord.col});
        }

        this.checkRep();
    }

    /**
     * Asserts whether the configuration of the lines on the board represents the
     * solution. Note that for each galaxy puzzle there is only one unique solution
     * (given by puzzle creator). 
     *
     * @returns true if the Puzzle is fully solved and false otherwise
     */
    public isSolved(): boolean {
        assert(this.lines.length === this.solution.length);
        var count = 0;

        for (const line of this.lines){ // Note: will return during edit to optimize checker
            for (const solLine of this.solution){
                if ((line[0] === solLine[0]) && (line[1] === solLine[1])){
                    count++;
                    continue;
                }
            }
        }

        if (count === this.solution.length){
            return true;
        }
        return false;
    }


    /**
     * Gets the size of the puzzle
     *
     * @returns the size of the puzzle
     */
    public getSize(): number {
        return this.size;
    }

    /**
     * Get the lines of the puzzle.
     *
     * @returns the lines of the puzzle (copied for safety). 
     */
    public getLines(): Array<Array<{row: number, col: number}>> {
        const lines = [];
        for (const line of this.lines){
            assert(line[0]);
            assert(line[1]);
            lines.push([{row:line[0].row, col:line[0].col}, {row:line[1].row, col:line[1].col}]);
        }
        return lines;
    }

    /**
     * Get the galaxy centers of the puzzle.
     *
     * @returns the centers of the puzzle (copied for safety). 
     */
     public getCenters(): Array<{row: number, col: number}> {
        const centers = [];
        for (const center of this.centers){
            centers.push({row:center.row, col:center.col});
        }
        return centers;
    }

    /**
     * Get a string that can be parsed to return a blank puzzle that has the centers
     * as this puzzle. 
     *
     * @returns a string representation of a blank puzzle
     */
     public getBlankPuzzleString(): string {
        // TODO
        throw new Error("Not Implemented Yet");
    }
 }