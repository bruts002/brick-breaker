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
    /**
     * get ball heading down
     * get lowest ball
     * move paddle towards balls x-axis
     */
    let downWardBalls: Array<Ball> = balls.filter( ball => {
        return ball.getTraj().y > 0;
    });
    if ( downWardBalls.length > 0 ) {
        let lowestBall: Ball = downWardBalls[0];
        downWardBalls.forEach( ball => {
            if ( ball.point.y > lowestBall.point.y )
                lowestBall = ball;
        });
        movePaddleToBall( paddle, lowestBall );
        return;
    } else { // all balls are going up
        /**
         * assume the ball at highest point will be going down next and follow that one
         */
        let highestBall: Ball = balls[0];
        balls.forEach( ball => {
            if ( ball.point.y < highestBall.point.y ) {
                highestBall = ball;
            }
        });
        movePaddleToBall( paddle, highestBall );
        return;
    }
}
function movePaddleToBall( paddle: Paddle, ball: Ball ) {
    if ( ball.point.x < paddle.point.x ) {
        paddle.moveLeft();
    } else if ( ball.point.x > paddle.point.x + paddle.getSize().width ) {
        paddle.moveRight();
    }
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
