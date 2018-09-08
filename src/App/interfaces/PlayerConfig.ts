import Vector from './Vector';
import Size from './Size';

interface PlayerConfig {
    position: Vector;
    size: Size;
    attributes?: Object;
    speed?: number;
}

export default PlayerConfig;
