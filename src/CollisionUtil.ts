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

export default {
    isCollision
}