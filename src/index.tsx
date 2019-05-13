import micro from 'micro';
import GameBoard from 'App/GameBoard/GameBoard';
import Modal from 'biblioteca/Modal';
import './index.css';

import LevelI from 'App/interfaces/LevelI';
import PlayerTypes from 'App/interfaces/PlayerTypes';
import LevelSelector from 'App/LevelSelector/LevelSelector';

export default class Main {

    private levelSelector: LevelSelector;
    private gameBoard: GameBoard;
    private modal: Modal;

    constructor( private mountNode: HTMLElement ) {
        this.modal = new Modal( false );
        this.levelSelector = new LevelSelector({
            onStartLevel: this.setLevel.bind(this),
            extensionPoint: this.modal.extensionPoint
        });
        this.modal.show('Choose a level');

        this.handleEndGame = this.handleEndGame.bind(this);
    }

    private handleEndGame(level: number, message: string) {
        this.levelSelector.updateOverview(level);
        this.modal.show(message + 'Choose a level');
    }

    private setLevel( level: LevelI, levelNumber: number, option: PlayerTypes ): void {
        this.clearLevel();
        this.gameBoard = new GameBoard(
            level.size,
            this.mountNode,
            this.handleEndGame,
            levelNumber,
            option
        );
        this.gameBoard.init(level);
        this.modal.hide();
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
