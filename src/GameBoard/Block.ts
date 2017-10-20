import BlockConfig from '../interfaces/BlockConfig';
import Reward from '../interfaces/Reward';
import Entity from './Entity';

// TODO:
// -- blocks that drop rewards
// -- animations on hit

export default class Block extends Entity {

    public index: number;
    private strength: number;
    private reward: Reward;
    private dropReward: Function;

    public constructor( config: BlockConfig, mountNode: SVGElement, dropReward: Function ) {
        const attributes = {
            'fill': Block.getBlockColor( config.strength ),
            'stroke': 'black',
            'stroke-width': '0.5'
        };
        super( config.point, config.size, { x: 0, y: 0 }, 'rect', mountNode, attributes );
        if ( config.strength ) {
            this.strength = config.strength;
        } else {
            this.strength = 1;
        }
        this.dropReward = dropReward;
        this.reward = config.reward;
        this.index = -1;
    }
    public setIndex( index: number ) {
        this.index = index;
    }
    public getStrength(): number {
        return this.strength;
    }
    public getHit( strength: number ): number {
        this.strength -= strength;
        this.updateColor();
        if ( this.strength <= 0 ) {
            if ( this.reward > -1) {
                this.dropReward( this.point, this.reward );
            }
            this.destroy();
        }
        return this.strength;
    }
    private updateColor(): void {
        this.domElement.setAttribute( 'fill', Block.getBlockColor( this.strength ) );
    }
    private static getBlockColor( strength: number ): string {
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
}
