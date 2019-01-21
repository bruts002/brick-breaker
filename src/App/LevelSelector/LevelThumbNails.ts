import UserScore from '../UserScore/UserScore';
import AllLevels from './levels/AllLevels';
import './level-thumb-nail.css';

export default class LevelThumbNails {

    constructor(
        private mountNode: HTMLElement,
        private levelSelectCB: Function
    ) {
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

            levelNode.classList.add('level-node');
            if ( levelComplete || prevLevelComplete ) {
                levelNode.addEventListener('click', () => {
                    const prev = mountNode.querySelector( '#selected' );
                    if ( prev ) prev.id = '';
                    levelNode.id = 'selected';
                    this.levelSelectCB( i );
                });
                if (levelComplete) {
                    levelNode.classList.add('complete');
                }
                levelNode.classList.add('allowed');
            } else {
                levelNode.classList.add('locked');
            }
            levelNode.innerHTML = LevelThumbNails.levelTemplate(i);
            mountNode.appendChild( levelNode );
            prevLevelComplete = levelComplete;

            if (i === 0) {
                // Select first level // TODO: select highest unlocked level
                this.levelSelectCB( i );
                levelNode.id = 'selected';
            }
        });
    }

    private static levelTemplate( level: number ): string {
        return `
            <img width='48px' height='48px' />
            <p>${level}</p>
        `;
    }

}
