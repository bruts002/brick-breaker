import Size from './Size';
import Vector from './Vector';
import Reward from './Reward';

interface BlockConfig {
    point: Vector;
    size: Size;
    strength?: number;
    reward?: Reward;
}

export default BlockConfig;
