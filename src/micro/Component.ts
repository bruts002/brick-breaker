import micro from 'micro'

export default abstract class Component<State, Props> {
  protected state: State;
  protected prevRender: JSX.IntrinsicElements;
  private extensionPoint: HTMLElement;

  constructor( protected props: Props ) {
  }

  public __setExtensionPoint(extensionPoint: HTMLElement) {
    this.extensionPoint = extensionPoint;
  }

  protected mountComponent(): void {
      this.prevRender = this.render();
      micro.render(
          this.prevRender,
          this.extensionPoint
      );
  }

  private updateComponent(): void {
      const newRender = this.render();
      micro.updateElement(
          this.extensionPoint,
          newRender,
          this.prevRender
      );
      this.prevRender = newRender
  }

  protected setState(newState: any) {
      this.state = {
          ...<Object>this.state,
          ...newState
      };
      this.updateComponent();
  }

  public updateProps(props: any): void {
      this.props = {
          ...<Object>this.props,
          ...props
      }
      this.updateComponent();
  }

  public abstract render(): JSX.IntrinsicElements;

}
