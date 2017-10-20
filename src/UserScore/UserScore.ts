function setScore( level: number, score: number): void {
    const savedScore: number = getScore( level );
    if ( !savedScore || savedScore <= score ) {
        localStorage.setItem( `level-${level}`, JSON.stringify({ score }) );
    }
}

function getScore( level: number ): number {
    const raw = localStorage.getItem( `level-${level}` );
    if ( raw ) {
        return JSON.parse( raw ).score;
    } else {
        return -1;
    }
}

export default {
    setScore,
    getScore
};
