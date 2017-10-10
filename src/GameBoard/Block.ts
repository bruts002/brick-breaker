import BlockConfig from '../interfaces/BlockConfig';
import Entity from './Entity';

// TODO:
// -- blocks that drop rewards
// -- animations on hit

export default class Block extends Entity {

    public index: number;
    private strength: number;

    public constructor( config: BlockConfig, mountNode: SVGElement ) {
        let attributes = {
            'fill': 'gray',
            'stroke': 'black',
            'stroke-width': '0.5'
        };
        super( config.point, config.size, { x: 0, y: 0 }, 'rect', mountNode, attributes );
        if ( config.strength ) {
            this.strength = config.strength;
        } else {
            this.strength = 1;
        }
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
        if ( this.strength <= 0 ) {
            this.destroy();
        }
        return this.strength;
    }
}
