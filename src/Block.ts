import Point from './Point';
import Size from './interfaces/Size';
import BlockConfig from './interfaces/BlockConfig';
import AbstractElement from './AbstractElement';

        // TODO: make blocks its own class - then can create more complex blocks
        //          -- blocks that need multiple hits to destroy
        //          -- blocks that drop rewards
        //          -- animations on hit

export default class Ball extends AbstractElement {
    public index: number;

    private domElement: SVGRectElement;
    private mountNode: SVGElement;
    private lives: number;

    public constructor( config:BlockConfig, mountNode:SVGElement ) {
        // TODO: make that cleaner
        super( config.point, config.size );
        if ( config.lives ) {
            this.lives = config.lives;
        } else {
            this.lives = 1;
        }
        // TODO: get this svg namespace string as a constant, for cross app consistency
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

        this.mountNode = mountNode
        this.mountNode.appendChild(this.domElement);
    }
    public destroy() {
        // TODO: add some cool animations on destroy
        this.mountNode.removeChild(this.domElement);
    }
    public setIndex( index:number ) {
        this.index = index;
    }
    public getHit():number{
        this.lives--;
        if (this.lives <= 0) {
            this.destroy();
        }
        return this.lives;
    }
}
