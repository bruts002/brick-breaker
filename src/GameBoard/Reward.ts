import RewardEnum from '../interfaces/Reward';
import Entity from './Entity';
import Vector from '../interfaces/Vector';

export default class Reward extends Entity {
    public rewardType: RewardEnum;

    constructor( start: Vector, rewardType: RewardEnum, mountNode: SVGElement ) {
        super( start,
               { width: 3, height: 3 },
               { x: 0, y: 1 },
               'rect',
               mountNode );
        this.rewardType = rewardType;
    }
}
