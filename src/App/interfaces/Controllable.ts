import RewardEnum from './Reward';

interface Controllable {
    moveUp(): void;
    moveDown(): void;
    moveLeft(): void;
    moveRight(): void;
    useReward(): void;
    applyReward( reward: RewardEnum ): void;
}

export default Controllable;
