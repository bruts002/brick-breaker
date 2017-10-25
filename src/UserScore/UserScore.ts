import PlayerTypes from '../interfaces/PlayerTypes';

function getKey( level: number): string {
    return `level-${level}`;
}

function setScore( level: number, playerType: PlayerTypes, score: number): void {
    const levelKey = getKey( level );
    const raw = localStorage.getItem( levelKey );
    if ( !raw ) {
        localStorage.setItem( levelKey, JSON.stringify({
            [playerType]: score
        }));
    } else if ( raw[playerType] < score ) {
        raw[playerType] = score;
        localStorage.setItem( levelKey, JSON.stringify( { raw } ) );
    }
}

function getScore( level: number, type?: PlayerTypes ): number {
    const levelKey = getKey( level );
    const raw = localStorage.getItem( levelKey );
    if ( !raw ) return 0;
    const info = JSON.parse( raw );
    if ( !type ) {
        if ( info.defender && info.capture ) return Math.max( info.defender, info.capture );
        if ( info.defender ) return info.defender;
        if ( info.capture ) return info.capture;
    }
    if ( type === PlayerTypes.capture ) return info.capture ? info.capture : 0;
    if ( type === PlayerTypes.defender ) return info.defender ? info.defender : 0;
}

export default {
    setScore,
    getScore
};
