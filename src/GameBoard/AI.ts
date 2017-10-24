import Paddle from './Paddle';
import Player from './Player';

function buildPaddle( mountNode: SVGElement ): Paddle {
    return new Paddle(
        { width: 0, height: 0 },
        mountNode,
        function() {}
    );
}
function buildPlayer( mountNode: SVGElement ): Player {
    return new Player();
}
export default {
    buildPaddle,
    buildPlayer
};
