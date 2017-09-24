import { SVGNAMESPACE } from './Constants';
import Size from '../interfaces/Size';
import AbstractElement from './AbstractElement';

export default class Paddle extends AbstractElement {

    private boardSize: Size;
    private domElement: SVGRectElement;
    private emitBullet: Function;

    constructor( size:Size, x:number, boardSize:Size, mountPoint:SVGElement, emitBullet:Function ) {
        var paddlePoint = {
            x,
            y:boardSize.height - size.height - 0.5
        };
        super( paddlePoint, size );
        /** Assuming the paddle is always bottom aligned */
        this.emitBullet = emitBullet;
        this.boardSize = boardSize;
        this.domElement = document.createElementNS(
            SVGNAMESPACE,
            'rect'
        );
        this.domElement.setAttribute('width', String(this.size.width));
        this.domElement.setAttribute('height', String(this.size.height));
        this.domElement.setAttribute('x', String(this.point.x));
        this.domElement.setAttribute('y', String(this.point.y));
        this.domElement.setAttribute('fill', 'gray');
        this.domElement.setAttribute('stroke', 'black');
        this.domElement.setAttribute('stroke-width', '0.5');
        mountPoint.appendChild(this.domElement);
    }

    public moveLeft():void {
        if ( this.point.x > 3 ) {
            this.point.x = this.point.x - 3;
            this.domElement.setAttribute('x', String(this.point.x));
        }
    }

    public moveRight():void {
        if ( this.point.x + this.size.width + 3 < this.boardSize.width ) {
            this.point.x = this.point.x + 3;
            this.domElement.setAttribute('x', String(this.point.x));
        }
    }

    public shoot():void {
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