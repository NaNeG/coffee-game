import { Cup } from './gameElements.js';
import { equalArrays, getRandomInt } from "./helpers.js";

const inputs = {
    0: 'up',
    1: 'right',
    2: 'down',
    3: 'left',
}

const Events = {
    init: 'init',
    restart: 'restart',
    dispose: 'dispose',
    nextState: 'nextState',
}


class State {
    constructor(orders) {
        this.gameContainer = document.getElementById('gameContainer');
        this.orders = orders;
    }

    handleEvent(event) {
        switch(event) {
            case Events.init:
                this.gameContainer.replaceChildren();
                break;

            case Events.dispose:
                this.gameContainer.replaceChildren();
                break;

            case Events.restart:
                this.gameContainer.replaceChildren();
                this.handleEvent(Events.init);
                break;
        }
    }
}

class FillState extends State {
    constructor(orders){
        super(orders);   
        this.handleEvent(Events.init);
    }

    handleEvent(event) {
        switch(event) {
            case Events.init:
                this.gameContainer.replaceChildren();

                let cupContainer = document.createElement('div');
                cupContainer.id = 'cupContainer';
                cupContainer.classList.add('container', 'cup-container');

                this.gameContainer.append(cupContainer);

                let fillingsContainer = document.createElement('div');
                fillingsContainer.classList.add('container', 'filling-menu-container');

                this.gameContainer.append(fillingsContainer);

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
                        this.cup.fill(fillingButton.name, true);
                        // console.log(this.cup.fillings);
                    });
                    fillingsContainer.append(fillingButton);
                }
                for (let i = 0; i < 3; i++){
                    let toppingButton = document.createElement('button');
                    if (i === 0) {
                        toppingButton.name = 'cocoa';
                    }
                    else if (i === 1) {
                        toppingButton.name = 'caramel';
                    }
                    else if (i === 2) {
                        toppingButton.name = 'milk';
                    }
                    toppingButton.textContent = toppingButton.name;
                    toppingButton.addEventListener('click', () => {
                        this.cup.fill(toppingButton.name, false);
                        // console.log(this.cup.fillings);
                    });
                    fillingsContainer.append(toppingButton);
                }
                break;

            case Events.restart:
                this.gameContainer.replaceChildren();
                this.handleEvent(Events.init);
                break;
        }
        
    }
}

class MixState extends State {
    constructor(orders, cup){  
        super(orders); 
        this.cup = cup;
        this.handleEvent(Events.init);
    }

    handleEvent(event) {
        switch(event) {
            case Events.init:
                this.gameContainer.replaceChildren();

                let cupContainer = document.createElement('div');
                cupContainer.id = 'cupContainer';
                cupContainer.classList.add('container', 'cup-container');

                let mixButtonsContainer = document.createElement('div');
                mixButtonsContainer.id = 'mixButtonsContainer';
                mixButtonsContainer.classList.add('container', 'mix-buttons-container');

                this.correctInputs = [];

                for (let i = 0; i < 3 + getRandomInt(3); i++) {
                    this.correctInputs.push(inputs[getRandomInt(4)]);
                }
                console.log(this.correctInputs);

                this.userInputs = [];

                let leftMixButton = document.createElement('button');
                leftMixButton.id = 'leftMixButton';
                leftMixButton.addEventListener('click', () => this.userInputs.push('left'));

                let upMixButton = document.createElement('button');
                upMixButton.id = 'upMixButton';
                upMixButton.addEventListener('click', () => this.userInputs.push('up'));

                let rightMixButton = document.createElement('button');
                rightMixButton.id = 'rightMixButton';
                rightMixButton.addEventListener('click', () => this.userInputs.push('right'));

                let downMixButton = document.createElement('button');
                downMixButton.id = 'downMixButton';
                downMixButton.addEventListener('click', () => this.userInputs.push('down'));

                mixButtonsContainer.append(leftMixButton, rightMixButton, downMixButton, upMixButton);
                
                this.gameContainer.append(cupContainer, mixButtonsContainer);
                this.cup.container = cupContainer;
                this.cup.draw();
                break;

            case Events.restart:
                this.userInputs = [];
                break;
        }
    }
}

class PourState extends State {
    constructor(orders){
        super(orders);
        this.handleEvent(Events.init);
    }

    handleEvent(event) {
        switch(event) {
            case Events.init:
                this.gameContainer.replaceChildren();
                break;

            case Events.restart:
                this.gameContainer.replaceChildren();
                this.handleEvent(Events.init);
                break;
        }
    }
}

class FinalState extends State {
    constructor(orders){
        super(orders);
    }

    handleEvent(event) {
        switch(event) {
            case Events.init:
                this.gameContainer.replaceChildren();
                break;

            case Events.restart:
                this.gameContainer.replaceChildren();
                this.handleEvent(Events.init);
                break;
        }
    }
}

export {FillState, MixState, PourState, FinalState}