import { Cup, Drink, PouringBar, Order } from './gameElements.js';
import { mix_rgbs, getRandomInt, equalOrders, inputs, Volumes,
         inputImages, Events, FullScore, Fillings, Toppings,
         VolumeTranslation, convertRGB, TabIndexOffsets } from "./helpers.js";

class State {
    constructor(orders) {
        this.gameContainer = document.getElementById('gameContainer');
        this.orders = orders;
    }

    init() {
        this.gameContainer.replaceChildren();
    }

    dispose() {
        this.gameContainer.replaceChildren();
    }

    restart() {
        this.gameContainer.replaceChildren();
        this.init();
    }
}

class FillState extends State {
    constructor(orders) {
        super(orders);
        this.init();
    }

    init() {
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
        let offset = TabIndexOffsets.game;
        for (let filling of Object.keys(Fillings)) {
            let fillingButton = document.createElement('button');
            fillingButton.name = filling;
            fillingButton.textContent = Fillings[fillingButton.name];
            fillingButton.addEventListener('click', () => {
                this.cup.fill(fillingButton.name);
            });
            fillingButton.classList.add('filling-button');
            fillingButton.tabIndex = offset;
            fillingsContainer.append(fillingButton);
            offset++;
        }
        for (let topping of Object.keys(Toppings)) {
            let toppingButton = document.createElement('button');
            toppingButton.name = topping;
            toppingButton.textContent = Toppings[toppingButton.name];
            toppingButton.addEventListener('click', () => {
                this.cup.fill(toppingButton.name);
            });
            toppingButton.classList.add('filling-button');
            toppingButton.tabIndex = offset;
            toppingsContainer.append(toppingButton);
            offset++;
        }
    }

    restart() {
        this.gameContainer.replaceChildren();
        this.init();
    }
}

class MixState extends State {
    constructor(orders, cup) {
        super(orders); 
        this.cup = cup;
        this.arrowsButtons = {
            'ArrowLeft': null,
            'ArrowUp': null,
            'ArrowRight': null,
            'ArrowDown': null,
        };

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
        leftMixButton.classList.add('mix-button');
        leftMixButton.addEventListener('click', () => this.userInputs.push('left'));
        let leftImg = document.createElement('img');
        leftImg.src = 'img/left.png';
        leftImg.height = '100';
        leftMixButton.append(leftImg);
        this.arrowsButtons['ArrowLeft'] = leftMixButton;

        let upMixButton = document.createElement('button');
        upMixButton.id = 'upMixButton';
        upMixButton.classList.add('mix-button');
        upMixButton.addEventListener('click', () => this.userInputs.push('up'));
        let upImg = document.createElement('img');
        upImg.src = 'img/up.png';
        upImg.height = '100';
        upMixButton.append(upImg);
        this.arrowsButtons['ArrowUp'] = upMixButton;

        let rightMixButton = document.createElement('button');
        rightMixButton.id = 'rightMixButton';
        rightMixButton.classList.add('mix-button');
        rightMixButton.addEventListener('click', () => this.userInputs.push('right'));
        let rightImg = document.createElement('img');
        rightImg.src = 'img/right.png';
        rightImg.height = '100';
        rightMixButton.append(rightImg);
        this.arrowsButtons['ArrowRight'] = rightMixButton;

        let downMixButton = document.createElement('button');
        downMixButton.id = 'downMixButton';
        downMixButton.classList.add('mix-button');
        downMixButton.addEventListener('click', () => this.userInputs.push('down'));
        let downImg = document.createElement('img');
        downImg.src = 'img/down.png';
        downImg.height = '100';
        downMixButton.append(downImg);
        this.arrowsButtons['ArrowDown'] = downMixButton;

        [upMixButton, leftMixButton, rightMixButton, downMixButton].forEach((btn, i) => {
            btn.tabIndex = TabIndexOffsets.game + i;
        });
        mixButtonsContainer.append(leftMixButton, rightMixButton, downMixButton, upMixButton);
        
        this.gameContainer.append(cupContainer, mixButtonsContainer, requiredInputsContainer);
        this.cup.changeContainer(cupContainer);
        this.cup.draw();

        this.addKeyboardListeners();
    }

    restart() {
        this.userInputs = [];
    }

    dispose() {
        super.dispose();
        this.removeKeyboardListeners();
    }

