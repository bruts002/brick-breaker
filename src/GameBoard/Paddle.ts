import { SVGNAMESPACE } from './Constants';
import Size from '../interfaces/Size';
import Vector from '../interfaces/Vector';
import Entity from './Entity';
import RewardEnum from '../interfaces/Reward';

export default class Paddle extends Entity {

    private boardSize: Size;
    private emitBullet: Function;
    private rewardType: RewardEnum;

    constructor( boardSize: Size, mountNode: SVGElement, emitBullet: Function ) {
        const paddlePoint = {
            x: ( boardSize.width - Paddle.sizes.default.width ) / 2,
            y: boardSize.height - Paddle.sizes.default.height - 0.5
        };
        const attributes = {
            'fill': 'gray',
            'stroke': 'black',
            'stroke-width': '0.5'
        };
        super( paddlePoint, Paddle.sizes.default, { x: 0, y: 0 }, 'rect', mountNode, attributes );
        this.emitBullet = emitBullet;
        this.boardSize = boardSize;
    }

    private static sizes = {
        default: { width: 9, height: 3 },
        wide: { width: 14, height: 3 }
    };

    public moveLeft(): void {
        if ( this.point.x > 3 ) {
            this.point.x = this.point.x - 3;
            this.updateDOMPosition();
        }
    }

    public moveRight(): void {
        if ( this.point.x + this.size.width + 3 < this.boardSize.width ) {
            this.point.x = this.point.x + 3;
            this.updateDOMPosition();
        }
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
            y: this.point.y - 3
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
            y: this.point.y - 3
        }, size );
        this.emitBullet({
            x: this.point.x + this.size.width,
            y: this.point.y - 3
        }, size );
    }
    private makeWide(): void {
        this.updateSize( Paddle.sizes.wide );
    }
    private makeDefault(): void {
        this.updateSize( Paddle.sizes.default );
    }
}