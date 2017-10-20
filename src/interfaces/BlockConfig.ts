import Size from './Size';
import Vector from './Vector';
import Reward from './Reward';

export default interface BlockConfig {
    point: Vector;
    size: Size;
    strength?: number;
    reward?: Reward;
}