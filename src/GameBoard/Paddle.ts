import { SVGNAMESPACE } from './Constants';
import Size from '../interfaces/Size';
import Vector from '../interfaces/Vector';
import Entity from './Entity';
import RewardEnum from '../interfaces/Reward';
import PlayerConfig from '../interfaces/PlayerConfig';

export default class Paddle extends Entity {

    private rewardType: RewardEnum;
    public moveAmount: number;

    constructor(
        private boardSize: Size,
        mountNode: SVGElement,
        paddleConfig: PlayerConfig,
        private emitBullet: Function
    ) {
        super(
            paddleConfig.position,
            paddleConfig.size,
            { x: 0, y: 0 },
            'rect',
            mountNode,
            paddleConfig.attributes || Paddle.defaults.attributes
        );
        this.moveAmount = Paddle.defaults.moveAmount;
    }

    public static defaults = {
        sizes: {
            default: { width: 9, height: 3 },
            wide: { width: 14, height: 3 }
        },
        attributes: {
            'fill': 'gray',
            'stroke': 'black',
            'stroke-width': '0.5'
        },
        moveAmount: 3
    };

    public moveLeft(): void {
        const nxtLeft: number = this.nextLeft();
        if ( this.point.x !== nxtLeft ) {
            this.point.x = nxtLeft;
            this.updateDOMPosition();
        }
    }

    public nextLeft(): number {
        let maxMove = this.moveAmount;
        while( ( this.point.x - maxMove ) < 0 ) {
            maxMove--;
        }
        return this.point.x - maxMove;
    }

    public moveRight(): void {
        const nxtRight: number = this.nextRight();
        if ( this.point.x !== nxtRight ) {
            this.point.x = nxtRight;
            this.updateDOMPosition();
        }
    }

    public nextRight(): number {
        let maxMove = this.moveAmount;
        while( ( this.point.x + this.size.width + maxMove ) > this.boardSize.width ) {
            maxMove--;
        }
        return this.point.x + maxMove;
    }

    public applyReward( rewardType: RewardEnum ) {
        this.rewardType = rewardType;
        if ( this.rewardType === RewardEnum.wide ) this.makeWide();
        else this.makeDefault();
        this.updateColor();
    }

    private updateColor(): void {
        this.domElement.setAttribute( 'fill', Paddle.getColor( this.rewardType ) );
    }

    private static getColor( strength: number ): string {
        switch ( strength ) {
            case 7: return '#FF0D72';
            case 6: return '#0DC2FF';
            case 5: return '#0DFF72';
            case 4: return '#F538FF';
            case 3: return '#FF8E0D';
            case 2: return '#FFE138';
            default:
            case 1: return '#3877FF';
        }
    }
    public useReward(): void {
        switch (this.rewardType) {
            case RewardEnum.machine:
                this.shootMachine();
                break;
            case RewardEnum.rocket:
                this.shootRocket();
                break;
            default: break;
        }
    }
    private shootRocket(): void {
        const start: Vector = {
            x: this.point.x + ( this.size.width / 2 ),
            y: this.point.y - this.size.height
        };
        const size: Size = {
            width: 3, height: 9
        };
        this.emitBullet( start, size );
    }
    private shootMachine(): void {
        const size: Size = {
            width: 1, height: 3
        };
        this.emitBullet({
            x: this.point.x,
            y: this.point.y - this.size.height
        }, size );
        this.emitBullet({
            x: this.point.x + this.size.width,
            y: this.point.y - this.size.height
        }, size );
    }
    private makeWide(): void {
        this.updateSize( Paddle.defaults.sizes.wide );
    }
    private makeDefault(): void {
        this.updateSize( Paddle.defaults.sizes.default );
    }
}