import Point from './Point';
import Trajectory from './Trajectory';
import ballConfig from './interfaces/BallConfig';

export default class Ball {
    traj: Trajectory;
    point: Point;
    r: number;
    private domElement: SVGCircleElement;
    private mountPoint: SVGElement;

    constructor( ballConfig:ballConfig, mountPoint?:SVGElement ) {
        this.traj = new Trajectory(ballConfig.trajectory);
        this.point = ballConfig.point;
        this.r = ballConfig.radius;
        this.domElement = document.createElementNS( "http://www.w3.org/2000/svg", 'circle' );
        this.domElement.setAttribute('cx', String(this.point.x));
        this.domElement.setAttribute('cy', String(this.point.y));
        this.domElement.setAttribute('r', String(this.r));
        if ( mountPoint ) {
            mountPoint.appendChild(this.domElement );
        }
    }
    public invert( axis:any ) {
        this.traj.invert(axis);
    }
    public update( point:Point ) {
        this.point = point;
        this.updateDOM();
    }
    public updateDOM() {
        this.domElement.setAttribute('cx', String(this.point.x));
        this.domElement.setAttribute('cy', String(this.point.y));
    }
    public getNextPosition() {
        return {
            x: this.point.x + this.traj.x,
            y: this.point.y + this.traj.y
        };
    }
    public destroy( element:SVGElement ) {
        // TODO: add some cool animations on destroy
        element.removeChild(this.domElement);
    }
}
