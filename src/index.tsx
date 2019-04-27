import micro from 'micro';
import GameBoard from 'App/GameBoard/GameBoard';
import './index.css';

import LevelI from 'App/interfaces/LevelI';
import PlayerTypes from 'App/interfaces/PlayerTypes';
import LevelSelector from 'App/LevelSelector/LevelSelector';

export default class Main {

    private levelSelector: LevelSelector;
    private gameBoard: GameBoard;

    constructor( private mountNode: HTMLElement ) {
        this.levelSelector = new LevelSelector( this.setLevel.bind(this) );
        this.levelSelector.show(0);
    }

    private setLevel( level: LevelI, levelNumber: number, option: PlayerTypes ): void {
        this.clearLevel();
        this.gameBoard = new GameBoard(
            level.size,
            this.mountNode,
            this.levelSelector,
            levelNumber,
            option
        );
        this.gameBoard.init(level);
    }

    private clearLevel(): void {
        if (this.gameBoard) {
            delete this.gameBoard;
        }
    }
}

const mountNode: HTMLElement = document.getElementById('game-board');

const start = () => new Main( mountNode );

const xstart = () => micro.render(
    <h1 className='michael'>Hello World</h1>,
    mountNode
)

start();
