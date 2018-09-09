import micro, { Component } from 'micro';
import PlayerTypes from '../interfaces/PlayerTypes';

interface Details {
    level: number;
    defender: number;
    capture: number;
}

interface Props {
    levelNumber?: string,
    defenderScore?: string,
    captureScore?: string,
    startLevel?: Function
}

interface State {
    selectedOption: PlayerTypes
}

export default class Overview extends Component<State, Props> {

    constructor(
        extensionPoint: HTMLElement,
        props: Props
    ) {
        super(extensionPoint, props);

        this.state = {
            selectedOption: PlayerTypes.defender,
        };

        this.props = {
            levelNumber: String ( 0 ),
            defenderScore: 'def',
            captureScore: 'cap',
            startLevel: this.callStartLevel
        }

        this.mountComponent();
    }


    protected render() {
        const {
            levelNumber,
            defenderScore,
            captureScore,
            startLevel
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
                <button onClick={startLevel}>START</button>
            </div>
        )
    }

    private callStartLevel = (): void => {
        this.props.startLevel(
            this.props.levelNumber,
            this.state.selectedOption
        );
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
}
