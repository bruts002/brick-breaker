import './tab-container.css';
export default class TabContainer {
  public container: HTMLDivElement;
  private controls: HTMLElement;
  private filler: HTMLElement;
  private content: HTMLElement;
  private tabOptions: any;
  private activeTab: string;

  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('tab-container');
    this.container.innerHTML = `
    <div class='tab-container__controls'>
        <div class='filler'></div>
    </div>
    <div class='tab-container__content' />
    `;
    this.controls = this.container.querySelector('.tab-container__controls');
    this.filler = this.container.querySelector('.filler');
    this.content = this.container.querySelector('.tab-container__content');
    this.tabOptions = {};

  }
  addTab(title: string, content: HTMLElement, show?: boolean) {
    if (this.tabOptions[title])
      throw new Error(`Tab with title "${title} already exists!`);

    const button = document.createElement('button');
    const text = document.createTextNode(title);
    button.appendChild(text);
    button.addEventListener('click', () => this.showTab(title));
    this.controls.insertBefore(button, this.filler);
    content.style.display = 'none';
    this.content.insertAdjacentElement('beforeend', content);
    this.tabOptions[title] = {
      button,
      content
    };
    if (show === true) {
      this.showTab(title);
    }
  }
  showTab(title: string) {
    if (this.activeTab) {
      this.tabOptions[this.activeTab].button.classList.remove('active');
      this.tabOptions[this.activeTab].content.style.display = 'none';
    }
    this.tabOptions[title].button.classList.add('active');
    this.tabOptions[title].content.style.display = '';
    this.activeTab = title;
  }
}
