import UserScore from '../UserScore/UserScore';
import AllLevels from './levels/AllLevels';
import Loader from '../Loader';

export default class LevelThumbNails {
    private mountNode: HTMLElement;
    private levelSelectCB: Function;

    constructor( mountNode: HTMLElement, levelSelectCB: Function ) {
        Loader.css( 'LevelThumbNail' );
        this.mountNode = mountNode;
        this.levelSelectCB = levelSelectCB;

        const domNode: HTMLDivElement = document.createElement( 'div' );
        domNode.classList.add( 'level-thumbnails' );
        this.attachLevelNodes( domNode );
        this.mountNode.appendChild( domNode );
    }

    private attachLevelNodes( mountNode: HTMLDivElement ): void {
        let prevLevelComplete: Boolean = true;
        AllLevels.forEach( ( level, i ) => {
            const levelNode: HTMLSpanElement = document.createElement('span');
            const levelScore: number = UserScore.getScore( i );
            const levelComplete: Boolean = levelScore >= level.minScore;
            let thumbNailSrc = '';

            levelNode.classList.add('level-node');
            if ( levelComplete || prevLevelComplete ) {
                levelNode.addEventListener('click', () => {
                    const prev = mountNode.querySelector( '#selected' );
                    if ( prev ) prev.id = '';
                    levelNode.id = 'selected';
                    this.levelSelectCB( i );
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
            levelNode.innerHTML = LevelThumbNails.levelTemplate( thumbNailSrc, String( i ) );
            mountNode.appendChild( levelNode );
            prevLevelComplete = levelComplete;

            if (i === 0) {
                // Select first level // TODO: select highest unlocked level
                this.levelSelectCB( i );
                levelNode.id = 'selected';
            }
        });
    }

    private static levelTemplate( src: string, level: string ): string {
        return `
            <img width='48px' height='48px' src=${src} />
            <p>${level}</p>
        `;
    }

}
