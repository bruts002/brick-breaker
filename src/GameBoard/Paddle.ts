import { SVGNAMESPACE } from './Constants';
import Size from '../interfaces/Size';
import Entity from './Entity';

export default class Paddle extends Entity {

    private boardSize: Size;
    private emitBullet: Function;

    constructor( size: Size, x: number, boardSize: Size, mountNode: SVGElement, emitBullet: Function ) {
        let paddlePoint = {
            x,
            y: boardSize.height - size.height - 0.5
        };
        let attributes = {
            'fill': 'gray',
            'stroke': 'black',
            'stroke-width': '0.5'
        };
        super( paddlePoint, size, { x: 0, y: 0 }, 'rect', mountNode, attributes );
        /** Assuming the paddle is always bottom aligned */
        this.emitBullet = emitBullet;
        this.boardSize = boardSize;
    }

    public moveLeft(): void {
        if ( this.point.x > 3 ) {
            this.point.x = this.point.x - 3;
            this.updateDOMPosition();
        }
    }

    public moveRight(): void {
        if ( this.point.x + this.size.width + 3 < this.boardSize.width ) {
            this.point.x = this.point.x + 3;
            this.updateDOMPosition();
        }
    }

    public shoot(): void {
        this.emitBullet({
            x: this.point.x,
            y: this.point.y - 3
        });
        this.emitBullet({
            x: this.point.x + this.size.width,
            y: this.point.y - 3
        });
    }
}