// TODO: create all the components for selecting levels
//          - have a playground level where they can play with all the features
import Modal from '../Modal';
import levelOne from './levels/1/Level';

export default class LevelSelector {

    private modal: Modal;

    constructor() {
        this.modal = new Modal();
    }

    public chooseLevel(): Promise<any> {
        let pro = new Promise(( resolve, reject ) => {
            setTimeout( () => {
                resolve( levelOne );
            }, 1000);
        });
        return pro;
    }

}