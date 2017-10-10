import GameBoard from './GameBoard/GameBoard';
import Size from './interfaces/Size';
import LevelI from './interfaces/LevelI';
import LevelSelector from './LevelSelector/LevelSelector';

export default class Main {
    constructor() {
        // TODO: handle end game better (win&lose)
        // TODO: create ./LevelCreator directory with all the components for user created levels
        const levelSelector = new LevelSelector();
        levelSelector
            .chooseLevel()
            .then(this.setLevel);
    }

    private setLevel( level: LevelI ): void {
        let gb = new GameBoard( level.size, document.body );
        gb.init(level);
    }
}

const start = new Main();