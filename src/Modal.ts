
export default class Modal {
    private mdl:HTMLDivElement;
    private p:HTMLParagraphElement;
    private cb:Function;

    public constructor() {
        var mdl:HTMLDivElement = document.createElement('div');
        var content:HTMLDivElement = document.createElement( 'div' );
        var clsBtn:HTMLSpanElement = document.createElement( 'span' );
        var p:HTMLParagraphElement = document.createElement( 'p' );
        mdl.setAttribute( 'class', 'modal' );
        content.setAttribute( 'class', 'modal-content' );
        clsBtn.setAttribute( 'class', 'closeBtn' );
        clsBtn.addEventListener( 'click', this.closeButton.bind( this ) );
        clsBtn.innerHTML = '&times;'
        p.innerHTML = 'Game Paused';
        content.appendChild( clsBtn );
        content.appendChild( p );
        mdl.appendChild( content );
        mdl.style.display = 'none';

        document.body.appendChild( mdl );
        this.mdl = mdl;
        this.p = p;
    }
    public show( message:string, cb:Function ):void {
        this.cb = cb;
        this.p.innerHTML = message;
        this.mdl.style.display = 'block';
    }
    private closeButton():void {
        if ( this.cb ) {
            this.cb();
            this.cb = null;
        } else {
            this.hide();
        }
    }
    public hide():void {
        this.p.innerHTML = '';
        this.mdl.style.display = 'none';
    }
}