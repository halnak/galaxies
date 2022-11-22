import assert from 'assert';
import { WebServer } from '../src/WebServer';
import fetch from 'node-fetch';

/**
 * Test suite for the Server ADT
 */
describe('server', function() {
    /**
     * Testing strategy:
     * 
     * Partition on request type:
     *    - request to /getpuzzle route with valid puzzlename
     *    - request to /getpuzzle route with invalid puzzlename
     *    - request to /getpuzzle route with no puzzlename
     *    - request to a different route
     */

    it('/getpuzzle with valid puzzlename', async function(){
        const port: number = 8379;
        const server: WebServer = new WebServer(port);
        await server.start();

        const url: string = `http://localhost:${server.port}/getpuzzle/ga-1-1-1`;
        const response = fetch(url).then(response => {
            return response.text();
        });

        const str = `7x7
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
        assert.strictEqual(await response, str, "should be equal");

        server.stop();
    });

    it('/getpuzzle with invalid or no puzzlename, or a different route', async function(){
        const port = 8379;
        const server = new WebServer(port);
        await server.start();

        //no puzzle file name
        const url = `http://localhost:${server.port}/getpuzzle/`;
        const response = await fetch(url);
        assert.strictEqual(response.status, 404);

        //puzzle file name that doesn't exist in the puzzle directory
        const url1 = `http://localhost:${server.port}/getpuzzle/puzzle123`;
        const response1 = await fetch(url1);
        assert.strictEqual(response1.status, 404);

        //puzzle file name that isn't a proper file name
        const url2 = `http://localhost:${server.port}/getpuzzle/1puzzle.txt`;
        const response2 = await fetch(url2);
        assert.strictEqual(response2.status, 404);

        //completely different route
        const url3 = `http://localhost:${server.port}/getnewpuzzle`;
        const response3 = await fetch(url3);
        assert.strictEqual(response3.status, 404);

        server.stop();
    })
    
});
