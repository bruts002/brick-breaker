import Reward from '../interfaces/Reward';
import Size from '../interfaces/Size';
import Vector from '../interfaces/Vector';

export default class Guy {
    constructor() {

    }
    public applyReward( reward: Reward ): void { }
    public getSize(): Size { return { width: 0, height: 0 }; }
    public getPoint(): Vector { return { x: 0, y: 0}; }
    public moveLeft(): void { }
    public moveRight(): void { }
    public useReward(): void { }
}
