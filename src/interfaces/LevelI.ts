import Size from './Size';
import BallConfig from './BallConfig';
import BlockConfig from './BlockConfig';

export default interface LevelI {
    size: Size;
    blocks: Array<BlockConfig>;
    balls: Array<BallConfig>;
}
