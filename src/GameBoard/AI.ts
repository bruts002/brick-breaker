import Paddle from './Paddle';
import Guy from './Guy';
import Ball from './Ball';
import Reward from './Reward';
import Entity from './Entity';

import Size from '../interfaces/Size';

function makeMove( ai: Paddle|Guy, balls: Array<Ball>, rewards: Array<Reward> ): void {
    if ( ai instanceof Paddle ) {
        makePaddleMove( ai, balls, rewards );
    } else if ( ai instanceof Guy ) {
        makeGuyMove( ai );
    }
}
function getNextEntity( balls: Array<Ball>, rewards: Array<Reward> ): Entity {
    /**
     * get balls heading down
     * get lowest ball
     */
    let downWardBalls: Array<Ball> = balls.filter( ball => {
        return ball.getTraj().y > 0;
    });
    if ( downWardBalls.length > 0 ) {
        return getLowestEntity( downWardBalls );
    } else { // all balls are going up
        /**
         * go for the reward if present otherwise,
         * assume the ball at highest point will be going down next and follow that one
         */
        if ( rewards.length > 0 ) {
            return getLowestEntity( rewards );
        } else {
            return getHighestEntity( balls );
        }
    }
}
function makePaddleMove( paddle: Paddle, balls: Array<Ball>, rewards: Array<Reward> ): void {
    // always try using reward
    paddle.useReward();
    const nextOne = getNextEntity( balls, rewards );
    const nextOneAfter = getNextEntity(
        balls.filter( ball => ball !== nextOne ),
        rewards.filter( reward => reward !== nextOne )
    );
    movePaddleToEntity(
        paddle,
        nextOne,
        nextOneAfter
    );
}
function getHighestEntity( entities: Array<Entity> ): Entity {
    let highestEntity: Entity = entities[0];
    entities.forEach( entity => {
        if ( highestEntity.point.y < entity.point.y )
            highestEntity = entity;
    });
    return highestEntity;
}
function getLowestEntity( entities: Array<Entity> ): Entity {
    let lowestEntity: Entity = entities[0];
    entities.forEach( entity => {
        if ( lowestEntity.point.y > entity.point.y )
            lowestEntity = entity;
    });
    return lowestEntity;
}
function movePaddleToEntity( paddle: Paddle, entity: Entity, nextEntity?: Entity ) {
    if ( isLeft( entity, paddle ) ) {
        paddle.moveLeft();
    } else if ( isRight( entity, paddle ) ) {
        paddle.moveRight();
    } else {
        // paddle is aligned properly, see if can move to anticipate next element, without losing the current element
    }
}
function isLeft( entity: Entity, paddle: Paddle ): boolean {
    return entity.point.x <= paddle.point.x;
}
function isRight( entity: Entity, paddle: Paddle): boolean {
    return entity.point.x >= paddle.point.x + paddle.getSize().width;
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
