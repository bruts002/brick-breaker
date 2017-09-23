import { SVGNAMESPACE } from './Constants';
import AbstractElement from './AbstractElement';
import Size from './interfaces/Size';
import Trajectory from './Trajectory';
import Point from './Point';

export default class Bullet extends AbstractElement {

    private lives:number;
    private traj:Trajectory;
    private mountNode:SVGElement;
    private domElement:SVGRectElement;

    public isDestroyed:Boolean;

    constructor( point:Point, mountNode:SVGElement ) {
        var size:Size = { width:1, height:3 };
        super( point, size );
        // TODO extend functionality for size, traj, etc
        this.traj = new Trajectory( { x:0, y:-9 } );
        this.lives = 1;
        this.mountNode = mountNode;

        this.domElement = document.createElementNS(
            SVGNAMESPACE,
            'rect'
        );
        this.domElement.setAttribute('x', String(this.point.x));
        this.domElement.setAttribute('y', String(this.point.y));
        this.domElement.setAttribute('width', String(this.size.width));
        this.domElement.setAttribute('height', String(this.size.height));
        this.domElement.setAttribute('fill', 'red');
        this.domElement.setAttribute('stroke', 'black');
        this.domElement.setAttribute('stroke-width', '0.5');

        this.isDestroyed = false;
        this.mountNode.appendChild(this.domElement);
    }
    public getNextPosition():Point {
        return {
            x: this.point.x + Math.sign(this.traj.x),
            y: this.point.y + Math.sign(this.traj.y)
        };
    }
    public getHit():number {
        this.lives--;
        if (this.lives <= 0) {
            this.destroy();
        }
        return this.lives;
    }
    public getSpeed( abs:Boolean ):number {
        return this.traj.getSpeed( abs )
    }
    public update():void {
        this.point = this.getNextPosition();
        this.domElement.setAttribute('x', String(this.point.x));
        this.domElement.setAttribute('y', String(this.point.y));
    }
    public destroy():void {
        // TODO: add some cool animations on destroy
        this.isDestroyed = true;
        this.mountNode.removeChild(this.domElement);
    }
}