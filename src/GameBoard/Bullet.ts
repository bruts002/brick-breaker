import { SVGNAMESPACE } from './Constants';
import Entity from './Entity';
import Size from '../interfaces/Size';
import Trajectory from './Trajectory';
import Vector from '../interfaces/Vector';

export default class Bullet extends Entity {

    private strength: number;
    public isDestroyed: Boolean;

    constructor( point: Vector, mountNode: SVGElement ) {
        let size: Size = { width: 1, height: 3 };
        let attributes = {
            'fill': 'red',
            'stroke': 'black',
            'stroke-width': '0.5'
        };
        super( point, size, { x: 0, y: -9 }, 'rect', mountNode, attributes );
        this.strength = 1;

        this.isDestroyed = false;
    }
    public getNextPosition(): Vector {
        return {
            x: this.point.x + Math.sign(this.traj.x),
            y: this.point.y + Math.sign(this.traj.y)
        };
    }
    public getStrength(): number {
        return this.strength;
    }
    public getHit( strength: number ): number {
        this.strength -= strength;
        if (this.strength <= 0) {
            this.destroy();
        }
        return this.strength;
    }
    public getSpeed( abs: Boolean ): number {
        return this.traj.getSpeed( abs );
    }
    public update(): void {
        this.point = this.getNextPosition();
        this.updateDOMPosition();
    }
    public destroy(): void {
        // TODO: add some cool animations on destroy
        this.isDestroyed = true;
        this.mountNode.removeChild(this.domElement);
    }
}