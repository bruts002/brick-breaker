import Size from './interfaces/Size';

export default class Paddle {
    size:Size;
    x: number;
    y: number;
    boardSize: Size;
    domElement: SVGRectElement;
    constructor(size:Size, x:number, boardSize:Size, attachPoint:SVGElement) {
        this.size = size;
        this.x = x;
        /** Assuming the paddle is always bottom aligned */
        this.y = boardSize.height - size.height;
        this.boardSize = boardSize;
        this.domElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            'rect'
        );
        this.domElement.setAttribute('width', String(this.size.width));
        this.domElement.setAttribute('height', String(this.size.height));
        this.domElement.setAttribute('x', String(this.x));
        this.domElement.setAttribute('y', String(this.y));
        this.domElement.setAttribute('fill', 'gray');
        this.domElement.setAttribute('stroke', 'black');
        this.domElement.setAttribute('stroke-width', '0.5');
        attachPoint.appendChild(this.domElement);
    }
    move(direction:string):void {
        if (direction === 'left' && this.x > 0) {
            this.x = this.x - 3;
            this.domElement.setAttribute('x', String(this.x));
        } else if (direction === 'right' && this.y < this.boardSize.width) {
            this.x = this.x + 3;
            this.domElement.setAttribute('x', String(this.x));
        }
    }
}