import LevelI from './interfaces/LevelI';

export default class Load {

    private static loadedCss: Set<string> = new Set();
    private static loadedLevels: Map<string, LevelI> = new Map();
    private static pendingLevels: Map<string, Promise<LevelI>> = new Map();

    public static css( file: string ): void {
        if ( this.loadedCss.has( file ) ) return;
        this.loadedCss.add( file );
        const options: RequestInit = {
            method: 'get',
            headers: { 'Content-Type': 'text/css' }
        }
        fetch( `css/${file}.css`, options )
            .then( resp => resp.text() )
            .then( Load.attachToDocument );
    }

    private static attachToDocument( resp: string ) {
        const styleTag = document.createElement( 'style' );
        const style = document.createTextNode( resp );
        styleTag.appendChild( style );
        document.head.appendChild( styleTag );
    }

    public static level( level: string): Promise<LevelI> {
        if ( this.loadedLevels.has( level ) ) return this.serveFromCache( level );
        if ( this.pendingLevels.has( level ) ) return this.pendingLevels.get( level );
        // this.loadedLevels.add( level );
        const options: RequestInit = {
            method: 'get',
            headers: { 'Content-Type': 'application/json' }
        }
        const promise = fetch( `levels/${level}.json`, options )
            .then( resp => resp.json() )
            .then( this.toLevel )
            .then ( levelI => this.saveLevel( level, levelI) );
        this.pendingLevels.set( level, promise );
        return promise;
    }

    private static toLevel( level: Object ): LevelI {
        return <LevelI> level;
    }

    private static saveLevel( level: string, levelI: LevelI ): Promise<LevelI> {
        this.pendingLevels.delete( level );
        this.loadedLevels.set( level, levelI );
        return Promise.resolve( levelI );
    }
    
    private static serveFromCache( level: string ): Promise<LevelI> {
        return Promise.resolve( this.loadedLevels.get( level ) );
    }
}
