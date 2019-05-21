export class LevelBuilder extends HTMLElement {
  private static template: HTMLTemplateElement;

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
    const shadow: ShadowRoot = this.attachShadow({ mode: 'open' });
    const container: HTMLElement = LevelBuilder.getTemplate();
    shadow.appendChild(container);
  }
}

