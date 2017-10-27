
export default class Load {

    private static cssFiles: Set<string> = new Set();

    public static css( file: string ): void {
        if ( this.cssFiles.has( file ) ) return;
        this.cssFiles.add( file );
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
}
