import { SVGNAMESPACE } from './Constants';
import Vector from '../interfaces/Vector';
import Ball from './Ball';
import Block from './Block';
import ballConfig from '../interfaces/BallConfig';
import BlockConfig from '../interfaces/BlockConfig';
import Size from '../interfaces/Size';
import LevelI from '../interfaces/LevelI';
import PlayerTypes from '../interfaces/PlayerTypes';
import PlayerConfig from '../interfaces/PlayerConfig';
import AI from './AI';
import Paddle from './Paddle';
import Guy from './Guy';
import Bullet from './Bullet';
import { isCollision, isNear } from './CollisionUtil';
import Modal from 'biblioteca/Modal';
import LevelSelector from '../LevelSelector/LevelSelector';
import UserScore from '../UserScore/UserScore';
import StatusBar from './StatusBar/StatusBar';
import Reward from './Reward';
import RewardEnum from '../interfaces/Reward';
import LinePosI from '../interfaces/LinePos';

export default class GameBoard {
    private activeKeys: Map<number, boolean>;
    private bullets: Array<Bullet>;
    private fallingRewards: Array<Reward>;
    private updateInterval: number;
    private balls: Array<Ball>;
    private domElement: SVGElement;
    private renderedBlocks: Array<Block>;
    private ai: Paddle|Guy;
    private player: Paddle|Guy;
    private paddle: Paddle;
    private guy: Guy;
    private isPaused: boolean;
    private modal: Modal;
    private levelEnded: boolean;
    private statusBar: StatusBar;
    private score: number;
    private availableRewards: RewardEnum[];

