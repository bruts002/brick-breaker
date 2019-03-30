import micro, { Component } from 'micro';
import UserScore from '../UserScore/UserScore';
import AllLevels from './levels/AllLevels';
import './level-thumb-nail.css';

interface Props {
    selectedLevel: number;
    updateSelectedLevel: Function;
}

interface State {
}

export default class LevelThumbNails extends Component<State, Props> {

    private static defaultProps: Props =  {
        selectedLevel: 0,
        updateSelectedLevel: (): void => undefined
    };

    constructor(
        extensionPoint: HTMLElement,
        props: Props
    ) {
        super(extensionPoint, { ...LevelThumbNails.defaultProps, ...props });

        this.mountComponent();
    }

    protected render() {
        let prevLevelComplete: Boolean = true;
        return (
            <div className='level-thumbnails'>
                {AllLevels.map( (level, i) => {
                    const levelScore: number = UserScore.getScore( i );
                    const levelComplete: Boolean = levelScore >= level.minScore;
                    const classes = ['level-node'];
                    if (prevLevelComplete) {
                        classes.push('allowed');
                    } else {
                        classes.push('locked');
                    }
                    if (levelComplete) classes.push('complete');

                    prevLevelComplete = levelComplete;
                    return (
                        <span
                            className={classes.join(' ')}
                            id={this.props.selectedLevel === i ? 'selected' : ''}
                            onClick={() => {
                                this.props.updateSelectedLevel(i);
                            }}
                        >
                            <img width='48px' height='48px' />
                            <p>{String(i)}</p>
                        </span>
                    );
                })}
            </div>
        );
    }

}
