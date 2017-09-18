import GameBoard from './GameBoard';
import Size from './interfaces/Size';
import blocks from './data/blocks';
import balls from './data/balls';

export default class Main {
    constructor() {
        // TODO: get size, blocks and balls from a config file based on level
        var gbSize:Size = {width:100, height: 50};
        var gb = new GameBoard(gbSize, document.body);
        gb.init(blocks, balls);
    }
}

let start = new Main();