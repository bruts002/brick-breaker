import { SVGNAMESPACE } from './Constants';
import Vector from '../interfaces/Vector';
import Size from '../interfaces/Size';
import Trajectory from './Trajectory';

export default class Entity {

    public point: Vector;
    protected size: Size;
    protected radius: number;
    protected traj: Trajectory;
    protected type: 'circle'|'rect';
    protected domElement: SVGElement;
    protected mountNode: SVGElement;

    public constructor(
        point: Vector,
        size: Size|number,
        traj: Vector,
        type: 'circle'|'rect',
        mountNode: SVGElement,
        attributes?: Object
    ) {
        this.domElement = document.createElementNS( SVGNAMESPACE, type );
        this.type = type;
        this.point = point;
        this.domElement.setAttribute( 'x', String( this.point.x ) );
        this.domElement.setAttribute( 'y', String( this.point.y ) );
        this.traj = new Trajectory( traj );
        if ( this.type === 'circle' ) {
            this.radius = +size;
            this.domElement.setAttribute( 'r', String( this.radius ) );
        } else {
            this.size = <Size>size;
            this.domElement.setAttribute( 'width', String( this.size.width ) );
            this.domElement.setAttribute( 'height', String( this.size.height ) );
        }
        if ( attributes !== undefined ) {
            Object.keys(attributes).forEach( key =>
                this.domElement.setAttribute( key, String( attributes[key] ))
            );
        }

        this.mountNode = mountNode;
        this.mountNode.appendChild( this.domElement );
    }

    public destroy() {
        this.mountNode.removeChild( this.domElement );
    }

    public updateDOMPosition( newPoint?: Vector ) {
        let xAttr: string = '';
        let yAttr: string = '';
        if ( newPoint !== undefined ) {
            this.point = newPoint;
        }
        if ( this.type === 'circle' ) {
            xAttr = 'cx';
            yAttr = 'cy';
        } else if ( this.type === 'rect' ) {
            xAttr = 'x';
            yAttr = 'y';
        }
        this.domElement.setAttribute( xAttr, String( this.point.x ) );
        this.domElement.setAttribute( yAttr, String( this.point.y ) );
    }

    public invertTraj( axis: 'x'|'y' ) {
        this.traj.invert( axis );
    }

    public getNextPosition() {
        return {
            x: this.point.x + this.traj.x,
            y: this.point.y + this.traj.y
        };
    }

    public getPoint(): Vector {
        return this.point;
    }

    public getSize(): Size {
        return this.size;
    }

}