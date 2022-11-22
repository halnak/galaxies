import assert from 'assert';
import { Puzzle } from './Puzzle'
import { drawEverything } from './Drawing';
import { parsePuzzle } from './Parser';


/**
 * Puzzle to request and play. Constant for now. 
 */
const PUZZLE: string = "kd-1-1-1";

/**
 * An mutable data type representing a client solving a Galaxy puzzle. Assumes that a Client can only be solving one puzzle at a time.
 */
 export class Client {
    private clientPuzzle:Puzzle;

    public constructor(private readonly puzzleStr:string){
        this.clientPuzzle = parsePuzzle(puzzleStr);
    }
    
    /**
     * Checks whether the given grid line has a line on it selected by the user. 
     * Requires that the line is one coordinate length long, has integer coordinates,
     * and follows the convention (top to bottom) for vertical lines and (left to
     * right) for horizontal lines. 
     * 
     * @param start the coordinate of the location to start the line, 0 <= row, col <= puzzleSize
     * @param end the column coordinate of the location to add the star, 0 <= row, col <= puzzleSize
     * @returns whether the line from `start` to `end` has a line
     */
    public hasLine(start:{row:number, col:number}, end:{row:number, col:number}):boolean{
        // TODO
        throw new Error("Not Implemented Yet");
    }
    
    /**
     * Adds a line to the client's puzzle at the given location (if there is not already
     * a line existing there that the client added). Requires that the line is one coordinate 
     * length long, has integer coordinates, follows the convention (top to bottom) for 
     * vertical lines and (left to right) for horizontal lines, and is not on the outer
     * border. 
     * 
     * @param start the coordinate of the location to start the line, 0 <= row, col <= puzzleSize
     * @param end the column coordinate of the location to add the star, 0 <= row, col <= puzzleSize
     */
    public addLine(start:{row:number, col:number}, end:{row:number, col:number}): void {
        // TODO
        throw new Error("Not Implemented Yet");
    }
    
    /**
     * Removes a line from the current puzzle at the given location and do nothing if there is not 
     * a line there. Requires that the line is one coordinate length long, has integer
     * coordinates, and follows the convention (top to bottom) for vertical lines and (left to right)
     * for horizontal lines. 
     * 
     * @param start the coordinate of the location to start the line, 0 <= row, col <= puzzleSize
     * @param end the column coordinate of the location to add the star, 0 <= row, col <= puzzleSize
     */
    public removeLine(start:{row:number, col:number}, end:{row:number, col:number}): void {
        // TODO
        throw new Error("Not Implemented Yet");
    }
    
    /**
     * Check if the puzzle is solved. 
     * 
     * @returns true if the Puzzle is fully solved and false otherwise
     */
    public checkSolved(): boolean {
        return this.clientPuzzle.isSolved();
    }

    /**
     * Return the instance of the Puzzle that the client is working with. 
     * 
     * @returns the client's puzzle
     */
    public getPuzzle(): Puzzle {
        return this.clientPuzzle;
    }
}

/**
* Displays the current progress of the client's puzzle on the canvas. 
*
* @param client the client playing the given puzzle to be drawn
* @param canvas the canvas element on which to draw the client's puzzle
*/
function drawPuzzle(client:Client, canvas:HTMLCanvasElement): void {
    const clientPuzzle = client.getPuzzle();
    const allLines = clientPuzzle.getLines();
    const allCenters = clientPuzzle.getCenters();
    const size = clientPuzzle.getSize();

    drawEverything(canvas, size, allLines, allCenters);
    return;
}

/**
 * Find the grid coordinates of the cell that was clicked within the given canvas.
 *
 * @param x coordinate of the click on the canvas
 * @param y coordinate of the click on the canvas
 * @param canvas the canvas element on which the click was performed
 * @param client the client solving the given puzzle on the canvas
 * @returns [start, end] coordinates of the start and end points of the line
 */
function selectCell(x:number, y:number, canvas:HTMLCanvasElement, client: Client):{start:{row:number, col:number}, end:{row:number, col:number}}{
    throw new Error("Not Implemented Yet");
}

/**
 * Set up a client playing PUZZLE.
 */
async function main(): Promise<void> {
    const port = 8789; //Specified by server
    const puzzleText: Promise<Response> = fetch(`http://localhost:${port}/getpuzzle/${PUZZLE}`);
    const promisedText: Promise<string> = 
    puzzleText.then(function(response:Response):Promise<string> {
        const downloadingPromise: Promise<string> = response.text();
        return downloadingPromise;
    });

    const client = new Client(await promisedText);

    // output area for printing
    const outputArea: HTMLElement = document.getElementById('outputArea') ?? assert.fail('missing output area');

    // canvas for drawing
    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement ?? assert.fail('missing drawing canvas');
    drawPuzzle(client, canvas);

    // button for checking solved
    const button: HTMLButtonElement = document.getElementById('button') as HTMLButtonElement ?? assert.fail('missing button element');
    printOutput(button, `Check Solved`);
    
    // when the user clicks on the drawing canvas, add or remove star
    canvas.addEventListener('click', (event: MouseEvent) => {
        const clickLine:{start:{row:number, col:number}, end:{row:number, col:number}} = selectCell(event.offsetX, event.offsetY, canvas, client);
        if(!client.hasLine(clickLine.start, clickLine.end)){
            client.addLine(clickLine.start, clickLine.end);
            drawPuzzle(client, canvas);
        }else{
            client.removeLine(clickLine.start, clickLine.end);
            drawPuzzle(client, canvas);
        }
    });

    // when the user clicks on the button element, check for solved
    button.addEventListener('click', (event: MouseEvent) => {
        const solved = client.checkSolved();
        if (solved) {
            clearOutput(outputArea);
            printOutput(outputArea, `Puzzle Solved Correctly`);
        } else {
            clearOutput(outputArea);
            printOutput(outputArea, `Sorry, the puzzle is not solved correctly, try again`);
        }
    });
}

/**
 * Print a message by appending it to an HTML element.
 * 
 * @param outputArea HTML element that should display the message
 * @param message message to display
 */
function printOutput(outputArea: HTMLElement, message: string): void {
    // append the message to the output area
    outputArea.innerText += message + '\n';

    // scroll the output area so that what we just printed is visible
    outputArea.scrollTop = outputArea.scrollHeight;
}

/**
 * Resets the message to empty string.
 *
 * @param outputArea HTML element that should display the message
 */
function clearOutput(outputArea: HTMLElement): void {
    outputArea.innerText = "";
}

main();
