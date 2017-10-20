// TODO: create all the components for selecting levels
//          - have a playground level where they can play with all the features
import Modal from '../Modal';
import UserScore from '../UserScore/UserScore';
import LevelI from '../interfaces/LevelI';
import AllLevels from './levels/AllLevels';
import levelOne from './levels/1/Level';

export default class LevelSelector {

    private modal: Modal;
    private selectedLevel: Promise<LevelI>;
    private cb: Function;

    constructor( cb: Function ) {
        this.cb = cb;
        this.modal = new Modal( false );
    }

    public chooseLevel( message?: String, success?: Boolean ): void {
        const defaultMessage = 'Choose a level';
        this.modal.showTemplate(
            message ? message + defaultMessage : defaultMessage,
            this.buildDomNode(),
            success
        );
    }

    private buildDomNode(): HTMLElement {
        const domNode: HTMLDivElement = document.createElement('div');
        let prevLevelComplete: Boolean = true;
        AllLevels.forEach( (level, i) => {
            const levelNode: HTMLSpanElement = document.createElement('span');
            const levelScore: number = UserScore.getScore( i + 1 );
            const levelComplete: Boolean = levelScore >= level.minScore;
            let thumbNailSrc = '';

            levelNode.classList.add('level-node');
            if ( levelComplete || prevLevelComplete ) {
                levelNode.addEventListener('click', () => {
                    this.loadLevel( i + 1 );
                });
                levelNode.classList.add('allowed');
            } else {
                levelNode.classList.add('locked');
            }
            if ( levelComplete ) {
                thumbNailSrc = 'completed.png';
            } else if ( prevLevelComplete ) {
                thumbNailSrc = level.src;
            } else {
                thumbNailSrc = 'locked.png';
            }
            levelNode.innerHTML = LevelSelector.getTemplate( thumbNailSrc, String( i + 1), levelScore );
            domNode.appendChild( levelNode );
            prevLevelComplete = levelComplete;
        });
        return domNode;
    }

    private static getTemplate( src: string, level: string, score: number ): string {
        return `
            <img width='48px' height='48px' src=${src} />
            <p>${level}</p>
        ` + (score !== -1 ? `<p>Score: ${score}</p>` : '<p>&nbsp;</p>');
    }

    private loadLevel( levelNumber: number ): void {
        this.cb( levelOne, levelNumber );
        this.modal.hide();
    }

}