import { Cup } from './gameElements.js';

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

                let toppingsContainer = document.createElement('div');
                toppingsContainer.classList.add('container', 'filling-menu-container');

                this.gameContainer.append(fillingsContainer, toppingsContainer);

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

                this.gameContainer.append(cupContainer);
                this.cup.container = cupContainer;
                this.cup.draw();
                break;

            case Events.restart:
                this.gameContainer.replaceChildren();
                this.handleEvent(Events.init);
                break;
        }
    }
}

class PourState extends State {
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