import { SVGNAMESPACE } from './Constants';
import Vector from '../interfaces/Vector';
import Ball from './Ball';
import Block from './Block';
import ballConfig from '../interfaces/BallConfig';
import BlockConfig from '../interfaces/BlockConfig';
import Size from '../interfaces/Size';
import LevelI from '../interfaces/LevelI';
import PlayerTypes from '../interfaces/PlayerTypes';
import AI from './AI';
import Paddle from './Paddle';
import Guy from './Guy';
import Bullet from './Bullet';
import { isCollision, isNear } from './CollisionUtil';
import Modal from '../Modal';
import LevelSelector from '../LevelSelector/LevelSelector';
import UserScore from '../UserScore/UserScore';
import StatusBar from './StatusBar/StatusBar';
import Reward from './Reward';
import RewardEnum from '../interfaces/Reward';

export default class GameBoard {
    private activeKeys: Map<number, boolean>;
    private bullets: Array<Bullet>;
    private rewards: Array<Reward>;
    private updateInterval: number;
    private balls: Array<Ball>;
    private size: Size;
    private domElement: SVGElement;
    private renderedBlocks: Array<Block>;
    private ai: Paddle|Guy;
    private player: Paddle|Guy;
    private paddle: Paddle;
    private guy: Guy;
    private isPaused: boolean;
    private modal: Modal;
    private levelSelector: LevelSelector;
    private levelEnded: boolean;
    private levelNumber: number;
    private mountNode: HTMLElement;
    private statusBar: StatusBar;
    private score: number;
    private option: PlayerTypes;

