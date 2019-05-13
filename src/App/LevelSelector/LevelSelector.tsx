import UserScore from '../UserScore/UserScore';
import LevelThumbNails from './LevelThumbNails';
import Overview from './Overview';
import PlayerTypes from '../interfaces/PlayerTypes';
import Loader from 'util/Loader';
import './level-selector.css';

interface Props {
    onStartLevel: Function;
    extensionPoint: HTMLElement;
    initialLevel?: number;
}

export default class LevelSelector {

    private onStartLevel: Function;
    private levelThumbNails: LevelThumbNails;
    private overview: Overview;
    private selectedLevel: number;

    constructor(props: Props) {
        this.onStartLevel = props.onStartLevel;
        this.selectedLevel = 0;
        const overviewMountNode: HTMLDivElement = document.createElement('div');
        const levelThumbnailsMountNode: HTMLDivElement = document.createElement('div');
        [levelThumbnailsMountNode, overviewMountNode].forEach( node => {
            props.extensionPoint.appendChild(node);
        });
        this.overview = new Overview(
            overviewMountNode,
            {
                startLevel: this.startLevel.bind( this )
            }
        );
        this.levelThumbNails = new LevelThumbNails(
            levelThumbnailsMountNode,
            {
                updateSelectedLevel: this.updateOverview.bind( this ),
                selectedLevel: this.selectedLevel
            }
        );
        const level: number = props.initialLevel || 0;
        this.updateOverview(level);
    }

    public updateOverview( levelNumber: number ): void {
        const defenderScore: number = UserScore.getScore( levelNumber, PlayerTypes.defender );
        const captureScore: number = UserScore.getScore( levelNumber, PlayerTypes.capture );
        this.levelThumbNails.updateProps({ selectedLevel: levelNumber });
        this.overview.updateProps({
            levelNumber,
            defenderScore,
            captureScore
        });
    }

    private startLevel( levelNumber: number, option: PlayerTypes ): void {
        Loader.level( String( levelNumber ) )
            .then( level => this.onStartLevel( level, levelNumber, option ) )
            .catch( console.warn );
    }
}
