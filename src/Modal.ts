export default class Modal {
    private mdl: HTMLDivElement;
    private p: HTMLParagraphElement;
    private content: HTMLDivElement;
    public extensionPoint: HTMLDivElement;
    private cb: Function;

    public constructor( showClose?: Boolean ) {
        const mdl: HTMLDivElement = document.createElement('div');
        const content: HTMLDivElement = document.createElement( 'div' );
        const p: HTMLParagraphElement = document.createElement( 'p' );
        const extensionPoint: HTMLDivElement = document.createElement( 'div' );
        mdl.setAttribute( 'class', 'modal' );
        content.setAttribute( 'class', 'modal-content' );
        p.innerHTML = 'Game Paused';
        extensionPoint.setAttribute( 'class', 'modal-template' );
        if ( showClose !== false ) {
            this.attachCloseButton( content );
        }
        content.appendChild( p );
        content.appendChild( extensionPoint );
        mdl.appendChild( content );
        mdl.style.display = 'none';

        document.body.appendChild( mdl );
        this.mdl = mdl;
        this.p = p;
        this.content = content;
        this.extensionPoint = extensionPoint;
    }
    private attachCloseButton( content: HTMLDivElement ): void {
        const clsBtn: HTMLSpanElement = document.createElement( 'span' );
        clsBtn.setAttribute( 'class', 'closeBtn' );
        clsBtn.addEventListener( 'click', this.closeButton.bind( this ) );
        clsBtn.innerHTML = '&times;';
        content.appendChild( clsBtn );
    }
    public show( message: string, cb?: Function ): void {
        if ( cb ) this.cb = cb;
        this.p.innerHTML = message;
        this.mdl.style.display = 'block';
    }

    private closeButton(): void {
        if ( this.cb ) {
            this.cb();
            this.cb = null;
        } else {
            this.hide();
        }
    }
    public hide(): void {
        this.p.innerHTML = '';
        this.mdl.style.display = 'none';
        this.content.classList.remove( 'success', 'fail' );
    }
}