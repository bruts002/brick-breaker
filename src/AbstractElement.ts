import Point from './Point';
import Size from './interfaces/Size';

export default class AbstractClass {
    protected point:Point;
    protected size:Size;

    public constructor( point:Point, size:Size ) {
        this.point = point;
        this.size = size;
    }

    public getPoint():Point {
        return this.point;
    }

    public getSize():Size {
        return this.size;
    }

}