import Point from './Point';
import Size from './interfaces/Size';

function hitsIt(pointX:number, blockStart:number, width:number):boolean {
    var val:number = (blockStart + width) - pointX;
    return val >= 0 && val <= width;
}
// TODO: make isCollision be abstract, taking input Types (block|ball|paddle)
//      and delegating work to functions that handle that case
function isCollision(p1:Point, p2:Point, p2Size:Size):boolean {
    return hitsIt(p1.x, p2.x, p2Size.width) &&
           hitsIt(p1.y, p2.y, p2Size.height);
}

function isNear( circlePoint:Point, blockPoint:Point, blockSize:Size ):Boolean {
    // TODO: This will have to change when the ball can be different radius
    const ballRadius:number = 3; 
    const blockDist = Math.max( blockSize.width, blockSize.height );
    const distX = circlePoint.x - blockPoint.x;
    const distY = circlePoint.y - blockPoint.y;
    const distance:number = Math.sqrt(
        (distX) * (distX) +
        (distY) * (distY)
    );
    return distance <= blockDist + ballRadius;
}

export default {
    isCollision,
    isNear
}