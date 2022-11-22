import {WebServer} from './WebServer';

/**
 * Start a server that serves puzzles from the `puzzles` directory
 * on localhost:8789.
 */
async function main(): Promise<void> {
    const port = 8789; 
    const server: WebServer = new WebServer(port);
    await server.start();
}

if (require.main === module) {
    void main();
}