import Point from './Point';
import Trajectory from './Trajectory';
import Ball from './Ball';
import ballConfig from './interfaces/BallConfig';
import Size from './interfaces/Size';
import Paddle from './Paddle';

function hitsIt(pointX:number, blockStart:number, width:number):boolean {
    var val = (blockStart + width) - pointX;
    return val >= 0 && val <= width;
}
// TODO replace calls to `hitsIt` with `isCollision` and test
// TODO: make isCollision be abstract, taking input Types (block|ball|paddle)
//      and delegating work to functions that handle that case
function isCollision(p1:Point, p2:Point, size:Size):boolean {
    var xDif:number = (p2.x + size.width) - p1.x;
    var xCollide:boolean = xDif >= 0 && xDif <= size.width;
    var yDif:number = (p2.y + size.height) - p2.y;
    var yCollide:boolean = yDif >= 0 && yDif <= size.height;
    return xCollide && yCollide;
}
export default class GameBoard {
    balls: Array<Ball>;
    size:Size;
    domElement: SVGElement;
    renderedBlocks: Array<SVGRectElement>;
    paddle: Paddle;

    constructor(size:Size, domNode:HTMLElement) {
        this.balls = [];
        this.size = size;

        this.domElement = document.createElementNS( "http://www.w3.org/2000/svg", 'svg' );
        this.domElement.setAttribute('width',' 100%');
        this.domElement.setAttribute('height', '100%');
        this.domElement.setAttribute('viewBox', '0 0 ' + this.size.width + ' ' + this.size.height );
        // TODO: use classes instead of inline styles
        this.domElement.setAttribute('style', 'border:1px solid black;');
        domNode.appendChild(this.domElement);
    }
    init(blocks:Array<Point>, balls:Array<ballConfig>):void {
        // build stuff
        this.renderedBlocks = this.renderBlocks(blocks);
        this.balls = this.renderBalls(balls);
        this.paddle = this.buildPaddle(9,3);

        // add listeners for events
        document.body.addEventListener('keydown', this.keyDownHandler.bind(this));


        // start it up
        setInterval(this.update.bind(this), 50);
    }
    buildPaddle(paddleWidth:number, paddleHeight:number) {
        var paddleSize:Size = {
            width: paddleWidth,
            height: paddleHeight
        };
        return new Paddle(
            paddleSize,
            (this.size.width - paddleWidth)/2,
            this.size,
            this.domElement
        );
    }
    buildBall(ballConfig:ballConfig):Ball {
        var ball = new Ball(ballConfig);
        ball.attachTo(this.domElement);
        return ball;
    }
    renderBalls(balls:Array<ballConfig>):Array<Ball> {
        var builtBalls = balls.map(this.buildBall, this);
        return builtBalls;
    }
    renderBlocks(blocks:Array<Point>) {
        // TODO: make blocks its own class - then can create more complex blocks
        //          -- blocks that need multiple hits to destroy
        //          -- blocks that drop rewards
        //          -- animations on hit
        return blocks.map(this.renderBlock, this);
    }
    renderBlock(block:Point):SVGRectElement {
        // TODO: use Block class
        var rect:SVGRectElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            'rect'
        );

        rect.setAttribute('x', String(block.x));
        rect.setAttribute('y', String(block.y));
        rect.setAttribute('width', '3');
        rect.setAttribute('height', '3');
        rect.setAttribute('fill', 'gray');
        rect.setAttribute('stroke', 'black');
        rect.setAttribute('stroke-width', '0.5');
        this.domElement.appendChild(rect);
        return rect;
    }
    destroyBlock(block:SVGRectElement):void {
        this.renderedBlocks.splice( Number(block.getAttribute('index')), 1 );
        this.domElement.removeChild(block);
    }
    getBlock(point:Point):SVGRectElement {
        var block:SVGRectElement;
        this.renderedBlocks.some((b:SVGRectElement, i:number) => {
            var blockX:number = +b.getAttribute('x'),
                blockY:number = +b.getAttribute('y'),
                width:number = +b.getAttribute('width'),
                height:number = +b.getAttribute('height');
            
            if (hitsIt(point.x, blockX, width) &&
                hitsIt(point.y, blockY, height)) {
                block = b;
                block.setAttribute('index', String(i));
            }
            return Boolean(block);
        });
        return block;
    }
    update():void {
        this.updateBalls();
        // TODO: if blocks can move then need this
        // this.updateBlocks();
    }
    updateBalls():void {
        var ballsToDelete:Array<number> = [],
            offset:number;
        // for each ball
        // get new pos
        // check pos
        //  destroy block if needed
        //  destroy ball if needed
        //  invert trajectory
        // send new pos
        this.balls.forEach(function(ball:Ball, index:number) {
            var nxtPos:Point = ball.getNextPosition(),
                hitBlockX:boolean,
                hitBlockY:boolean,
                block:Point;
            if (nxtPos.x < 0 || nxtPos.x > this.size.width) {
                ball.invert('x');
            }
            if (nxtPos.y < 0 || (hitsIt(nxtPos.x, this.paddle.x, this.paddle.size.width) && hitsIt(nxtPos.y, this.paddle.y, this.paddle.size.height))) {
                ball.invert('y');
            }
            if (nxtPos.y >= this.size.height) {
                ballsToDelete.push(index);
                // TODO: make sure it gets deleted, don't want a memory leak
                ball.destroy(this.domElement);
                return;
            }

            nxtPos = ball.getNextPosition();
            block = this.getBlock({x:nxtPos.x,y:ball.y});
            if (block) {
                hitBlockX = true;
                ball.invert('x');
                this.destroyBlock(block);
            }

            nxtPos = ball.getNextPosition();
            block = this.getBlock({x:ball.x,y:nxtPos.y});
            if (block) {
                hitBlockY = true;
                ball.invert('y');
                this.destroyBlock(block);
            }
            if (!hitBlockX && !hitBlockY) {
                block = this.getBlock(nxtPos);
                if (block) {
                    ball.invert('y');
                    ball.invert('x');
                    this.destroyBlock(block);
                }
            }
            nxtPos = ball.getNextPosition();
            ball.update(nxtPos);
        }, this);
        ballsToDelete.map( (idx:number) => {
            this.balls.splice(idx+offset,1);
            offset -= 1;
        })
    }
    keyDownHandler(e:KeyboardEvent):void {
        switch (e.keyCode) {
            case 37:
                this.onKeyLeft();
                break;
            case 39:
                this.onKeyRight();
                break;
        }
    }
    onKeyLeft() {
        this.paddle.move('left');
    }
    onKeyRight() {
        this.paddle.move('right');
    }

}