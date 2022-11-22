import assert from 'assert';
import { Puzzle } from './Puzzle';
import { Parser, ParseTree, compile } from 'parserlib';

/**
 * Parser for Galaxy puzzles.
 */

// the grammar
const grammar = `
@skip whitespace {
    puzzle ::= (comment)* size (galaxy)+;
    comment ::= '#' [^#\\r\\n]+ linebreak;
    size ::= number 'x' number linebreak;
    galaxy ::= (coord) '|' (collection)+ linebreak;
    collection ::= line ('+' line)*;
    line ::= '[' ('(' coord ')' )+ ']';
    coord ::= number ',' number;
}
linebreak ::= [\\r\\n]*;
number ::= [1-9]|'10' ['.5']*;
whitespace ::= [ \\t]+;
`;

// the nonterminals of the grammar
enum PuzzleGrammar {
    Puzzle, Comment, Size, Galaxy, Collection, Line, Coord, Linebreak, Number, Whitespace,
}

// compile the grammar into a parser
const parser: Parser<PuzzleGrammar> = compile(grammar, PuzzleGrammar, PuzzleGrammar.Puzzle);

/**
 * Parse a a valid, parsable puzzle string into a Star Battle puzzle.
 *
 * @param input string to parse
 * @returns Puzzle parsed from the string
 * @throws ParseError if the string doesn't match the Puzzle grammar
 */
export function parsePuzzle(input: string): Puzzle {
    const parseTree: ParseTree<PuzzleGrammar> = parser.parse(input);
    const puzzle: Puzzle = makeAbstractSyntaxTree(parseTree);

    return puzzle;
}

/**
 * Makes an Abstract Syntax Tree of a puzzle.
 *
 * @param parseTree a parseTree whose root non-terminal is PuzzleGrammar.Puzzle
 * @returns the Puzzle object constructed based on the `parseTree`
 */
function makeAbstractSyntaxTree(parseTree: ParseTree<PuzzleGrammar>): Puzzle {
    if (parseTree.name === PuzzleGrammar.Puzzle) {
        // puzzle ::= (comment)* size (galaxy)+;
        const children: Array<ParseTree<PuzzleGrammar>> = parseTree.childrenByName(PuzzleGrammar.Galaxy);
        const sizeElement: Array<ParseTree<PuzzleGrammar>> = parseTree.childrenByName(PuzzleGrammar.Size);
        assert(sizeElement[0]); //One element - size of the puzzle (size ::= number 'x' number linebreak;)
        const dimensions = sizeElement[0].childrenByName(PuzzleGrammar.Number);

        assert(dimensions[0]); 
        assert(dimensions[1]);
        assert(parseInt(dimensions[0].text)===parseInt(dimensions[1].text), 'Puzzle must have square dimensions');
        const puzzleSize:number = parseInt(dimensions[0].text);

        let allCenters:Array<{row:number, col:number}> = [];
        let allLines:Array<Array<{row:number, col:number}>> = [];
        for (const galaxy of children){
            const g = parseGalaxy(galaxy);

            allLines = allLines.concat(g.lines);
            assert(g.center);
            allCenters.push(g.center); // One center per galaxy
        }
        return new Puzzle(puzzleSize, allCenters, allLines);
    } else {
        assert.fail(`Cannot make a Puzzle for ${PuzzleGrammar[parseTree.name]}`);
    }
}

/**
 * Given the parse tree of a galaxy, returns the coordinates of all the galaxy centers and all the 
 * lines given as arrays of start and end line coordinates. 
 *
 * @param parseTree a parseTree that has a Galaxy as its root non-terminal
 * @returns a record type containing:
 *          `center`: 
 *          `collection`: 
 */
 function parseGalaxy(parseTree: ParseTree<PuzzleGrammar>): {center:{row:number, col:number}, lines:Array<Array<{row:number, col:number}>>} {
    if (parseTree.name === PuzzleGrammar.Galaxy) {
        // galaxy ::= (coord) '|' (collection)+ linebreak;
        const centerChildren: Array<ParseTree<PuzzleGrammar>> = parseTree.childrenByName(PuzzleGrammar.Coord);
        const collectionChildren: Array<ParseTree<PuzzleGrammar>> = parseTree.childrenByName(PuzzleGrammar.Collection);

        assert(centerChildren[0]);
        const center:{row:number, col:number} = parseCoord(centerChildren[0]);
        const allLines:Array<Array<{row:number, col:number}>> = [];

        assert(collectionChildren[0]);
        const collection = parseCollection(collectionChildren[0]); //one collection per galaxy

        return {center: center, lines: collection};
    } else {
        assert.fail(`Cannot make Galaxy representation for ${PuzzleGrammar[parseTree.name]}`);
    }
}

/**
 * Given the parse tree of a Collection of lines, returns an array of the contained lines. 
 *
 * @param parseTree a parseTree that has a Line as its root non-terminal
 * @returns an array of the lines (arrays of start and end coordinates) encoded by `parseTree`
 */
 function parseCollection(parseTree: ParseTree<PuzzleGrammar>): Array<Array<{row:number, col:number}>> {
    if (parseTree.name === PuzzleGrammar.Collection) {
        // collection ::= line ('+' line)*;
        const children: Array<ParseTree<PuzzleGrammar>> = parseTree.childrenByName(PuzzleGrammar.Line);
        const allLines = [];
        
        for (const lineChild of children){
            const line:Array<{row:number, col:number}> = parseLine(lineChild);
            allLines.push(line)
        }

        return allLines;
    } else {
        assert.fail(`cannot make a Collection for ${PuzzleGrammar[parseTree.name]}`);
    }
}

/**
 * Given the parse tree of a single line, returns the coordinates describing the line. 
 *
 * @param parseTree a parseTree that has a Line as its root non-terminal
 * @returns an array of the start and end coordinates of the line as encoded by `parseTree`. 
 */
 function parseLine(parseTree: ParseTree<PuzzleGrammar>): Array<{row:number, col:number}> {
    if (parseTree.name === PuzzleGrammar.Line) {
        // line ::= '[' ('(' coord ')' )+ ']';
        const children: Array<ParseTree<PuzzleGrammar>> = parseTree.childrenByName(PuzzleGrammar.Coord);
        assert(children.length == 2); // only the start and end coordinates for each line
        const allCoords = [];

        for (const coordChild of children){
            const coord = parseCoord(coordChild);
            allCoords.push(coord);
        }

        return allCoords;
    } else {
        assert.fail(`cannot make a Line for ${PuzzleGrammar[parseTree.name]}`);
    }
}

/**
 * Given the parse tree of a coordinate, extract the coordinate values
 *
 * @param parseTree a parseTree that has a Coord as its root non-terminal
 * @returns The coordinate as encoded by `parseTree`. 
 */
 function parseCoord(parseTree: ParseTree<PuzzleGrammar>): {row:number, col:number} {
    if (parseTree.name === PuzzleGrammar.Coord) {
        // coord ::= number ',' number;
        const children: Array<ParseTree<PuzzleGrammar>> = parseTree.childrenByName(PuzzleGrammar.Number);
        assert(children.length === 2, 'All coords should have [row, col]');
        assert(children[0]);
        assert(children[1]);

        const row:number = parseInt(children[0].text);
        const col:number = parseInt(children[1].text);

        return {row:row, col:col};
    } else {
        assert.fail(`Cannot make a Coord for ${PuzzleGrammar[parseTree.name]}`);
    }
}