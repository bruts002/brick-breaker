import Point from './Point';
import Size from './interfaces/Size';

export default class Ball {
    point: Point;
    size: Size;
    domElement: SVGRectElement;
    constructor( point:Point, size:Size ) {
        this.point = point;
        this.size = size;
        this.domElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            'rect'
        );
        this.domElement.setAttribute('x', String(this.point.x));
        this.domElement.setAttribute('y', String(this.point.y));
        this.domElement.setAttribute('width', String(this.size.width));
        this.domElement.setAttribute('height', String(this.size.height));
        this.domElement.setAttribute('fill', 'gray');
        this.domElement.setAttribute('stroke', 'black');
        this.domElement.setAttribute('stroke-width', '0.5');
    }
    attachTo( element:SVGElement ) {
        element.appendChild(this.domElement);
    }
    destroy( element:SVGElement ) {
        // TODO: add some cool animations on destroy
        element.removeChild(this.domElement);
    }
}
