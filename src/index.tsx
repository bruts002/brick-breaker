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
        const tabContainer: HTMLDivElement = document.createElement('div');
        tabContainer.innerHTML = `
        <header>
            <ul style='display: flex;list-style:none;'>
                <li><button id='section-one-button'>Play</button></li>
                <li><button id='section-two-button'>Build</button></li>
            </ul>
        </header>
        <div>
            <div id='section-one-body'></div>
            <div id='section-two-body' style='display:none;'>Build Content</div>
        </div>
        `;
        const sectionOneButton: HTMLElement = tabContainer.querySelector('#section-one-button');
        const sectionTwoButton: HTMLElement = tabContainer.querySelector('#section-two-button');
        const sectionOneBody: HTMLElement = tabContainer.querySelector('#section-one-body');
        const sectionTwoBody: HTMLElement = tabContainer.querySelector('#section-two-body');
        sectionOneButton.addEventListener('click', () => {
            sectionTwoBody.style.display = 'none';
            sectionOneBody.style.display = 'block';
        });
        sectionTwoButton.addEventListener('click', () => {
            sectionTwoBody.style.display = 'block';
            sectionOneBody.style.display = 'none';
        });
        this.modal.extensionPoint.appendChild(tabContainer);
        this.levelSelector = new LevelSelector({
            onStartLevel: this.setLevel.bind(this),
            extensionPoint: sectionOneBody
        });
        this.modal.show('');

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
