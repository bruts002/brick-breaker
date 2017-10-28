import Modal from '../Modal';
import UserScore from '../UserScore/UserScore';
import LevelThumbNails from './LevelThumbNails';
import Overview from './Overview';
import PlayerTypes from '../interfaces/PlayerTypes';
import Loader from '../Loader';


export default class LevelSelector {

    private modal: Modal;
    private cb: Function;
    private levelThumbNails: LevelThumbNails;
    private overview: Overview;

    private static defaultMessage: string = 'Choose a level';

    constructor( cb: Function ) {
        Loader.css( 'LevelSelector' );
        this.cb = cb;
        this.modal = new Modal( false );
        this.levelThumbNails = new LevelThumbNails( this.modal.extensionPoint, this.levelSelect.bind( this ) );
        this.overview = new Overview( this.modal.extensionPoint, this.startLevel.bind( this ) );
    }

    private levelSelect( level: number ): void {
        const defenderScore: number = UserScore.getScore( level, PlayerTypes.defender );
        const captureScore: number = UserScore.getScore( level, PlayerTypes.capture );
        this.overview.update({
            level: String( level ),
            defender: defenderScore,
            capture: captureScore
        });
    }

    public show( message?: string, success?: Boolean ): void {
        message = message ? message + LevelSelector.defaultMessage : LevelSelector.defaultMessage;
        this.modal.show( message );
    }

    private startLevel( levelNumber: number, option: PlayerTypes ): void {
        Loader.level( String( levelNumber ) )
            .then( level => this.cb( level, levelNumber, option ) )
            .catch( console.warn )
            .then( () => this.modal.hide() );
    }
}
