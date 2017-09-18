import Point from './Point';
import Trajectory from './Trajectory';
import ballConfig from './interfaces/BallConfig';

export default class Ball {
    traj: Trajectory;
    point: Point;
    r: number;
    domElement: SVGCircleElement;
    constructor( ballConfig:ballConfig ) {
        this.traj = new Trajectory(ballConfig.trajectory);
        this.point = ballConfig.point;
        this.r = ballConfig.radius;
        this.domElement = document.createElementNS( "http://www.w3.org/2000/svg", 'circle' );
        this.domElement.setAttribute('cx', String(this.point.x));
        this.domElement.setAttribute('cy', String(this.point.y));
        this.domElement.setAttribute('r', String(this.r));
    }
    attachTo( element:SVGElement ) {
        element.appendChild(this.domElement);
    }
    invert( axis:any ) {
        this.traj.invert(axis);
    }
    update( point:Point ) {
        this.point = point;
        this.updateDOM();
    }
    updateDOM() {
        this.domElement.setAttribute('cx', String(this.point.x));
        this.domElement.setAttribute('cy', String(this.point.y));
    }
    getNextPosition() {
        return {
            x: this.point.x + this.traj.x,
            y: this.point.y + this.traj.y
        };
    }
    destroy( element:SVGElement ) {
        // TODO: add some cool animations on destroy
        element.removeChild(this.domElement);
    }
}
