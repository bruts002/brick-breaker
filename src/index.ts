import GameBoard from './GameBoard/GameBoard';
import Size from './interfaces/Size';
import blocks from './data/blocks';
import balls from './data/balls';

export default class Main {
    constructor() {
        // TODO: handle end game better (win&lose)
        // TODO: create ./LevelCreator directory with all the components for user created levels
        let gbSize: Size = { width: 100, height: 50 };
        let gb = new GameBoard( gbSize, document.body );
        gb.init(blocks, balls);
    }
}

let start = new Main();