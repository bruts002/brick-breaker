function getKey( level: number): string {
    return `level-${level}`;
}

function setScore( level: number, type: 'player'|'paddle', score: number): void {
    const levelKey = getKey( level );
    const raw = localStorage.getItem( levelKey );
    if ( !raw ) {
        localStorage.setItem( levelKey, JSON.stringify({
            [type]: score
        }));
    } else if ( raw[type] < score ) {
        raw[type] = score;
        localStorage.setItem( levelKey, JSON.stringify( { raw } ) );
    }
}

function getScore( level: number, type?: 'player'|'paddle' ): number {
    const levelKey = getKey( level );
    const raw = localStorage.getItem( levelKey );
    if ( !raw ) return 0;
    const info = JSON.parse( raw );
    if ( !type ) {
        if ( info.paddle && info.player ) return Math.max( info.paddle, info.player );
        if ( info.paddle ) return info.paddle;
        if ( info.player ) return info.player;
    }
    if ( type === 'player' ) return info.player ? info.player : 0;
    if ( type === 'paddle' ) return info.paddle ? info.paddle : 0;
}

export default {
    setScore,
    getScore
};
