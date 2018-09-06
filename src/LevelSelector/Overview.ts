import PlayerTypes from '../interfaces/PlayerTypes';

interface Details {
    level: string;
    defender: number;
    capture: number;
}

export default class Overview {
    private startLevel: Function;

    private levelNumber: HTMLHeadingElement;
    private defenderHighScore: Element;
    private captureHighScore: Element;

    private captureOption: Element;
    private defenderOption: Element;
    private startButton: Element;

    private level: number;
    private option: PlayerTypes;

    constructor( mountNode: HTMLElement, startLevel: Function ) {
        this.startLevel = startLevel;

        const domNode: Element = document.createElement('div');
        domNode.classList.add( 'level-overview' );
        domNode.innerHTML = Overview.template;
        this.levelNumber = domNode.getElementsByTagName( 'h3' )[0];
        this.defenderHighScore = domNode.querySelector( `#${Overview.ID.DEFENDER}-highscore` );
        this.captureHighScore = domNode.querySelector( `#${Overview.ID.CAPTURE}-highscore` );
        this.defenderOption = domNode.getElementsByClassName( `${Overview.ID.DEFENDER}-option` )[0];
        this.captureOption = domNode.getElementsByClassName( `${Overview.ID.CAPTURE}-option` )[0];
        this.startButton = domNode.querySelector( `#${Overview.ID.START}` );
        this.addEventListeners();

        // Select 'defender' mode by default
        this.setOption( PlayerTypes.defender );

        mountNode.appendChild( domNode );
    }

    private static ID = {
        DEFENDER: 'defender',
        CAPTURE: 'capture',
        START: 'start'
    };

    private static template =  `
        <h3>Level</h3>
        <div class='character-selector'>
            <div class='option ${Overview.ID.DEFENDER}-option'>
                <h5>Defender</h5>
                <h5 id='${Overview.ID.DEFENDER}-highscore'>Highscore:</h5>
            </div>
            <div class='option ${Overview.ID.CAPTURE}-option'>
                <h5>Capture the Flag</h5>
                <h5 id='${Overview.ID.CAPTURE}-highscore'>Highscore:</h5>
            </div>
        </div>
        <button id='${Overview.ID.START}'>START</button>
    `;

    private addEventListeners(): void {
        this.defenderOption.addEventListener(
            'click',
            () => this.setOption( PlayerTypes.defender ) );
        this.captureOption.addEventListener(
            'click',
            () => this.setOption( PlayerTypes.capture ) );
        this.startButton.addEventListener( 'click', () => this.startLevel( this.level, this.option ) );
    }

    private setOption( option: PlayerTypes ) {
        if ( option === PlayerTypes.defender ) {
            this.defenderOption.classList.add( 'selected' );
            this.captureOption.classList.remove( 'selected' );
        } else if ( option === PlayerTypes.capture ) {
            this.defenderOption.classList.remove( 'selected' );
            this.captureOption.classList.add( 'selected' );
        }
        this.option = option;
    }

    public update( details: Details ): void {
        this.level = +details.level;
        this.levelNumber.innerHTML = `Level: ${details.level}`;
        this.defenderHighScore.innerHTML = `Highscore: ${details.defender}`;
        this.captureHighScore.innerHTML = `Highscore: ${details.capture}`;
    }
}