    public constructor(
        size: Size,
        mountNode: HTMLElement,
        levelSelector: LevelSelector,
        levelNumber: number,
        option: PlayerTypes
    ) {
        this.activeKeys = new Map();
        this.modal = new Modal();
        this.balls = [];
        this.bullets = [];
        this.rewards = [];
        this.size = size;
        this.levelSelector = levelSelector;
        this.levelEnded = false;
        this.levelNumber = levelNumber;
        this.mountNode = mountNode;
        this.score = 0;
        this.option = option;

        this.domElement = document.createElementNS(
            SVGNAMESPACE,
            'svg'
        );
        this.domElement.setAttribute( 'xmlns', SVGNAMESPACE );
        this.domElement.setAttribute( 'width', '85%' );
        this.domElement.setAttribute( 'height', '100%' );
 // TODO: figure out how to set background to SVG Element
 //       or have a rect container that the rest of the elements go on to, instead of SVG element
        this.domElement.setAttribute( 'fill', 'black' );
        this.domElement.setAttribute( 'viewBox', '0 0 ' + this.size.width + ' ' + this.size.height );
        // TODO: use classes instead of inline styles
        this.domElement.setAttribute( 'style', 'border:1px solid black;' );
        this.statusBar = new StatusBar( this.rewardSelect.bind( this ), levelNumber, this.mountNode );
        mountNode.appendChild( this.domElement );
    }
    private rewardSelect( reward: RewardEnum ): void {
        this.player.applyReward( reward );
    }
    public init( level: LevelI ): void {
        // build stuff
        this.renderedBlocks = this.renderBlocks( level.blocks );
        this.balls = this.renderBalls( level.balls );
        this.buildPlayerAndAI();

        document.body.addEventListener('keydown', this.globalKeyListener.bind( this ) );
        this.start();
    }
    private buildPlayerAndAI(): void {
        if ( this.option === PlayerTypes.defender ) {
            this.player = this.paddle = this.buildPaddle();
            this.ai = this.guy = this.buildGuy();
        } else if ( this.option === PlayerTypes.capture ) {
            this.player = this.guy = this.buildGuy();
            this.ai = this.paddle = this.buildPaddle();
        }
    }
    private destroy(): void {
        document.body.removeEventListener('keydown', this.globalKeyListener.bind( this ));
        while (this.mountNode.hasChildNodes()) {
            this.mountNode.removeChild(this.mountNode.lastChild);
        }
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
    private buildPaddle(): Paddle {
        return new Paddle(
            this.size,
            this.domElement,
            this.createBullet.bind( this )
        );
    }
    private buildGuy(): Guy {
        return new Guy();
    }
    private createBullet( start: Vector, size: Size ): void {
        this.bullets.push( new Bullet( start, size, this.domElement ) );
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
        return new Block( block, this.domElement, this.dropReward.bind( this ) );
    }
    private destroyBlock( index: number ): void {
        this.renderedBlocks.splice( index, 1 );
    }
    private dropReward( start: Vector, type: RewardEnum ): void {
        this.rewards.push( new Reward( start, type, this.domElement ) );
    }
    private getBlock( point: Vector ): Block {
        let block: Block;
        this.renderedBlocks.some( ( b: Block, i: number ) => {
            let blockPoint: Vector = b.getPoint();
            let blockSize: Size = b.getSize();

            if ( isNear( point, blockPoint, blockSize ) &&
                 isCollision( point, blockPoint, blockSize ) ) {
                block = b;
                block.setIndex( i );
            }
            return Boolean( block );
        });
        return block;
    }
    private endGame( message: string, success: boolean ): void {
        clearInterval( this.updateInterval );
        this.levelEnded = true;
        this.levelSelector.show( message, success );
        this.destroy();
    }
    private stop(): void {
        this.modal.show( 'Game Paused', this.start.bind( this ) );
        this.isPaused = true;
        clearInterval( this.updateInterval );
    }
    private update(): void {
        if ( this.renderedBlocks.length === 0 ) {
            UserScore.setScore( this.levelNumber, PlayerTypes.defender, this.score );
            this.endGame( 'Level complete!', true );
            return;
        } else if ( this.balls.length === 0 ) {
            this.endGame( 'Level Failed!', false );
            return;
        } else {
            this.updateBalls();
            this.updateBullets();
            this.updateRewards();
            this.dispatchActions();
            this.updateAI();
        }
    }
    private applyReward( reward: RewardEnum, what: 'paddle'|'guy' ): void {
        if ( what === 'paddle' ) {
            if ( this.option === PlayerTypes.defender ) {
                this.statusBar.addReward( reward );
            }
            this.paddle.applyReward( reward );
        } else if ( what === 'guy' ) {
        }
    }
    private updateRewards(): void {
        let toDelete: Array<number> = [];
        let offset: number = 0;
        this.rewards.forEach( ( reward: Reward, index: number ) => {
            const nxtPos = reward.getNextPosition();
            const paddlePos: Vector = this.paddle.getPoint();
            const paddleSize: Size = this.paddle.getSize();

            if ( nxtPos.y >= this.size.height ) {
                toDelete.push( index );
                reward.destroy();
            } else if ( isCollision( nxtPos, paddlePos, paddleSize ) ) {
                this.applyReward( reward.rewardType, 'paddle' );
                toDelete.push( index );
                reward.destroy();
            } else {
                reward.updateDOMPosition( nxtPos );
            }
        });
        toDelete.forEach( ( idx: number ) => {
            this.rewards.splice( idx + offset, 1 );
            offset -= 1;
        });
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
        this.balls.forEach( function( ball: Ball, index: number ) {
            const radius = ball.getRadius();
            let nxtPos: Vector = ball.getNextPosition();
            let hitBlockX: boolean;
            let hitBlockY: boolean;
            let block: Block;

            // check if it side wall
            if ( nxtPos.x - radius < 0 || nxtPos.x + radius > this.size.width ) {
                ball.invertTraj( 'x' );
            }
            // check if hit top wall or paddle
            if ( nxtPos.y - radius < 0 || isCollision( nxtPos, paddlePos, paddleSize ) ) {
                ball.invertTraj( 'y' );
            }
            // check if fell off screen
            if ( nxtPos.y + radius >= this.size.height ) {
                ballsToDelete.push( index );
                // TODO: make sure it gets deleted, don't want a memory leak
                ball.destroy();
                return;
            }

            // check if ball in front of x path
            nxtPos = ball.getNextPosition();
            block = this.getBlock( { x: nxtPos.x, y: ball.point.y } );
            if ( block ) {
                this.score += 5;
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
                this.score += 5;
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
            this.statusBar.updateScore( this.score );
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
        if ( e.keyCode === 27 && this.levelEnded === false ) {
            this.pauseGame();
        }
    }
    private dispatchActions(): void {
        this.activeKeys.forEach( ( value: boolean, key: number ): void => {
            if ( value ) {
                switch ( key ) {
                    case 65:
                    case 37:
                        this.onKeyLeft();
                        break;
                    case 68:
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
        this.player.moveLeft();
    }
    private onKeyRight(): void {
        this.player.moveRight();
    }
    private onSpaceBar(): void {
        this.player.useReward();
    }
    private updateAI(): void {
        AI.makeMove(
            this.ai,
            this.balls,
            this.rewards,
            this.size
        );
    }
    private pauseGame(): void {
        if ( this.isPaused ) {
            this.start();
        } else {
            this.stop();
        }
    }

}