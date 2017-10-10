import { SVGNAMESPACE } from './Constants';
import Vector from '../interfaces/Vector';
import Trajectory from './Trajectory';
import ballConfig from '../interfaces/BallConfig';
import Entity from './Entity';

export default class Ball extends Entity {

    constructor( ballConfig: ballConfig, mountNode: SVGElement ) {
        super( ballConfig.point, ballConfig.radius, ballConfig.trajectory, 'circle', mountNode );
    }
}
