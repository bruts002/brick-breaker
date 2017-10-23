import Modal from '../Modal';
import UserScore from '../UserScore/UserScore';
import LevelThumbNails from './LevelThumbNails';
import Overview from './Overview';

// TODO: load the correct level dynamically when needed
import levelOne from './levels/1/Level';

export default class LevelSelector {

    private modal: Modal;
    private cb: Function;
    private levelThumbNails: LevelThumbNails;
    private overview: Overview;

    private static defaultMessage: string = 'Choose a level';

    constructor( cb: Function ) {
        this.cb = cb;
        this.modal = new Modal( false );
        this.levelThumbNails = new LevelThumbNails( this.modal.extensionPoint, this.levelSelect.bind( this ) );
        this.overview = new Overview( this.modal.extensionPoint, this.startLevel.bind( this ) );
    }

    private levelSelect( level: number ): void {
        const paddleScore: number = UserScore.getScore( level, 'paddle' );
        const playerScore: number = UserScore.getScore( level, 'player' );
        this.overview.update({
            level: String( level ),
            paddle: paddleScore,
            player: playerScore
        });
    }

    public show( message?: string, success?: Boolean ): void {
        message = message ? message + LevelSelector.defaultMessage : LevelSelector.defaultMessage;
        this.modal.show( message );
    }

    private startLevel( levelNumber: number ): void {
        this.cb( levelOne, levelNumber );
        this.modal.hide();
    }

}