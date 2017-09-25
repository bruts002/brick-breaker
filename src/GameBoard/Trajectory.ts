import Point from './Point';
export default class Trajectory {
    x: number;
    y: number;
    // TODO should not use Point, but create a Vector class/type and use that
    constructor(point: Point) {
        this.x = point.x;
        this.y = point.y;
    }
    invert(axis: string) {
        this[axis] = this[axis] * -1;
    }
    speed(val: number) {
        this.x = this.x > 0 ? this.x + val : this.x - val;
        this.y = this.y > 0 ? this.y + val : this.y - val;
    }
    public getSpeed( abs: Boolean ): number {
        let hyp: number = Math.hypot( this.x, this.y );
        return abs ? Math.abs( hyp ) : hyp;
    }
}