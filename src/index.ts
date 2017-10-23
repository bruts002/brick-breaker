import GameBoard from './GameBoard/GameBoard';
import Size from './interfaces/Size';
import LevelI from './interfaces/LevelI';
import LevelSelector from './LevelSelector/LevelSelector';

export default class Main {

    private levelSelector: LevelSelector;
    private gameBoard: GameBoard;

    private mountNode: HTMLElement;

    constructor( mountNode: HTMLElement ) {
        this.mountNode = mountNode;
        this.levelSelector = new LevelSelector( this.setLevel.bind(this) );
        this.levelSelector.show();
    }

    private setLevel( level: LevelI, levelNumber: number ): void {
        this.clearLevel();
        this.gameBoard = new GameBoard( level.size, this.mountNode, this.levelSelector, levelNumber );
        this.gameBoard.init(level);
    }

    private clearLevel(): void {
        if (this.gameBoard) {
            delete this.gameBoard;
        }
    }
}

const start = new Main(
    document.getElementById('gameBoard')
);