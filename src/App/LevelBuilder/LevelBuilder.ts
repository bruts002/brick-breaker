import { ActionBar } from './ActionBar';

export class LevelBuilder extends HTMLElement {
  private static template: HTMLTemplateElement;

  public static domName: string = 'level-builder';

  // helpers
  private static getTemplate(): HTMLElement {
    if (!LevelBuilder.template) {
      LevelBuilder.template = <HTMLTemplateElement>document.getElementById('level-builder-template');
    }
    return <HTMLElement>LevelBuilder.template.content.cloneNode(true);
  }
  constructor() {
    super();
    const shadow: ShadowRoot = this.attachShadow({ mode: 'open' });
    const container: HTMLElement = LevelBuilder.getTemplate();
    container.querySelector(ActionBar.domName).addEventListener(ActionBar.create_new_level, () => {
      this.dispatchEvent(new Event(ActionBar.create_new_level, { bubbles: true }));
    });
    shadow.appendChild(container);
  }
}
