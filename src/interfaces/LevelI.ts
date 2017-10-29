import Size from './Size';
import BallConfig from './BallConfig';
import BlockConfig from './BlockConfig';
import PlayerConfig from './PlayerConfig';

interface LevelI {
    size: Size;
    blocks: Array<BlockConfig>;
    balls: Array<BallConfig>;
    paddle: PlayerConfig;
    guy: PlayerConfig;
}

export default LevelI;
