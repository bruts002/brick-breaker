import { SVGNAMESPACE } from './Constants';
import Vector from '../interfaces/Vector';
import Ball from './Ball';
import Block from './Block';
import ballConfig from '../interfaces/BallConfig';
import BlockConfig from '../interfaces/BlockConfig';
import Size from '../interfaces/Size';
import LevelI from '../interfaces/LevelI';
import Paddle from './Paddle';
import Bullet from './Bullet';
import CollisionUtil from './CollisionUtil';
import Modal from '../Modal';

export default class GameBoard {
    private activeKeys: Map<number, Boolean>;
    private bullets: Array<Bullet>;
    private updateInterval: number;
    private balls: Array<Ball>;
    private size: Size;
    private domElement: SVGElement;
    private renderedBlocks: Array<Block>;
    private paddle: Paddle;
    private isPaused: Boolean;
    private modal: Modal;

    public constructor( size: Size, domNode: HTMLElement ) {
        this.activeKeys = new Map();
        this.modal = new Modal();
        this.balls = [];
        this.bullets = [];
        this.size = size;

        this.domElement = document.createElementNS(
            SVGNAMESPACE,
            'svg'
        );
        this.domElement.setAttribute( 'width', '100%' );
        this.domElement.setAttribute( 'height', '100%' );
        this.domElement.setAttribute( 'viewBox', '0 0 ' + this.size.width + ' ' + this.size.height );
        // TODO: use classes instead of inline styles
        this.domElement.setAttribute( 'style', 'border:1px solid black;' );
        domNode.appendChild( this.domElement );
    }
    public init( level: LevelI ): void {
        // build stuff
        this.renderedBlocks = this.renderBlocks( level.blocks );
        this.balls = this.renderBalls( level.balls );
        this.paddle = this.buildPaddle( 9, 3 );

        document.body.addEventListener('keydown', this.globalKeyListener.bind( this ) );
        this.start();
    }
    private start(): void {
        // TODO give the user a count down before starting
        this.modal.hide();
        this.attachKeyListeners();
        this.updateInterval = setInterval( this.update.bind( this ), 50 );
        this.isPaused = false;
    }
    private removeKeyListeners(): void {
        document.body.removeEventListener( 'keydown', this.keyUpDownHandler );
        document.body.removeEventListener( 'keyup', this.keyUpDownHandler );
    }
    private attachKeyListeners(): void {
        document.body.addEventListener('keydown', this.keyUpDownHandler.bind( this ) );
        document.body.addEventListener('keyup', this.keyUpDownHandler.bind( this ) );
    }
    private buildPaddle( paddleWidth: number, paddleHeight: number ): Paddle {
        let paddleSize: Size = {
            width: paddleWidth,
            height: paddleHeight
        };
        return new Paddle(
            paddleSize,
            (this.size.width - paddleWidth) / 2,
            this.size,
            this.domElement,
            this.createBullet.bind( this )
        );
    }
    public createBullet( start: Vector ): void {
        this.bullets.push( new Bullet( start, this.domElement ) );
    }
    private buildBall( ballConfig: ballConfig ): Ball {
        return new Ball( ballConfig, this.domElement );
    }
    private renderBalls( balls: Array<ballConfig> ): Array<Ball> {
        return balls.map( this.buildBall, this );
    }
    private renderBlocks( blocks: Array<BlockConfig> ): Array<Block> {
        return blocks.map( this.renderBlock, this );
    }
    private renderBlock( block: BlockConfig ): Block {
        return new Block( block, this.domElement );
    }
    private destroyBlock( index: number ): void {
        this.renderedBlocks.splice( index, 1 );
    }
    private getBlock( point: Vector ): Block {
        let block: Block;
        this.renderedBlocks.some( ( b: Block, i: number ) => {
            let blockPoint: Vector = b.getPoint();
            let blockSize: Size = b.getSize();

            if ( CollisionUtil.isNear( point, blockPoint, blockSize ) &&
                 CollisionUtil.isCollision( point, blockPoint, blockSize ) ) {
                block = b;
                block.setIndex( i );
            }
            return Boolean( block );
        });
        return block;
    }
    private endGame( message: string ): void {
        alert( message );
        this.stop();
    }
    private stop(): void {
        this.modal.show( 'Game Paused', this.start.bind( this ) );
        this.isPaused = true;
        clearInterval( this.updateInterval );
    }
    private update(): void {
        if ( this.renderedBlocks.length === 0 ) {
            this.endGame( 'you win' );
            return;
        } else if ( this.balls.length === 0 ) {
            this.endGame( 'you lose' );
            return;
        }
        this.updateBalls();
        this.updateBullets();
        this.dispatchActions();
    }
    private updateBullets(): void {
        let bulletsToDelete: Array<number> = [];
        let offset: number = 0;
        this.bullets.forEach(function( bullet: Bullet, index: number ) {
            const speed: number = bullet.getSpeed( true );
            let blockStrength: number;
            let bulletStrength: number;
            let nxtPos: Vector;
            let curPos: Vector;
            let hitBlockX: boolean;
            let hitBlockY: boolean;
            let block: Block;

            for ( let indexSpeed = 0; indexSpeed < speed; indexSpeed++ ) {
                block = null;
                nxtPos = bullet.getNextPosition();
                curPos = bullet.getPoint();
                hitBlockX = hitBlockY = false;
                if ( bullet.isDestroyed ) {
                    bulletsToDelete.push( index );
                    return;
                }
                // check if it went off screen
                if ( nxtPos.x < 0 || nxtPos.x > this.size.width ||
                     nxtPos.y < 0 || nxtPos.y >= this.size.height
                    ) {
                    bulletsToDelete.push( index );
                    // TODO: make sure it gets deleted, don't want a memory leak
                    bullet.destroy();
                    return;
                }

                // check if block in front of x path
                block = this.getBlock( { x: nxtPos.x, y: curPos.y } );
                if ( block ) {
                    hitBlockX = true;
                    blockStrength = block.getStrength();
                    bulletStrength = bullet.getStrength();
                    if (block.getHit( bulletStrength ) <= 0) {
                        this.destroyBlock( block.index );
                    } else {
                        block.setIndex( -1 );
                    }
                }

                // check if ball in front of y path
                block = this.getBlock( { x: curPos.x, y: nxtPos.y } );
                if ( block ) {
                    hitBlockY = true;
                    blockStrength = block.getStrength();
                    bulletStrength = bullet.getStrength();
                    bullet.getHit( blockStrength );
                    if (block.getHit( bulletStrength ) === 0) {
                        this.destroyBlock( block.index );
                    } else {
                        block.setIndex( -1 );
                    }
                }
                // check if ball in front of xy path (corner hit)
                if ( !hitBlockX && !hitBlockY ) {
                    block = this.getBlock( nxtPos );
                    if (block) {
                        blockStrength = block.getStrength();
                        bulletStrength = bullet.getStrength();
                        bullet.getHit( blockStrength );
                        if (block.getHit( bulletStrength ) === 0) {
                            this.destroyBlock( block.index );
                        } else {
                            block.setIndex( -1 );
                        }
                    }
                }
                bullet.update();
            }
        }, this);
        bulletsToDelete.forEach( ( idx: number ) => {
            this.bullets.splice( idx + offset, 1 );
            offset -= 1;
        });
    }
    private updateBalls(): void {
        let ballsToDelete: Array<number> = [];
        let offset: number = 0;
        const paddlePos: Vector = this.paddle.getPoint();
        const paddleSize: Size = this.paddle.getSize();
        // for each ball
        // get new pos
        // check pos
        //  destroy block if needed
        //  destroy ball if needed
        //  invert trajectory
        // send new pos
        this.balls.forEach( function( ball: Ball, index: number ) {
            let nxtPos: Vector = ball.getNextPosition();
            let hitBlockX: boolean;
            let hitBlockY: boolean;
            let block: Block;

            // check if it side wall
            if ( nxtPos.x < 0 || nxtPos.x > this.size.width ) {
                ball.invertTraj( 'x' );
            }
            // check if hit top wall or paddle
            if ( nxtPos.y < 0 || CollisionUtil.isCollision( nxtPos, paddlePos, paddleSize ) ) {
                ball.invertTraj( 'y' );
            }
            // check if fell off screen
            if ( nxtPos.y >= this.size.height ) {
                ballsToDelete.push( index );
                // TODO: make sure it gets deleted, don't want a memory leak
                ball.destroy();
                return;
            }

            // check if ball in front of x path
            nxtPos = ball.getNextPosition();
            block = this.getBlock( { x: nxtPos.x, y: ball.point.y } );
            if ( block ) {
                hitBlockX = true;
                ball.invertTraj( 'x' );
                // TODO: different strength for balls
                if (block.getHit( 1 ) === 0) {
                    this.destroyBlock( block.index );
                } else {
                    block.setIndex( -1 );
                }
            }

            // check if ball in front of y path
            nxtPos = ball.getNextPosition();
            block = this.getBlock( { x: ball.point.x, y: nxtPos.y } );
            if ( block ) {
                hitBlockY = true;
                ball.invertTraj( 'y' );
                if (block.getHit( 1 ) === 0) {
                    this.destroyBlock( block.index );
                } else {
                    block.setIndex( -1 );
                }
            }
            // check if ball in front of xy path (corner hit)
            if ( !hitBlockX && !hitBlockY ) {
                block = this.getBlock( nxtPos );
                if ( block ) {
                    ball.invertTraj( 'y' );
                    ball.invertTraj( 'x' );
                    if (block.getHit( 1 ) === 0) {
                        this.destroyBlock( block.index );
                    } else {
                        block.setIndex( -1 );
                    }
                }
            }
            nxtPos = ball.getNextPosition();
            ball.updateDOMPosition( nxtPos );
        }, this);
        ballsToDelete.forEach( ( idx: number ) => {
            this.balls.splice( idx + offset, 1 );
            offset -= 1;
        });
    }
    private keyUpDownHandler( e: KeyboardEvent ): void {
        let isKeyDown: boolean = e.type === 'keydown';
        this.activeKeys.set( e.keyCode, isKeyDown );
    }
    private globalKeyListener( e: KeyboardEvent ): void {
        if ( e.keyCode === 27 ) {
            this.pauseGame();
        }
    }
    private dispatchActions(): void {
        this.activeKeys.forEach( ( value: Boolean, key: number ): void => {
            if ( value ) {
                switch ( key ) {
                    case 37:
                        this.onKeyLeft();
                        break;
                    case 39:
                        this.onKeyRight();
                        break;
                    case 32:
                        this.onSpaceBar();
                        break;
                    default: break;
                }
            }
        });
    }
    private onKeyLeft(): void {
        this.paddle.moveLeft();
    }
    private onKeyRight(): void {
        this.paddle.moveRight();
    }
    private onSpaceBar(): void {
        this.paddle.shoot();
    }
    private pauseGame(): void {
        if ( this.isPaused ) {
            this.start();
        } else {
            this.stop();
        }
    }

}