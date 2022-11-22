import assert from 'assert';

// Categorical colors from
// https://github.com/d3/d3-scale-chromatic/tree/v2.0.0#schemeCategory10
const COLORS: Array<string> = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
];

// semitransparent versions of those colors
const BACKGROUNDS = COLORS.map( (color) => color + '60' );

/**
 * On an empty canvas, draw the nxn empty puzzle grid. 
 * 
 * @param canvas the canvas element on which to draw the empty puzzle grid
 * @param gridSize grid size (number of both rows and columns), must be >0
 */
 export function drawEmptyPuzzle(canvas: HTMLCanvasElement, gridSize: number):void {
    const context = canvas.getContext('2d');
    assert(context, 'unable to get canvas drawing context');
    assert(gridSize > 0, 'size of puzzle must be greater than 0');

    //linestyles
    context.strokeStyle = 'black';
    context.lineWidth = 0.5; 

    // draw horizontal lines
    context.beginPath();
    for (let i = 1; i < gridSize; i++) {
        const y = Math.floor(i/gridSize*canvas.height);
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
    }

    //draw vertical lines
    for (let i = 1; i < gridSize; i++) {
        const x = Math.floor(i/gridSize*canvas.width);
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
    }

    context.closePath();
    context.stroke();
    context.restore();
}

/**
 * Draw in the lines that have been placed on the grid. 
 * 
 * @param canvas the canvas element
 * @param gridSize grid size (number of both rows and columns), must be >0
 * @param lines the array of lines determined by their starting and ending points
 */
export function drawLines(canvas: HTMLCanvasElement, gridSize: number, lines: Array<Array<{row: number, col: number}>>): void{
    throw new Error('Not implemented yet');
}

/**
 * Draw the galaxy centers for this puzzle on the canvas grid. 
 * 
 * @param canvas the canvas element on which to draw the galaxy centers
 * @param gridSize grid size (number of both rows and columns), must be >0
 * @param centers the array of location of galaxy centers on the grid
 */

export function drawCenters(canvas: HTMLCanvasElement, gridSize: number, centers: Array<{row: number, col: number}>): void{
    const context = canvas.getContext('2d');
    assert(context, 'unable to get canvas drawing context');
    assert(gridSize > 0, 'size of puzzle must be greater than 0');

    const length = canvas.width/gridSize;
    //draw every center at its given location
    for (const center of centers){
        context.save();
        context.arc(center.row, center.col, length/4, 0, 2*Math.PI);
        context.restore();
    }
}

/**
 * Draw an entire puzzle given the size of the grid, lines, and galaxy centers on an empty canvas
 * 
 * @param canvas the canvas element on which to draw the entire puzzle
 * @param gridSize grid size (number of both rows and columns), must be >0
 * @param lines the array of lines with their given locations on the grid (by starting and ending point)
 * @param centers the array of location of galaxy centers on the grid
 */
export function drawEverything(canvas: HTMLCanvasElement, gridSize: number, lines: Array<Array<{row: number, col: number}>>, centers: Array<{row: number, col: number}> = []): void {
    const context = canvas.getContext('2d');
    assert(context, 'unable to get canvas drawing context');
    assert(gridSize > 0, 'size of puzzle must be greater than 0');

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawEmptyPuzzle(canvas, gridSize);
    drawCenters(canvas, gridSize, centers);

    if (lines.length > 0){
        drawLines(canvas, gridSize, lines); 
    }

    context.restore();
}