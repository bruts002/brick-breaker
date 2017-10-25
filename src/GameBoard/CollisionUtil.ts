import Vector from '../interfaces/Vector';
import Size from '../interfaces/Size';

function hitsIt(pointX: number, blockStart: number, width: number): boolean {
    let val: number = (blockStart + width) - pointX;
    return val >= 0 && val <= width;
}
// TODO: make isCollision be abstract, taking input Types (block|ball|paddle)
//      and delegating work to functions that handle that case
function isCollision(p1: Vector, p2: Vector, p2Size: Size): boolean {
    return hitsIt(p1.x, p2.x, p2Size.width) &&
           hitsIt(p1.y, p2.y, p2Size.height);
}

function isNear( circlePoint: Vector, blockPoint: Vector, blockSize: Size ): Boolean {
    // TODO: This will have to change when the ball can be different radius
    const ballRadius: number = 3;
    const blockDist = Math.max( blockSize.width, blockSize.height );
    const distance: number = getDistance( circlePoint, blockPoint );
    return distance <= blockDist + ballRadius;
}

function getDistance( p1: Vector, p2: Vector ): number {
    const distX = p1.x - p2.x;
    const distY = p1.y - p2.y;
    return Math.sqrt(
        (distX) * (distX) +
        (distY) * (distY)
    );
}

export default {
    isCollision,
    isNear,
    getDistance
};