    static keyNameToEvent = {
        'ArrowLeft': 'left',
        'ArrowUp': 'up',
        'ArrowRight': 'right',
        'ArrowDown': 'down',
    }

    // arrow-func to make this!==document when used as callback in document.addEventListener
    // todo: `onKeyDownEvent = onKeyDownEvent.bind(this)` may be clearer?
    onKeyDownEvent = (event) => {
        if (!(event.key in MixState.keyNameToEvent)) return;
        this.userInputs.push(MixState.keyNameToEvent[event.key]);
        this.arrowsButtons[event.key].classList.add('keyboardActive');
    }

    onKeyUpEvent = (event) => {
        if (!(event.key in MixState.keyNameToEvent)) return;
        this.arrowsButtons[event.key].classList.remove('keyboardActive');
    }

    addKeyboardListeners() {
        document.addEventListener('keydown', this.onKeyDownEvent);
        document.addEventListener('keyup', this.onKeyUpEvent);
    }

    removeKeyboardListeners() {
        document.removeEventListener('keydown', this.onKeyDownEvent);
        document.removeEventListener('keyup', this.onKeyUpEvent);
    }
}

class PourState extends State {
    constructor(orders, cup) {
        super(orders);
        this.cup = cup;
        this.init();
    }

    init() {
        this.gameContainer.replaceChildren();

        let cupContainer = document.createElement('div');
        cupContainer.id = 'cupContainer';
        cupContainer.classList.add('cup-container');

        let barElementsContainer = document.createElement('div');
        barElementsContainer.id = 'barElementsContainer';
        barElementsContainer.classList.add('bar-elements-container');

        let pouringBarContainer = document.createElement('div');
        pouringBarContainer.id = 'pouringBarContainer';
        pouringBarContainer.classList.add('pouring-bar-container');

        let pouringCupContainer = document.createElement('div');
        pouringCupContainer.id = 'pouringCupContainer';
        pouringCupContainer.classList.add('cup-container');

        this.pouringCup = new Drink(pouringCupContainer);

        for (let i = 1; i <= 2; i++) {
            let innerDiv = document.createElement('div');
            innerDiv.classList.add('divider');
            innerDiv.style.top = 33 * i + '%';
            pouringBarContainer.append(innerDiv);
        }   

        this.pouringBar = new PouringBar(pouringBarContainer);
                
        
        let stopButton = document.createElement('button');
        stopButton.id = 'stopButton';
        stopButton.textContent = 'Стоп'
        stopButton.classList.add('stop-button');
        stopButton.addEventListener('click', () => {
            this.pouringBar.stop();
            this.pouringCup.fill(this.pouringBar.progress, mix_rgbs(...componentColors));
            this.volume = Volumes[Math.floor(this.pouringCup.volume / 33.34) - 1];
        });
        stopButton.tabIndex = TabIndexOffsets.game;

        this.cup.changeContainer(cupContainer);
        this.cup.draw();

        barElementsContainer.append(pouringBarContainer, stopButton);

        this.gameContainer.append(cupContainer, pouringCupContainer, barElementsContainer);

        let componentColors = [];
        for (let component of this.cup.components) {
            let elem = document.getElementsByClassName(component)[0];
            let elemColor = getComputedStyle(elem).backgroundColor;
            componentColors.push(convertRGB(elemColor));
        }
    }

    restart() {
        this.gameContainer.replaceChildren();
        this.init();
        this.volume = undefined;
    }
}

class FinalState extends State {
    constructor(orders, components, volume) {
        super(orders);
        this.components = components;
        this.volume = volume;
        this.score = 0;

        this.gameContainer.replaceChildren();

        let scoreContainer =  document.createElement('div');
        scoreContainer.classList.add('container', 'score-container');

        let scoreText = document.createElement('h1');
        if (equalOrders(this.orders[0], this.components, this.volume)) {
            this.score += FullScore;
            this.orders.shift();
            let orderText = document.getElementById('orderText');
            if (this.orders.length === 0) {
                orderText.textContent = 'Следующий заказ:';
            } else {
                orderText.textContent = 'Следующий заказ: ' + this.orders[0].name + ' ' + VolumeTranslation[this.orders[0].volume];
            }
        }

        scoreText.textContent = this.score;

        scoreContainer.append(scoreText);

        this.gameContainer.append(scoreContainer);
    }

    restart() {
    }
}

export {FillState, MixState, PourState, FinalState}