import micro, { Component } from 'micro';
import RewardEnum from '../../interfaces/Reward';
import './status-bar.css';

interface Props {
    onRewardSelect: Function;
    selectedReward: RewardEnum;
    levelNumber: number;
    score: number;
    rewards: RewardEnum[];
}

interface State {
}

export default class StatusBar extends Component<State, Props> {

    constructor(
        mountNode: HTMLElement,
        props: Props
    ) {
        super(mountNode, props);
        this.mountComponent();
    }

    protected render() {
        const {
            onRewardSelect,
            score,
            levelNumber,
            selectedReward,
            rewards
        } = this.props;
        return (
            <div className='status-bar'>
                <h3>{`Level ${levelNumber}`}</h3>
                <h4>{`Score: ${score}`}</h4>
                <div>
                    {rewards.map((reward: RewardEnum) => (
                        <div
                            className={reward === selectedReward ? 'status-bar__reward--selected' : ''}
                            onClick={() => onRewardSelect(reward)}>
                            {`${reward}`}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
