import { SVGNAMESPACE } from 'App/GameBoard/Constants';

interface LineCordsI {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export class LevelBuilder extends HTMLElement {
  private static template: HTMLTemplateElement;

  // events
  private static size_update: string = 'size-update';

  private svg: SVGElement;
  private gridLineToggle: HTMLInputElement;
  private width: number;
  private height: number;

  public static domName: string = 'level-builder';

  // helpers
  private static getTemplate(): HTMLElement {
    if (!LevelBuilder.template) {
      LevelBuilder.template = <HTMLTemplateElement>document.getElementById(`${LevelBuilder.domName}-template`);
      if (!LevelBuilder.template) throw new Error(`Unabled to find a template for "${LevelBuilder.domName}-template"`);
    }
    return <HTMLElement>LevelBuilder.template.content.cloneNode(true);
  }
  constructor() {
    super();
    this.updateGridLines = this.updateGridLines.bind(this);
    this.updateSVGViewBox = this.updateSVGViewBox.bind(this);
    this.handleSizeUpdate = this.handleSizeUpdate.bind(this);

    this.addEventListener(LevelBuilder.size_update, this.handleSizeUpdate);

    const shadow: ShadowRoot = this.attachShadow({ mode: 'open' });
    const container: HTMLElement = LevelBuilder.getTemplate();

    const widthInput: HTMLInputElement = <HTMLInputElement>container.querySelector('#grid-width');
    widthInput.addEventListener('blur', () => {
      const width: number = +widthInput.value;
      if (width !== this.width) {
        this.width = width;
        this.dispatchEvent(new Event(LevelBuilder.size_update));
      }
    });
    this.width = +widthInput.value;

    const heightInput: HTMLInputElement = <HTMLInputElement>container.querySelector('#grid-height');
    heightInput.addEventListener('blur', () => {
      const height: number = +heightInput.value;
      if (height !== this.height) {
        this.height = height;
        this.dispatchEvent(new Event(LevelBuilder.size_update));
      }
    });
    this.height = +heightInput.value;

    this.svg = container.querySelector('svg');

    this.gridLineToggle = <HTMLInputElement>container.querySelector('#show-grid-lines');
    this.gridLineToggle.addEventListener('click', this.updateGridLines);

    this.handleSizeUpdate();

    shadow.appendChild(container);
  }

  private handleSizeUpdate(): void {
    this.updateSVGViewBox();
    this.updateGridLines();
  }

  private updateSVGViewBox(): void {
    this.svg.setAttribute( 'viewBox', `0 0 ${this.width} ${this.height}`);
  }

  private updateGridLines(): void {
    this.removeGridLines();
    const { svg } = this;
    function drawGridLine({ x1, x2, y1, y2 }: LineCordsI) {
      const line: SVGLineElement = document.createElementNS(SVGNAMESPACE, 'line');
      line.setAttribute('x1', `${x1}`);
      line.setAttribute('x2', `${x2}`);
      line.setAttribute('y1', `${y1}`);
      line.setAttribute('y2', `${y2}`);
      line.setAttribute('stroke', 'lightgray');
      line.setAttribute('stroke-width', '0.1');
      line.setAttribute('grid-line', '');
      svg.appendChild(line);
    }
    if (this.gridLineToggle.checked) {
      // draw vertical lines
      let i = 0;
      while (i++ < this.width) {
        drawGridLine({ x1: i, x2: i, y1: 0, y2: this.height });
      }
      i = 0;
      while (i++ < this.height) {
        drawGridLine({ x1: 0, x2: this.width, y1: i, y2: i });
      }
    }
  }

  private removeGridLines(): void {
    this.svg.querySelectorAll('line[grid-line]').forEach(l => this.svg.removeChild(l));
  }
}

