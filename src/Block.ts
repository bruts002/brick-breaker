import { SVGNAMESPACE } from './Constants';
import Point from './Point';
import Size from './interfaces/Size';
import BlockConfig from './interfaces/BlockConfig';
import AbstractElement from './AbstractElement';

// TODO: 
// -- blocks that drop rewards
// -- animations on hit

export default class Ball extends AbstractElement {
    public index: number = -1;

    private domElement: SVGRectElement;
    private mountNode: SVGElement;
    private strength: number;

    public constructor( config:BlockConfig, mountNode:SVGElement ) {
        super( config.point, config.size );
        if ( config.strength ) {
            this.strength = config.strength;
        } else {
            this.strength = 1;
        }
        this.domElement = document.createElementNS(
            SVGNAMESPACE,
            'rect'
        );
        this.domElement.setAttribute('x', String(this.point.x));
        this.domElement.setAttribute('y', String(this.point.y));
        this.domElement.setAttribute('width', String(this.size.width));
        this.domElement.setAttribute('height', String(this.size.height));
        this.domElement.setAttribute('fill', 'gray');
        this.domElement.setAttribute('stroke', 'black');
        this.domElement.setAttribute('stroke-width', '0.5');

        this.mountNode = mountNode
        this.mountNode.appendChild(this.domElement);
    }
    public destroy() {
        this.mountNode.removeChild(this.domElement);
    }
    public setIndex( index:number ) {
        this.index = index;
    }
    public getStrength():number {
        return this.strength;
    }
    public getHit( strength:number ):number{
        this.strength -= strength;
        if (this.strength <= 0) {
            this.destroy();
        }
        return this.strength;
    }
}
