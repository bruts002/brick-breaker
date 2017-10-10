import Size from './Size';
import Vector from './Vector';

export default interface BlockConfig {
    point: Vector;
    size: Size;
    strength?: number;
}