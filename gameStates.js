import { Cup, Drink, PouringBar, Order } from './gameElements.js';
import { equalArrays, getRandomInt, equalOrders, inputs, Volumes, inputImages, Events, FullScore, Fillings, Toppings, VolumeTranslation } from "./helpers.js";

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

                let fillingMenuContainer = document.createElement('div');
                fillingMenuContainer.classList.add('filling-menu-container');

                let fillingTitleContainer = document.createElement('div');
                fillingTitleContainer.classList.add('filling-title-container'); 
                let fillingTitle = document.createElement('h2');
                fillingTitle.textContent = 'Основы';
                fillingTitleContainer.append(fillingTitle);

                let fillingsContainer = document.createElement('div');
                fillingsContainer.classList.add('filling-buttons-container');

                let toppingTitleContainer = document.createElement('div');
                toppingTitleContainer.classList.add('filling-title-container'); 
                let toppingTitle = document.createElement('h2');
                toppingTitle.textContent = 'Добавки';
                toppingTitleContainer.append(toppingTitle);

                let toppingsContainer = document.createElement('div');
                toppingsContainer.classList.add('filling-buttons-container');

                fillingMenuContainer.append(fillingTitleContainer, fillingsContainer, toppingTitleContainer, toppingsContainer);

                this.gameContainer.append(fillingMenuContainer);

                this.cup = new Cup(cupContainer);
                for (let filling of Object.keys(Fillings)){
                    let fillingButton = document.createElement('button');
                    fillingButton.name = filling;
                    fillingButton.textContent = Fillings[fillingButton.name];
                    fillingButton.addEventListener('click', () => {
                        this.cup.fill(fillingButton.name);
                    });
                    fillingButton.classList.add('filling-button');
                    fillingsContainer.append(fillingButton);
                }
                for (let topping of Object.keys(Toppings)){
                    let toppingButton = document.createElement('button');
                    toppingButton.name = topping;
                    toppingButton.textContent = Toppings[toppingButton.name];
                    toppingButton.addEventListener('click', () => {
                        this.cup.fill(toppingButton.name);
                    });
                    toppingButton.classList.add('filling-button');
                    toppingsContainer.append(toppingButton);
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
                mixButtonsContainer.classList.add('mix-buttons-container');

                let requiredInputsContainer = document.createElement('div');
                requiredInputsContainer.id = 'requiredInputsContainer';
                requiredInputsContainer.classList.add('container', 'required-inputs-container');

                this.requiredInputs = [];

                for (let i = 0; i < 3 + getRandomInt(3); i++) {
                    let direction = getRandomInt(4);
                    this.requiredInputs.push(inputs[direction]);
                    let arrowImage = document.createElement('img');
                    arrowImage.src = 'img/' + inputImages[direction];
                    requiredInputsContainer.append(arrowImage);
                }
                console.log(this.requiredInputs);

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
                
                this.gameContainer.append(cupContainer, mixButtonsContainer, requiredInputsContainer);
                this.cup.changeContainer(cupContainer);
                this.cup.draw();
                break;

            case Events.restart:
                this.userInputs = [];
                break;
        }
    }
}

class PourState extends State {
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

                let barElementsContainer = document.createElement('div');
                barElementsContainer.id = 'barElementsContainer';
                barElementsContainer.classList.add('container');

                let pouringBarContainer = document.createElement('div');
                pouringBarContainer.id = 'pouringBarContainer';
                pouringBarContainer.classList.add('container', 'pouring-bar-container');

                let pouringCupContainer = document.createElement('div');
                pouringCupContainer.id = 'pouringCupContainer';
                pouringCupContainer.classList.add('container', 'cup-container');

                this.pouringCup = new Drink(pouringCupContainer);

                for (let i = 1; i <= 2; i++){
                    let innerDiv = document.createElement('div');
                    innerDiv.classList.add('divider');
                    innerDiv.style.top = 33 * i + '%';
                    pouringBarContainer.append(innerDiv);
                }   

                this.pouringBar = new PouringBar(pouringBarContainer);
                
                let stopButton = document.createElement('button');
                stopButton.id = 'stopButton';
                stopButton.textContent = 'stop'
                stopButton.classList.add('button');
                stopButton.addEventListener('click', () => {
                    this.pouringBar.stop();
                    this.pouringCup.fill(this.pouringBar.progress);
                    this.volume = Volumes[Math.floor(this.pouringCup.volume / 33.34) - 1];
                });

                this.cup.changeContainer(cupContainer);
                this.cup.draw();

                barElementsContainer.append(pouringBarContainer, stopButton);

                this.gameContainer.append(cupContainer, pouringCupContainer, barElementsContainer);

                break;

            case Events.restart:
                this.gameContainer.replaceChildren();
                this.handleEvent(Events.init);
                this.volume = undefined;
                break;
        }
    }
}

class FinalState extends State {
    constructor(orders, components, volume){
        super(orders);
        this.components = components;
        this.volume = volume;
        this.score = 0;
        this.handleEvent(Events.init);
    }

    handleEvent(event) {
        switch(event) {
            case Events.init:
                this.gameContainer.replaceChildren();

                let scoreContainer =  document.createElement('div');
                scoreContainer.classList.add('container', 'score-container');

                let scoreText = document.createElement('h1');
                if (equalOrders(this.orders[0], this.components, this.volume)) {
                    this.score += FullScore;
                    this.orders.shift();
                    let orderText = document.getElementById('orderText');
                    if (this.orders.length === 0){
                        orderText.textContent = 'Следующий заказ:';
                    }
                    else {
                        orderText.textContent = 'Следующий заказ: ' + this.orders[0].name + ' ' + VolumeTranslation[this.orders[0].volume];
                    }
                }

                scoreText.textContent = this.score;

                scoreContainer.append(scoreText);

                this.gameContainer.append(scoreContainer);
                break;

            case Events.restart:
                break;
        }
    }
}

export {FillState, MixState, PourState, FinalState}