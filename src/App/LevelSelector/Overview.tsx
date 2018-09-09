import micro from 'micro';
import PlayerTypes from '../interfaces/PlayerTypes';

interface Details {
    level: number;
    defender: number;
    capture: number;
}

interface Props {
    levelNumber: string,
    defenderScore: string,
    captureScore: string,
    onStart: Function
}

interface State {
    selectedOption: PlayerTypes
}

export default class Overview {

    private state: State;
    private props: Props;
    private prevRender: JSX.IntrinsicElements;

    constructor(
        private extensionPoint: HTMLElement,
        private startLevel: Function
    ) {

        this.state = {
            selectedOption: PlayerTypes.defender,
        };

        this.props = {
            levelNumber: String ( 0 ),
            defenderScore: 'def',
            captureScore: 'cap',
            onStart: this.callStartLevel
        }

        this.mountComponent();
    }

    private mountComponent(): void {
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

    private render() {
        const {
            levelNumber,
            defenderScore,
            captureScore,
            onStart
        } = this.props;
        const { selectedOption } = this.state;
        const {
            defender,
            capture,
        } = PlayerTypes
        return (
            <div className='level-overview'>
                <h3>{`Level ${levelNumber}`}</h3>
                <div className='character-selector'>
                    <div
                        onClick={this.setOptionDefender}
                        className={`option ${selectedOption === defender ? 'selected' : ''}`}>
                        <h5>Defender</h5>
                        <h5>{`Highscore: ${defenderScore}`}</h5>
                    </div>
                    <div
                        onClick={this.setOptionCapture}
                        className={`option ${selectedOption === capture ? 'selected' : ''}`}>
                        <h5>Capture the Flag</h5>
                        <h5>{`Highscore: ${captureScore}`}</h5>
                    </div>
                </div>
                <button onClick={onStart}>START</button>
            </div>
        )
    }

    private callStartLevel = (): void => {
        this.startLevel(
            this.props.levelNumber,
            this.state.selectedOption
        );
    }

    private setState(newState: any) {
        this.state = {
            ...this.state,
            ...newState
        };
        this.updateComponent();
    }

    private setOptionDefender = (): void  => {
        this.setState({
            selectedOption: PlayerTypes.defender
        })
    }

    private setOptionCapture = (): void => {
        this.setState({
            selectedOption: PlayerTypes.capture
        })
    }

    public updateProps(props: any): void {
        this.props = {
            ...this.props,
            ...props
        }
        this.updateComponent();
    }
}
