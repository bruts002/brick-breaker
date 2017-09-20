import Size from './interfaces/Size';
import AbstractElement from './AbstractElement';

export default class Paddle extends AbstractElement {

    private boardSize: Size;
    private domElement: SVGRectElement;

    constructor( size:Size, x:number, boardSize:Size, mountPoint:SVGElement ) {
        var paddlePoint = {
            x,
            y:boardSize.height - size.height - 0.5
        };
        super( paddlePoint, size );
        /** Assuming the paddle is always bottom aligned */
        this.boardSize = boardSize;
        this.domElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
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
    public move(direction:string):void {
        if (direction === 'left' && this.point.x > 3) {
            this.point.x = this.point.x - 3;
            this.domElement.setAttribute('x', String(this.point.x));
        } else if (direction === 'right' && this.point.x + this.size.width + 3 < this.boardSize.width) {
            this.point.x = this.point.x + 3;
            this.domElement.setAttribute('x', String(this.point.x));
        }
    }
}