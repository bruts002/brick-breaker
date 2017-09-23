import GameBoard from './GameBoard';
import Size from './interfaces/Size';
import blocks from './data/blocks';
import balls from './data/balls';

export default class Main {
    constructor() {
        // TODO: move all GameBoard stuff into a ./GameBoard directory
        // TODO: create ./LevelSelector directory with all the components for selecting levels
        //          - have a playground level where they can play with all the features 
        // TODO: handle end game better (win&lose)
        // TODO: create ./LevelCreator directory with all the components for user created levels
        var gbSize:Size = {width:100, height: 50};
        var gb = new GameBoard(gbSize, document.body);
        gb.init(blocks, balls);
    }
}

let start = new Main();