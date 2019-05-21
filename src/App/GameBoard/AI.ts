import Paddle from './Paddle';
import Guy from './Guy';
import Ball from './Ball';
import Reward from './Reward';
import Entity from './Entity';
import { isCollision } from './CollisionUtil';

import Vector from '../interfaces/Vector';
import Size from '../interfaces/Size';
import LinePosI from '../interfaces/LinePos';

/**
 * TODO: scoring for the AI
 *  each paddle move is bad
 *  each power up use is bad
 *  each power up switch is bad
 *  each ball drop is bad
 */

function makeMove( ai: Paddle|Guy, balls: Array<Ball>, rewards: Array<Reward>, size: Size ): LinePosI[] {
    if ( ai instanceof Paddle ) {
        return makePaddleMove( ai, balls, rewards, size );
    } else if ( ai instanceof Guy ) {
        makeGuyMove( ai, balls, size );
    }
}
function likelyToFallFirst( a: Entity, b: Entity ): -1|0|1 {
    const aTraj = a.getTraj();
    const bTraj = b.getTraj();
    const aY = a.getPoint().y;
    const bY = b.getPoint().y;

    // if only one is heading down return that one
    if ( aTraj.y > 0 && bTraj.y < 0) return -1;
    if ( bTraj.y > 0 && aTraj.y < 0) return 1;

    // if both are heading down return the lower one
    if ( bTraj.y > 0 && aTraj.y > 0) return aY > bY ? -1 : 1;

    // if both are heading up return the higher one
    if ( bTraj.y < 0 && aTraj.y < 0) return aY > bY ? 1 : -1;

    // default case
    return -1;
}
function catchable( entity: Entity, paddle: Paddle, size: Size ): boolean {
    const paddleSize: Size = paddle.getSize();
    const dropPoint: Vector = getEntityDropPoint( entity, size, paddleSize.height );
    if ( !isLeft( dropPoint, paddle) && !isRight( dropPoint, paddle ) ) return true;
    const movesTillDrop: number = getMovesTillDrop( entity, size.height, paddleSize.height );
    const nearestPaddlePoint: number = dropPoint.x > paddle.point.x ? paddle.point.x + paddleSize.width : paddle.point.x;
    const distance: number = Math.abs( nearestPaddlePoint - dropPoint.x );
    return ( paddle.moveAmount * movesTillDrop ) > distance;
}
function makePaddleMove( paddle: Paddle, balls: Array<Ball>, rewards: Array<Reward>, size: Size ): LinePosI[] {
    // TODO: don't always try to use reward
    paddle.useReward();
    const entitiesToGoFor: Array<Entity> = balls//.concat( rewards )
        .filter( e => catchable( e, paddle, size ) )
        .sort( likelyToFallFirst );
    return movePaddleToEntity(
        paddle,
        entitiesToGoFor,
        size
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

function getLineCoords(entity: Entity, boardSize: Size): LinePosI[] {
    const lines: LinePosI[] = [];
    let current: Vector = entity.point;
    let traj: Vector = { ...entity.getTraj() };
    while (current.y !== boardSize.height) getLine();
    return lines;

    function getLine() {
        const d2x: number = traj.x > 0 ? boardSize.width - current.x : current.x;
        const d2y: number = traj.y > 0 ? boardSize.height - current.y : current.y;
        const end: Vector = {x: 0, y: 0};
        if (d2x < d2y) {
            end.x = traj.x > 0 ? boardSize.width : 0;
            end.y = current.y + (traj.y > 0 ? 1 : -1) * (d2x);
            traj.x = -traj.x;
        } else {
            end.x = current.x + (traj.x > 0 ? 1 : -1) * (d2y);
            end.y = traj.y > 0 ? boardSize.height : 0;
            traj.y = -traj.y;
        }
        lines.push({
            x1: current.x,
            y1: current.y,
            x2: end.x,
            y2: end.y
        });
        current = { ...end };
    }
}

function movePaddleToEntity( paddle: Paddle, entities: Array<Entity>, size: Size ): LinePosI[] {
    if ( entities.length === 0 ) return;
    const paddleHeight: number = paddle.getSize().height;
    const onlyOneLeft: boolean = entities.length === 1;
    const nxtPoint: Vector = getEntityDropPoint( entities[0], size, paddleHeight );
    const nxtNxtPoint: Vector = onlyOneLeft ? nxtPoint : getEntityDropPoint( entities[1], size, paddleHeight );
    if ( isLeft( nxtPoint, paddle ) || canAndShouldMoveLeft( nxtNxtPoint, nxtPoint, paddle ) ) {
        paddle.moveLeft();
    } else if ( isRight( nxtPoint, paddle ) || canAndShouldMoveRight( nxtNxtPoint, nxtPoint, paddle ) ) {
        paddle.moveRight();
    }
    return getLineCoords(entities[0], size);
}

// function getNextMove( entity: Entity, dropPoint: Vector ): Entity {
//     const traj: Vector = entity.getTraj();
//     return new Entity (
//         dropPoint,
//         entity.getSize(),
//         { x:traj.x, y: traj.y * -1 },
//         'circle',
//         SVGElement.prototype
//     );
// }

function canAndShouldMoveLeft( candidate: Vector, current: Vector, paddle: Paddle): boolean {
    return isLeft( candidate, paddle ) &&
           isCollision( current,
                        { x: paddle.nextLeft(), y: paddle.point.y },
                        paddle.getSize()
           );
}

function canAndShouldMoveRight( candidate: Vector, current: Vector, paddle: Paddle ): boolean {
    return isRight( candidate, paddle ) &&
           isCollision( current,
                        { x: paddle.nextRight(), y: paddle.point.y },
                        paddle.getSize()
           );
}

function getMovesTillDrop( entity: Entity, boardHeight: number, paddleHeight: number ): number {
    const traj: Vector = entity.getTraj();
    const movesUpAndDown: number = traj.y > 0 ? 0 : 2 * entity.point.y;
    const movesTillPaddle: number = boardHeight - paddleHeight - entity.point.y;
    return ( movesUpAndDown + movesTillPaddle) / Math.abs( traj.y );
}
function getEntityDropPoint( entity: Entity, boardSize: Size, paddleHeight: number ): Vector {
    // naive algorithm that ignores blocks
    const traj: Vector = entity.getTraj();
    const point: Vector = entity.getPoint();
    const movesTillHit: number = getMovesTillDrop( entity, boardSize.height, paddleHeight );
    let xCoord: number = point.x + ( traj.x * movesTillHit );
    const xOverFlow: number = xCoord - boardSize.width;

    if ( xOverFlow > 0 ) {
        xCoord -= xOverFlow * 2;
    }

    return {
        x: Math.abs( xCoord ),
        y: boardSize.height - paddleHeight - 0.5
    };
}
function isLeft( point: Vector, paddle: Paddle ): boolean {
    return point.x <= paddle.point.x;
}
function isRight( point: Vector, paddle: Paddle): boolean {
    return point.x >= paddle.point.x + paddle.getSize().width - 1;
}
function makeGuyMove( guy: Guy, balls: Array<Ball>, size: Size ): void {

}
export default {
    makeMove
};
