import { ActionBar } from './ActionBar';

export class LevelBuilderAdmin extends HTMLElement {
  private static template: HTMLTemplateElement;

  public static domName: string = 'level-builder-admin';

  // helpers
  private static getTemplate(): HTMLElement {
    if (!LevelBuilderAdmin.template) {
      LevelBuilderAdmin.template = <HTMLTemplateElement>document.getElementById('level-builder-admin-template');
    }
    return <HTMLElement>LevelBuilderAdmin.template.content.cloneNode(true);
  }
  constructor() {
    super();
    const shadow: ShadowRoot = this.attachShadow({ mode: 'open' });
    const container: HTMLElement = LevelBuilderAdmin.getTemplate();
    container.querySelector(ActionBar.domName).addEventListener(ActionBar.create_new_level, () => {
      this.dispatchEvent(new Event(ActionBar.create_new_level, { bubbles: true }));
    });
    shadow.appendChild(container);
  }
}
