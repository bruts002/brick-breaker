import Paddle from './Paddle';
import Guy from './Guy';
import Ball from './Ball';

import Size from '../interfaces/Size';

function makeMove( ai: Paddle|Guy, balls: Array<Ball>, size: Size ): void {
    if ( ai instanceof Paddle ) {
        makePaddleMove( ai, balls, size );
    } else if ( ai instanceof Guy ) {
        makeGuyMove( ai );
    }
}
function makePaddleMove( paddle: Paddle, balls: Array<Ball>, size: Size ): void {
    let nextBall: Ball;
    paddle.moveRight();
}
function makeGuyMove( guy: Guy ): void {

}
function buildPaddle( size: Size, mountNode: SVGElement, emitBullet: Function ): Paddle {
    return new Paddle(
        size,
        mountNode,
        emitBullet
    );
}
function buildGuy( mountNode: SVGElement ): Guy {
    return new Guy();
}
export default {
    buildPaddle,
    buildGuy,
    makeMove
};
