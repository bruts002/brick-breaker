
interface Details {
    level: string;
    paddle: number;
    player: number;
}

export default class Overview {
    private startLevel: Function;

    private levelNumber: HTMLHeadingElement;
    private paddleHighScore: Element;
    private playerHighScore: Element;

    private playerOption: Element;
    private paddleOption: Element;
    private startButton: Element;

    private level: number;
    private option: String;

    constructor( mountNode: HTMLElement, startLevel: Function ) {
        this.startLevel = startLevel;

        const domNode: Element = document.createElement('div');
        domNode.classList.add( 'level-overview' );
        domNode.innerHTML = `
            <h3>Level</h3>
            <div class='character-selector'>
                <div class='option paddle-option'>
                    <h4>Paddle</h4>
                    <h5 id='paddle-highscore'>Highscore:</h5>
                </div>
                <div class='option player-option'>
                    <h4>Player</h4>
                    <h5 id='player-highscore'>Highscore:</h5>
                </div>
            </div>
            <button id='start'>START</button>
        `;
        this.levelNumber = domNode.getElementsByTagName( 'h3' )[0];
        this.paddleHighScore = domNode.querySelector( '#paddle-highscore' );
        this.playerHighScore = domNode.querySelector( '#player-highscore' );
        this.paddleOption = domNode.getElementsByClassName( 'paddle-option' )[0];
        this.playerOption = domNode.getElementsByClassName( 'player-option' )[0];
        this.startButton = domNode.querySelector( '#start' );
        this.addEventListeners();

        mountNode.appendChild( domNode );
    }

    private addEventListeners(): void {
        this.paddleOption.addEventListener(
            'click',
            () => this.setOption( 'paddle' ) );
        this.playerOption.addEventListener(
            'click',
            () => this.setOption( 'player' ) );
        this.startButton.addEventListener( 'click', () => this.startLevel( this.level, this.option ) );
    }

    private setOption( option: 'paddle'|'player' ) {
        if ( option === 'paddle' ) {
            this.paddleOption.classList.add( 'selected' );
            this.playerOption.classList.remove( 'selected' );
        } else if ( option === 'player' ) {
            this.paddleOption.classList.remove( 'selected' );
            this.playerOption.classList.add( 'selected' );
        }
        this.option = option;
    }

    public update( details: Details ): void {
        this.level = +details.level;
        this.levelNumber.innerHTML = `Level: ${details.level}`;
        this.paddleHighScore.innerHTML = `Highscore: ${details.paddle}`;
        this.playerHighScore.innerHTML = `Highscore: ${details.player}`;
    }
}
