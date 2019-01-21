import LevelI from 'App/interfaces/LevelI';

const isDev = process.env.NODE_ENV === 'development';

const getUrl = (level: string) => `${isDev ? 'static/' : ''}levels/${level}.json`;

export default class Load {

    private static loadedLevels: Map<string, LevelI> = new Map();
    private static pendingLevels: Map<string, Promise<LevelI>> = new Map();

    public static level( level: string): Promise<LevelI> {
        if ( this.loadedLevels.has( level ) ) return this.serveFromCache( level );
        if ( this.pendingLevels.has( level ) ) return this.pendingLevels.get( level );
        const options: RequestInit = {
            method: 'get',
            headers: { 'Content-Type': 'application/json' }
        };
        const promise = fetch(getUrl(level), options )
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
