import micro from 'micro';
import GameBoard from 'App/GameBoard/GameBoard';
import Modal from 'biblioteca/Modal/';
import TabContainer from 'biblioteca/TabContainer/';
import './index.css';

import LevelI from 'App/interfaces/LevelI';
import PlayerTypes from 'App/interfaces/PlayerTypes';
import LevelSelector from 'App/LevelSelector/LevelSelector';
import { ActionBar, LevelBuilderAdmin, LevelBuilder } from 'App/LevelBuilder/';

class Main {

    private levelSelector: LevelSelector;
    private gameBoard: GameBoard;
    private modal: Modal;
    private tabContainer: TabContainer;

    constructor( private mountNode: HTMLElement ) {
        this.handleEndGame = this.handleEndGame.bind(this);
        this.createNewLevel = this.createNewLevel.bind(this);

        this.modal = new Modal( false );
        this.tabContainer = new TabContainer();
        const playTab: HTMLElement = document.createElement('div');
        const buildTab: HTMLElement = document.createElement(LevelBuilderAdmin.domName);
        this.tabContainer.addTab('Play', playTab, true);
        this.tabContainer.addTab('Build', buildTab);
        this.modal.extensionPoint.appendChild(this.tabContainer.container);
        this.levelSelector = new LevelSelector({
            onStartLevel: this.setLevel.bind(this),
            extensionPoint: playTab
        });
        this.modal.show('');
        buildTab.addEventListener(ActionBar.create_new_level, this.createNewLevel);

    }

    private createNewLevel(): void {
        this.mountNode.appendChild(document.createElement(LevelBuilder.domName));
        this.modal.hide();
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
);

start();
