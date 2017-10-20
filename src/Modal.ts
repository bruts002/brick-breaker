
export default class Modal {
    private mdl: HTMLDivElement;
    private p: HTMLParagraphElement;
    private content: HTMLDivElement;
    private template: HTMLDivElement;
    private cb: Function;

    public constructor( showClose?: Boolean ) {
        const mdl: HTMLDivElement = document.createElement('div');
        const content: HTMLDivElement = document.createElement( 'div' );
        const p: HTMLParagraphElement = document.createElement( 'p' );
        const template: HTMLDivElement = document.createElement( 'div' );
        mdl.setAttribute( 'class', 'modal' );
        content.setAttribute( 'class', 'modal-content' );
        p.innerHTML = 'Game Paused';
        template.setAttribute( 'class', 'modal-template' );
        if ( showClose !== false ) {
            this.attachCloseButton( content );
        }
        content.appendChild( p );
        content.appendChild( template );
        mdl.appendChild( content );
        mdl.style.display = 'none';

        document.body.appendChild( mdl );
        this.mdl = mdl;
        this.p = p;
        this.content = content;
        this.template = template;
    }
    private attachCloseButton( content: HTMLDivElement ): void {
        const clsBtn: HTMLSpanElement = document.createElement( 'span' );
        clsBtn.setAttribute( 'class', 'closeBtn' );
        clsBtn.addEventListener( 'click', this.closeButton.bind( this ) );
        clsBtn.innerHTML = '&times;';
        content.appendChild( clsBtn );
    }
    public show( message: string, cb: Function ): void {
        this.cb = cb;
        this.p.innerHTML = message;
        this.mdl.style.display = 'block';
    }

    public showTemplate( message: string, template: HTMLElement, success?: Boolean ): void {
        if ( success === true ) {
            this.content.classList.add( 'success' );
        } else if ( success === false ) {
            this.content.classList.add( 'fail' );
        }
        this.mdl.style.display = 'block';
        this.p.innerHTML = message;
        this.template.appendChild( template );
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
        while (this.template.hasChildNodes()) {
            this.template.removeChild(this.template.lastChild);
        }
    }
}