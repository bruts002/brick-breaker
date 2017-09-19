import Point from './Point';
import Size from './interfaces/Size';
import BlockConfig from './interfaces/BlockConfig';

        // TODO: make blocks its own class - then can create more complex blocks
        //          -- blocks that need multiple hits to destroy
        //          -- blocks that drop rewards
        //          -- animations on hit

export default class Ball {
    // TODO: write abstract class that Ball,Block,Paddle would extend
    // that has point,size and getter and setters for it
    // so that they can be private variables
    public point: Point;
    public size: Size;
    public index: number;

    private domElement: SVGRectElement;
    private mountNode:SVGElement;
    private lives: number;

    public constructor( config:BlockConfig, mountNode?:SVGElement ) {
        this.lives = 2;
        this.point = config.point;
        this.size = config.size;
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

        if (mountNode) {
            this.mountNode = mountNode;
            this.attachTo(mountNode);
        }
    }
    public attachTo( mountNode:SVGElement ) {
        this.mountNode = mountNode;
        mountNode.appendChild(this.domElement);
    }
    public destroy() {
        // TODO: add some cool animations on destroy
        this.mountNode.removeChild(this.domElement);
    }
    public setIndex( index:number ) {
        this.index = index;
    }
    public getHit():number{
        return --this.lives;
    }
}
