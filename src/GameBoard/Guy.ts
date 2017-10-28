import Reward from '../interfaces/Reward';
import Size from '../interfaces/Size';
import Vector from '../interfaces/Vector';
import Entity from './Entity';

export default class Guy extends Entity {
    private static defaults = {
        moveAmount: 1
    }

    private moveAmount: number;
    public index: number;

    constructor( mountNode: SVGElement ) {
        super(
            { x: 11, y: 17 },
            { width: 3, height: 3 },
            { x: 0, y: 0 },
            'rect',
            mountNode,
            {
                'fill': 'gray',
                'stroke': 'black',
                'stroke-width': '0.5'
            }
        );
        this.moveAmount = Guy.defaults.moveAmount;
    }
    public moveLeft(): void {
        this.point.x -= this.moveAmount;
        this.updateDOMPosition();
    }
    public moveRight(): void {
        this.point.x += this.moveAmount;
        this.updateDOMPosition();
    }
    public moveUp(): void {
        this.point.y -= this.moveAmount;
        this.updateDOMPosition();
    }
    public moveDown(): void {
        this.point.y += this.moveAmount;
        this.updateDOMPosition();
    }

    // TODO: implement functions below
    public applyReward( reward: Reward ): void { }
    public getHit( str: number ): number { return 1; }
    public setIndex( index: number ): void { this.index = index; }
    public useReward(): void { }
}
