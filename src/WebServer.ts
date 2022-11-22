import assert from 'assert';
import { Server } from 'http';
import express, { Application } from 'express';
import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';
import { parsePuzzle} from "./Parser";

const fs = require('fs');

/**
 * HTTP web game server for Star Battle. 
 */
export class WebServer {
    private readonly app: Application;
    private server: Server|undefined;
    
    /**
     * Make a new web game server that listens for connections on port.
     * 
     * @param requestedPort server port number
     */
    public constructor( 
        private readonly requestedPort: number
    ) {
        this.app = express();
        this.app.use((request, response, next) => {
            // allow requests from web pages hosted anywhere
            response.set('Access-Control-Allow-Origin', '*');
            next();
        });
        
        /**
         * Handle a request for /getpuzzle/<puzzlename> by responding with the puzzle
         * from the file puzzlename if the file is in the puzzles directory; error 404 otherwise
         */
         this.app.get('/getpuzzle/:puzzlename', asyncHandler( async function(request, response) {
            const { puzzlename } = request.params;
            assert(puzzlename);
            let puzzleFile = "";

            const puzzleFolder:string = '././puzzles';
            let inFile:boolean = false;

            const files = fs.readdirSync(puzzleFolder);
            for (const file of files){
                const fileSplit:Array<string> = file.split(".");
                if (fileSplit[0] === puzzlename && inFile === false){
                    puzzleFile = file;
                    inFile = true;
                    break;
                }
            }

            if(inFile){
                //file exists so the file name is valid
                const puzzleStringFromFile = fs.readFileSync(puzzleFolder + '/' + puzzleFile, 'utf8');
                const puzzle = parsePuzzle(puzzleStringFromFile);
                const blankPuzzleString = puzzle.getBlankPuzzleString();
                response
                .status(HttpStatus.OK)
                .type('text')
                .send(blankPuzzleString);
            } 
            else if (!(/^[a-zA-Z][\w\-]*$/.test(puzzlename))){
                //file name is not a proper file name
                response 
                .status(HttpStatus.NOT_FOUND) // 404
                .type('text')
                .send("invalid file name: " + puzzlename);
            } 
            else {
                // file is not found in directory
                response 
                .status(HttpStatus.NOT_FOUND) // 404
                .type('text')
                .send("file not in directory: " + puzzlename);
            }
        }));
    }

    /**
     * Start this server.
     * 
     * @returns (a promise that) resolves when the server is listening
     */
    public start(): Promise<void> {
        return new Promise(resolve => {
            this.server = this.app.listen(this.requestedPort, () => {
                console.log('server now listening at', this.port);
                resolve();
            });
        });
    }

    /**
     * @returns the port that server is listening at.
     *          Requires that start() has already been called and completed.
     */
    public get port(): number {
        const address = this.server?.address() ?? 'not connected';
        if (typeof(address) === 'string') {
            throw new Error('server is not listening at a port');
        }
        return address.port;
    }

    /**
     * Stop this server. Once stopped, this server cannot be restarted.
     */
     public stop(): void {
        this.server?.close();
        console.log('server stopped');
    }
}