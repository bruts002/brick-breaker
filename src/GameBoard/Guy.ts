import Reward from '../interfaces/Reward';
import Size from '../interfaces/Size';
import Vector from '../interfaces/Vector';
import PlayerConfig from '../interfaces/PlayerConfig';
import Entity from './Entity';
import Controllable from '../interfaces/Controllable';

export default class Guy extends Entity implements Controllable {
    private static defaults = {
        speed: 1,
        attributes: {
            'fill': 'gray',
            'stroke': 'black',
            'stroke-width': '0.5'
        }
    }

    private speed: number;
    public index: number;

    constructor(
        mountNode: SVGElement,
        guyConfig: PlayerConfig
    ) {
        super(
            guyConfig.position,
            guyConfig.size,            
            { x: 0, y: 0 },
            'rect',
            mountNode,
            guyConfig.attributes || Guy.defaults.attributes    
        );
        this.speed = guyConfig.speed || Guy.defaults.speed;
    }
    public moveLeft(): void {
        this.point.x -= this.speed;
        this.updateDOMPosition();
    }
    public moveRight(): void {
        this.point.x += this.speed;
        this.updateDOMPosition();
    }
    public moveUp(): void {
        this.point.y -= this.speed;
        this.updateDOMPosition();
    }
    public moveDown(): void {
        this.point.y += this.speed;
        this.updateDOMPosition();
    }

    // TODO: implement functions below
    public applyReward( reward: Reward ): void { }
    public getHit( str: number ): number { return 1; }
    public setIndex( index: number ): void { this.index = index; }
    public useReward(): void { }
}
