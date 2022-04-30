import { Cup} from './gameElements.js';

const fillEvents = {
    init: 'init',
    restart: 'restart',
    nextState: 'nextState',
}


class State{
    constructor(orders) {
        this.orders = orders;
    }
}

class FillState extends State{
    constructor(orders){
        super(orders);
        this.handleEvent(fillEvents.init);
    }

    handleEvent(event) {
        switch(event) {
            case fillEvents.init:
                document.body.replaceChildren();
                let gameContainer = document.createElement('div');
                gameContainer.id = 'gameContainer';
                document.body.append(gameContainer);
                let cupContainer = document.createElement('div');
                cupContainer.id = 'cupContainer';
                cupContainer.classList.add('container', 'cup-container');
                gameContainer.append(cupContainer);
                let fillingsContainer = document.createElement('div');
                fillingsContainer.classList.add('container', 'filling-menu-container');
                gameContainer.append(fillingsContainer);
                this.cup = new Cup(cupContainer);
                for (let i = 0; i < 3; i++){
                    let fillingButton = document.createElement('button');
                    if (i === 0) {
                        fillingButton.name = 'tea';
                    }
                    else if (i === 1) {
                        fillingButton.name = 'coffee';
                    }
                    else if (i === 2) {
                        fillingButton.name = 'juice';
                    }
                    fillingButton.textContent = fillingButton.name;
                    fillingButton.addEventListener('click', () => {
                        this.cup.fill(fillingButton.name);
                        console.log(this.cup.contents);
                    });
                    fillingsContainer.append(fillingButton);
                }
                break;
        }
    }
}

export {FillState}