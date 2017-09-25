import Size from '../../interfaces/Size';
import Point from '../Point';

export default interface BlockConfig {
    point: Point,
    size: Size,
    strength?: number
}