import Point from './Point';
import Ball from './Ball';
import Block from './Block';
import ballConfig from './interfaces/BallConfig';
import BlockConfig from './interfaces/BlockConfig';
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
    renderedBlocks: Array<Block>;
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
    init(blocks:Array<BlockConfig>, balls:Array<ballConfig>):void {
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
    buildBall( ballConfig:ballConfig ):Ball {
        return new Ball( ballConfig, this.domElement );
    }
    renderBalls( balls:Array<ballConfig> ):Array<Ball> {
        var builtBalls = balls.map(this.buildBall, this);
        return builtBalls;
    }
    renderBlocks(blocks:Array<BlockConfig>):Array<Block> {
        return blocks.map(this.renderBlock, this);
    }
    renderBlock(block:BlockConfig):Block {
        return new Block(block, this.domElement);
    }
    destroyBlock( index:number ):void {
        this.renderedBlocks.splice( index, 1 );
    }
    getBlock( point:Point ):Block {
        var block:Block;
        this.renderedBlocks.some((b:Block, i:number) => {
            var blockPoint = b.getPoint(),
                blockSize = b.getSize();
            
            if (hitsIt(point.x, blockPoint.x, blockSize.width) &&
                hitsIt(point.y, blockPoint.y, blockSize.height)) {
                block = b;
                block.setIndex( i );
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
        var ballsToDelete:Array<number> = [];
        var offset:number = 0;
        const paddlePos:Point = this.paddle.getPoint();
        const paddleSize:Size = this.paddle.getSize();
        // for each ball
        // get new pos
        // check pos
        //  destroy block if needed
        //  destroy ball if needed
        //  invert trajectory
        // send new pos
        this.balls.forEach(function(ball:Ball, index:number) {
            var nxtPos:Point = ball.getNextPosition();
            var hitBlockX:boolean;
            var hitBlockY:boolean;
            var block:Block;

            // check if it side wall
            if (nxtPos.x < 0 || nxtPos.x > this.size.width) {
                ball.invert('x');
            }
            // check if hit top wall or paddle
            if (nxtPos.y < 0 || (hitsIt(nxtPos.x, paddlePos.x, paddleSize.width) && hitsIt(nxtPos.y, paddlePos.y, paddleSize.height))) {
                ball.invert('y');
            }
            // check if fell off screen
            if (nxtPos.y >= this.size.height) {
                ballsToDelete.push(index);
                // TODO: make sure it gets deleted, don't want a memory leak
                ball.destroy(this.domElement);
                return;
            }

            // check if ball in front of x path
            nxtPos = ball.getNextPosition();
            block = this.getBlock({x:nxtPos.x,y:ball.point.y});
            if (block) {
                hitBlockX = true;
                ball.invert('x');
                if (block.getHit() === 0) {
                    this.destroyBlock( index );
                }
            }

            // check if ball in front of y path
            nxtPos = ball.getNextPosition();
            block = this.getBlock({x:ball.point.x,y:nxtPos.y});
            if (block) {
                hitBlockY = true;
                ball.invert('y');
                if (block.getHit() === 0) {
                    this.destroyBlock( index );
                }
            }
            // check if ball in front of xy path (corner hit)
            if (!hitBlockX && !hitBlockY) {
                block = this.getBlock(nxtPos);
                if (block) {
                    ball.invert('y');
                    ball.invert('x');
                    if (block.getHit() === 0) {
                        this.destroyBlock( index );
                    }
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