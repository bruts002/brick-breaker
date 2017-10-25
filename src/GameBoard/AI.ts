import Paddle from './Paddle';
import Guy from './Guy';
import Ball from './Ball';
import Reward from './Reward';
import Entity from './Entity';
import CollisionUtil from './CollisionUtil';

import Vector from '../interfaces/Vector';
import Size from '../interfaces/Size';

/**
 * TODO: scoring for the AI
 *  each paddle move is bad
 *  each power up use is bad
 *  each power up switch is bad
 *  each ball drop is bad
 */

function makeMove( ai: Paddle|Guy, balls: Array<Ball>, rewards: Array<Reward>, size: Size ): void {
    if ( ai instanceof Paddle ) {
        makePaddleMove( ai, balls, rewards, size );
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
function makePaddleMove( paddle: Paddle, balls: Array<Ball>, rewards: Array<Reward>, size: Size ): void {
    // always try using reward
    paddle.useReward();
    const nextOne = getNextEntity( balls, rewards );
    const nextOneAfter = getNextEntity(
        balls.filter( ball => ball !== nextOne ),
        rewards.filter( reward => reward !== nextOne )
    ) || nextOne;
    movePaddleToEntity(
        paddle,
        nextOne,
        size,
        nextOneAfter
    );
}
function getHighestEntity( entities: Array<Entity> ): Entity {
    let highestEntity: Entity = entities[0];
    entities.forEach( entity => {
        if ( highestEntity.point.y > entity.point.y )
            highestEntity = entity;
    });
    return highestEntity;
}
function getLowestEntity( entities: Array<Entity> ): Entity {
    let lowestEntity: Entity = entities[0];
    entities.forEach( entity => {
        if ( lowestEntity.point.y < entity.point.y )
            lowestEntity = entity;
    });
    return lowestEntity;
}
function movePaddleToEntity( paddle: Paddle, entity: Entity, size: Size, nextEntity?: Entity ) {
    const nxtPoint: Vector = getEntityDropPoint( entity, size );
    const nxtNxtPoint: Vector = getEntityDropPoint( nextEntity, size );
    if ( isLeft( nxtPoint, paddle ) ) {
        paddle.moveLeft();
    } else if ( isRight( nxtPoint, paddle ) ) {
        paddle.moveRight();
    } else if ( entity !== nextEntity ) {
        // TODO: paddle is aligned properly, see if can move to anticipate next element, without losing the current element
        if ( isLeft( nxtNxtPoint, paddle ) &&
             CollisionUtil.isCollision( nxtPoint, { x: paddle.nextLeft(), y: 0 }, paddle.getSize() )
        ) {
                paddle.moveLeft();
        } else if ( isRight( nxtNxtPoint, paddle ) &&
                    CollisionUtil.isCollision( nxtPoint, { x: paddle.nextRight(), y: 0 }, paddle.getSize() )
        ) {
                paddle.moveRight();
        }
    } else {
        // TODO: only one entity left, predict its next fall
    }
}
function getEntityDropPoint( entity: Entity, boardSize: Size ): Vector {
    // naive algorithm that ignores blocks
    const traj: Vector = entity.getTraj();
    const point: Vector = entity.getPoint();
    let movesTillHit: number = 0;
    let xCoord: number = point.x;
    let xOverFlow: number = 0;
    if ( traj.y > 0 ) {
        movesTillHit = ( boardSize.height - point.y ) / traj.y;
    } else {
        movesTillHit = ( ( 2 * point.y ) + ( boardSize.height - point.y ) ) / Math.abs( traj.y );
    }

    xCoord = point.x + ( traj.x * movesTillHit );
    xOverFlow = xCoord - boardSize.width;
    if ( xOverFlow > 0 ) {
        xCoord -= xOverFlow * 2;
    }

    return {
        x: Math.abs( xCoord ),
        y: 0
    };
}
function isLeft( point: Vector, paddle: Paddle ): boolean {
    return point.x <= paddle.point.x;
}
function isRight( point: Vector, paddle: Paddle): boolean {
    return point.x >= paddle.point.x + paddle.getSize().width - 1;
}
function makeGuyMove( guy: Guy ): void {

}
export default {
    makeMove
};
