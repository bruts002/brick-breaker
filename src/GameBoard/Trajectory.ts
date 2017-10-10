import Vector  from '../interfaces/Vector';
export default class Trajectory {
    public x: number;
    public y: number;
    constructor( point: Vector ) {
        this.x = point.x;
        this.y = point.y;
    }
    public invert( axis: 'x'|'y' ) {
        this[axis] = this[axis] * -1;
    }
    public speed( val: number ) {
        this.x = this.x > 0 ? this.x + val : this.x - val;
        this.y = this.y > 0 ? this.y + val : this.y - val;
    }
    public getSpeed( abs: Boolean ): number {
        let hyp: number = Math.hypot( this.x, this.y );
        return abs ? Math.abs( hyp ) : hyp;
    }
}