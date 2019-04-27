import RewardEnum from '../../interfaces/Reward';
import './status-bar.css';

export default class StatusBar {
    private mountNode: HTMLElement;
    private domElement: HTMLDivElement;
    private score: Element;
    private rewards: Element;
    private rewardSelect: Function;

    constructor( rewardSelect: Function, levelName: number, mountNode: HTMLElement ) {
        this.rewardSelect = rewardSelect;
        this.mountNode = mountNode;
        this.domElement = document.createElement( 'div' );
        this.domElement.classList.add( 'status-bar' );
        this.domElement.innerHTML = StatusBar.getInnerHTML( String ( levelName ) );
        this.score = this.domElement.querySelector( `#${StatusBar.ID.SCORE}` );
        this.rewards = this.domElement.querySelector( `#${StatusBar.ID.REWARDS}` );

        mountNode.appendChild( this.domElement );
    }

    public updateScore( score: number ): void {
        this.score.innerHTML = String( score );
    }

    private static ID = {
        SCORE: 'score',
        REWARDS: 'rewards',
        SELECTED: 'selected'
    };

    private static getInnerHTML( levelName: string ): string {
        return `
            <h3>Level ${levelName}</h3>
            <h4>Score: <span id='${StatusBar.ID.SCORE}'></span></h4>
            <div id='${StatusBar.ID.REWARDS}'></div>
        `;
    }

    private removeSelection(): void {
        const selected: Element = this.rewards.querySelector(`#${StatusBar.ID.SELECTED}`);
        if ( selected ) {
            selected.id = '';
        }
    }

    public addReward( reward: RewardEnum ): void {
        this.removeSelection();
        const node = document.createElement( 'div' );
        const selectReward = (): void => {
            this.rewardSelect( reward );
            this.removeSelection();
            node.id = StatusBar.ID.SELECTED;
        };
        node.addEventListener('click', selectReward);
        document.body.addEventListener('keydown', (ev: KeyboardEvent) => {
            if (ev.code === `Digit${reward}`) {
                selectReward();
            }
        });
        node.id = StatusBar.ID.SELECTED;
        node.innerHTML = String ( reward );
        this.rewards.appendChild( node );
    }
}