    public constructor(
        private size: Size,
        private mountNode: HTMLElement,
        private levelSelector: LevelSelector,
        private levelNumber: number,
        private option: PlayerTypes
    ) {
        this.availableRewards = [];
        this.activeKeys = new Map();
        this.modal = new Modal();
        this.balls = [];
        this.bullets = [];
        this.fallingRewards = [];
        this.levelEnded = false;
        if ( this.option === PlayerTypes.defender ) {
            this.score = 0;
        } else if ( this.option === PlayerTypes.capture ) {
            this.score = 200;
        }

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
        mountNode.appendChild( this.domElement );
        const statusBarWrapperNode: HTMLDivElement = document.createElement('div');
        statusBarWrapperNode.style.flexBasis = '15%';
        mountNode.appendChild(statusBarWrapperNode);
        this.statusBar = new StatusBar(
            statusBarWrapperNode,
            {
                onRewardSelect: this.rewardSelect.bind(this),
                selectedReward: null,
                levelNumber,
                score: this.score,
                rewards: this.availableRewards
            }
        );
    }
    private rewardSelect( reward: RewardEnum ): void {
        this.player.applyReward( reward );
        this.statusBar.updateProps({
            selectedReward: reward
        });
    }
    public init( level: LevelI ): void {
        // build stuff
        this.renderedBlocks = this.renderBlocks( level.blocks );
        this.balls = this.renderBalls( level.balls );
        this.buildPlayerAndAI( level.paddle, level.guy );

        document.body.addEventListener('keydown', this.globalKeyListener.bind( this ) );
        this.start();
    }
    private buildPlayerAndAI( paddleConfig: PlayerConfig, guyConfig: PlayerConfig ): void {
        this.paddle = this.buildPaddle( paddleConfig );
        this.guy = this.buildGuy( guyConfig );

        if ( this.option === PlayerTypes.defender ) {
            this.player = this.paddle;
            this.ai = this.guy;
        } else if ( this.option === PlayerTypes.capture ) {
            this.player = this.guy;
            this.ai = this.paddle;
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
    private buildPaddle( paddleConfig: PlayerConfig ): Paddle {
        return new Paddle(
            this.size,
            this.domElement,
            paddleConfig,
            this.createBullet.bind( this )
        );
    }
    private buildGuy( guyConfig: PlayerConfig ): Guy {
        return new Guy( this.domElement, guyConfig );
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
        this.fallingRewards.push( new Reward( start, type, this.domElement ) );
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
    private getGuy( point: Vector ): Guy {
        const guyPoint = this.guy.getPoint();
        const guySize = this.guy.getSize();

        if ( isNear( point, guyPoint, guySize ) &&
             isCollision( point, guyPoint, guySize ) ) {
                 return this.guy;
             }
    }
    private endGame(): void {
        UserScore.setScore( this.levelNumber, this.option, this.score );

        let msg: string;
        let success: boolean;

        if ( this.option === PlayerTypes.defender ) {
            if ( this.renderedBlocks.length === 0 ) {
                msg = 'Level Complete!';
                success = true;
            } else if ( this.balls.length === 0 ) {
                msg = 'Level Failed!';
                success = false;
            }
        } else if ( this.option === PlayerTypes.capture ) {
            if ( this.renderedBlocks.length === 0 ) {
                msg = 'Level Failed!';
                success = false;
            } else if ( this.balls.length === 0 ) {
                msg = 'Level Complete!';
                success = true;
            }
        }
        clearInterval( this.updateInterval );
        this.levelEnded = true;
        this.levelSelector.show( this.levelNumber, msg, success );
        this.destroy();
    }
    private stop(): void {
        this.modal.show( 'Game Paused', this.start.bind( this ) );
        this.isPaused = true;
        clearInterval( this.updateInterval );
    }
    private isGameEnded(): boolean {
        return this.renderedBlocks.length === 0 || this.balls.length === 0;
    }
    private update(): void {
        if ( this.isGameEnded() ) {
            this.endGame();
            return;
        } else {
            this.updateBalls();
            this.updateBullets();
            this.updateRewards();
            this.dispatchActions();
            this.updateAI();
        }
    }
    private updateScore(): void {
        if ( this.option === PlayerTypes.defender ) {
            this.score += 5;
        } else if ( this.option === PlayerTypes.capture ) {
            this.score -= 5;
        }
        this.statusBar.updateProps({ score: this.score });
    }
    private catchReward( reward: RewardEnum, what: PlayerTypes ): void {
        if ( what === this.option ) {
            this.availableRewards = this.availableRewards.concat(reward);
            this.statusBar.updateProps({
                rewards: this.availableRewards
            });
            this.rewardSelect(reward);
        }
    }
    private updateRewards(): void {
        let toDelete: Array<number> = [];
        let offset: number = 0;
        this.fallingRewards.forEach( ( reward: Reward, index: number ) => {
            const nxtPos = reward.getNextPosition();
            const paddlePos: Vector = this.paddle.getPoint();
            const paddleSize: Size = this.paddle.getSize();

            if ( nxtPos.y >= this.size.height ) {
                toDelete.push( index );
                reward.destroy();
            } else if ( isCollision( nxtPos, paddlePos, paddleSize ) ) {
                this.catchReward( reward.rewardType, PlayerTypes.defender );
                toDelete.push( index );
                reward.destroy();
            } else {
                reward.updateDOMPosition( nxtPos );
            }
        });
        toDelete.forEach( ( idx: number ) => {
            this.fallingRewards.splice( idx + offset, 1 );
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
            let block: Block|Guy;
            let candidatPoint: Vector;

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
            candidatPoint = { x: nxtPos.x, y: ball.point.y };
            block = this.getBlock( candidatPoint ) || this.getGuy( candidatPoint );
            if ( block ) {
                this.updateScore();
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
            candidatPoint = { x: ball.point.x, y: nxtPos.y };
            block = this.getBlock( candidatPoint ) || this.getGuy( candidatPoint );
            if ( block ) {
                this.updateScore();
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
                block = this.getBlock( nxtPos ) || this.getGuy( nxtPos );
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
        if ( e.keyCode === 27 && this.levelEnded === false ) {
            this.pauseGame();
        } else if (e.code.startsWith('Digit')) {
            const reward: RewardEnum = <RewardEnum>+e.code.match(/\d/)[0];
            if (this.availableRewards.indexOf(reward) !== -1) {
                this.rewardSelect(reward);
            }

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
                    case 38:
                    case 87:
                        this.onKeyUp();
                        break;
                    case 40:
                    case 83:
                        this.onKeyDown();
                        break;
                    case 32:
                        this.onSpaceBar();
                        break;
                    default: break;
                }
            }
        });
    }
    private onKeyUp(): void {
        this.player.moveUp();
    }
    private onKeyDown(): void {
        this.player.moveDown();
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
        const lines: LinePosI[] = AI.makeMove(
            this.ai,
            this.balls,
            this.fallingRewards,
            this.size
        );

        this.removePredictionLines();
        if (lines && lines.length) {
            lines.forEach(({ x1, x2, y1, y2 }) => {
                const line: SVGLineElement = document.createElementNS(SVGNAMESPACE, 'line');
                line.setAttribute('x1', `${x1}`);
                line.setAttribute('x2', `${x2}`);
                line.setAttribute('y1', `${y1}`);
                line.setAttribute('y2', `${y2}`);
                line.setAttribute('stroke', 'red');
                line.setAttribute('stroke-width', '0.1');
                line.setAttribute('prediction-line', '');
                this.domElement.appendChild(line);
            });
        }
    }
    private removePredictionLines(): void {
        this.domElement.querySelectorAll('line[prediction-line]').forEach(l => this.domElement.removeChild(l));
    }
    private pauseGame(): void {
        if ( this.isPaused ) {
            this.start();
        } else {
            this.stop();
        }
    }

}