export class ActionBar extends HTMLElement {
  private static template: HTMLTemplateElement;
  private editLevelInfo: HTMLElement;

  public static domName: string = 'action-bar';

  // helpers
  private static getTemplate(): HTMLElement {
    if (!ActionBar.template) {
      ActionBar.template = <HTMLTemplateElement>document.getElementById('action-bar-template');
    }
    return <HTMLElement>ActionBar.template.content.cloneNode(true);
  }

  // attributes
  static get observedAttributes() { return [ActionBar.selected_level_attribute]; }
  static selected_level_attribute: string = 'selected-level';

  // events
  static create_new_level: string = 'create-new-level';

  constructor() {
    super();
    const shadow: ShadowRoot = this.attachShadow({ mode: 'open' });
    const container: HTMLElement = ActionBar.getTemplate();
    this.editLevelInfo = container.querySelector('.edit-level-info');
    container.querySelector('button.upload').setAttribute('disabled', 'true');
    container.querySelector('button.create-new').addEventListener('click', () => {
      this.dispatchEvent(new Event(ActionBar.create_new_level));
    });
    shadow.appendChild(container);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === ActionBar.selected_level_attribute) {
      this.selectedLevelChangedCallback(oldValue, newValue);
    }
  }
  selectedLevelChangedCallback(_oldValue: string, newValue: string): void {
    if (this.hasAttribute(ActionBar.selected_level_attribute)) {
      this.editLevelInfo.innerHTML = newValue;
    }
  }
}
