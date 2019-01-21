import Modal from 'biblioteca/Modal';
import UserScore from '../UserScore/UserScore';
import LevelThumbNails from './LevelThumbNails';
import Overview from './Overview';
import PlayerTypes from '../interfaces/PlayerTypes';
import Loader from 'util/Loader';
import './level-selector.css';


export default class LevelSelector {

    private modal: Modal;
    private cb: Function;
    private levelThumbNails: LevelThumbNails;
    private overview: Overview;

    private static defaultMessage: string = 'Choose a level';

    constructor( cb: Function ) {
        this.cb = cb;
        this.modal = new Modal( false );
        this.overview = new Overview(
            this.modal.extensionPoint,
            {
                startLevel: this.startLevel.bind( this )
            }
        );
        this.levelThumbNails = new LevelThumbNails( this.modal.extensionPoint, this.updateOverview.bind( this ) );
    }

    private updateOverview( levelNumber: number ): void {
        const defenderScore: number = UserScore.getScore( levelNumber, PlayerTypes.defender );
        const captureScore: number = UserScore.getScore( levelNumber, PlayerTypes.capture );
        this.overview.updateProps({
            levelNumber,
            defenderScore,
            captureScore
        });
    }

    public show( level: number, message?: string, success?: Boolean ): void {
        this.updateOverview(level);
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
