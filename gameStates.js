import { Cup, Drink, PouringBar, Order } from './gameElements.js';
import { mix_rgbs, getRandomInt, equalOrders, inputs, Volumes,
         inputImages, Events, FullScore, Fillings, Toppings,
         VolumeTranslation, convertRGB, TabIndexOffsets, componentsColors } from "./helpers.js";

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
        let cupContainer = this._createCupContainer();

        let fillingTitleContainer = this._createFillingTitleContainer();
        let fillingsContainer = this._createFillingsContainer();
        let toppingTitleContainer = this._createToppingTitleContainer();
        let toppingsContainer = this._createToppingsContainer();

        let fillingMenuContainer = document.createElement('div');
        fillingMenuContainer.classList.add('filling-menu-container');
        fillingMenuContainer.append(fillingTitleContainer, fillingsContainer, toppingTitleContainer, toppingsContainer);

        this.cup = new Cup(cupContainer);
        let offset = TabIndexOffsets.game;
        for (let [name, translation] of Object.entries(Fillings)) {
            let button = this._createIngredientButton(name, translation);
            button.tabIndex = offset;
            fillingsContainer.append(button);
            offset++;
        }
        for (let [engName, translation] of Object.entries(Toppings)) {
            let button = this._createIngredientButton(engName, translation);
            button.tabIndex = offset;
            toppingsContainer.append(button);
            offset++;
        }
        
        this.gameContainer.replaceChildren(cupContainer, fillingMenuContainer);
    }

    _createIngredientButton(engName, translation) {
        let button = document.createElement('button');
        button.name = engName;
        button.textContent = translation;
        button.addEventListener('click', () => {
            this.cup.fill(engName);
        });
        button.classList.add('filling-button');
        return button;
    }

    _createToppingsContainer() {
        let toppingsContainer = document.createElement('div');
        toppingsContainer.classList.add('filling-buttons-container');
        return toppingsContainer;
    }

    _createFillingsContainer() {
        let fillingsContainer = document.createElement('div');
        fillingsContainer.classList.add('filling-buttons-container');
        return fillingsContainer;
    }

    _createToppingTitleContainer() {
        let toppingTitleContainer = document.createElement('div');
        toppingTitleContainer.classList.add('filling-title-container');
        let toppingTitle = document.createElement('h2');
        toppingTitle.textContent = 'Добавки';
        toppingTitleContainer.append(toppingTitle);
        return toppingTitleContainer;
    }

    _createFillingTitleContainer() {
        let fillingTitleContainer = document.createElement('div');
        fillingTitleContainer.classList.add('filling-title-container');
        let fillingTitle = document.createElement('h2');
        fillingTitle.textContent = 'Основы';
        fillingTitleContainer.append(fillingTitle);
        return fillingTitleContainer;
    }

    _createCupContainer() {
        let cupContainer = document.createElement('div');
        cupContainer.id = 'cupContainer';
        cupContainer.classList.add('container', 'cup-container');
        return cupContainer;
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
        this._buttons = {
            'left': null,
            'up': null,
            'right': null,
            'down': null,
        };

        let cupContainer = this._createCupContainer();
        let mixButtonsContainer = this._createMixButtonsContainer();
        let requiredInputsContainer = this._createRequiredInputsContainer();

        this.requiredInputs = [];

        for (let i = 0; i < 3 + getRandomInt(3); i++) {
            let direction = getRandomInt(4);
            this.requiredInputs.push(inputs[direction]);
            let arrowImage = document.createElement('img');
            arrowImage.src = 'img/' + inputImages[direction];
            requiredInputsContainer.append(arrowImage);
        }

        this.userInputs = [];

        let leftMixButton = this._createMixButton('left');
        let upMixButton = this._createMixButton('up');
        let rightMixButton = this._createMixButton('right');
        let downMixButton = this._createMixButton('down');

        [upMixButton, leftMixButton, rightMixButton, downMixButton].forEach(
            (btn, i) => btn.tabIndex = TabIndexOffsets.game + i
        );
        mixButtonsContainer.append(leftMixButton, rightMixButton, downMixButton, upMixButton);
        
        this.gameContainer.replaceChildren(cupContainer, mixButtonsContainer, requiredInputsContainer);
        this.cup.changeContainer(cupContainer);
        this.cup.draw();

        this.addKeyboardListeners();
    }

    _createCupContainer() {
        let cupContainer = document.createElement('div');
        cupContainer.id = 'cupContainer';
        cupContainer.classList.add('container', 'cup-container');
        return cupContainer;
    }

    _createMixButtonsContainer() {
        let mixButtonsContainer = document.createElement('div');
        mixButtonsContainer.id = 'mixButtonsContainer';
        mixButtonsContainer.classList.add('mix-buttons-container');
        return mixButtonsContainer;
    }

    _createRequiredInputsContainer() {
        let requiredInputsContainer = document.createElement('div');
        requiredInputsContainer.id = 'requiredInputsContainer';
        requiredInputsContainer.classList.add('container', 'required-inputs-container');
        return requiredInputsContainer;
    }

    _createMixButton(dirName) {
        let mixButton = document.createElement('button');
        mixButton.id = dirName + 'MixButton';
        mixButton.classList.add('mix-button');
        mixButton.addEventListener('click', () => this.userInputs.push(dirName));
        let img = document.createElement('img');
        img.src = `img/${dirName}.png`;
        img.height = '100';
        mixButton.append(img);
        this._buttons[dirName] = mixButton;
        return mixButton;
    }

    restart() {
        this.userInputs = [];
    }

    dispose() {
        super.dispose();
        this.removeKeyboardListeners();
    }

    static keyNameToDirectionName = {
        'ArrowLeft': 'left',
        'ArrowUp': 'up',
        'ArrowRight': 'right',
        'ArrowDown': 'down',
    }

    // arrow-func to make this!==document when used as callback in document.addEventListener
    // todo: `onKeyDownEvent = onKeyDownEvent.bind(this)` may be clearer?
    _onKeyDownEvent = (event) => {
        if (!(event.key in MixState.keyNameToDirectionName)) return;
        let dirName = MixState.keyNameToDirectionName[event.key];
        this.userInputs.push(dirName);
        this._buttons[dirName].classList.add('keyboardActive');
    }

    _onKeyUpEvent = (event) => {
        if (!(event.key in MixState.keyNameToDirectionName)) return;
        let dirName = MixState.keyNameToDirectionName[event.key];
        this._buttons[dirName].classList.remove('keyboardActive');
    }

    addKeyboardListeners() {
        document.addEventListener('keydown', this._onKeyDownEvent);
        document.addEventListener('keyup', this._onKeyUpEvent);
    }

    removeKeyboardListeners() {
        document.removeEventListener('keydown', this._onKeyDownEvent);
        document.removeEventListener('keyup', this._onKeyUpEvent);
    }
}

class PourState extends State {
    constructor(orders, cup) {
        super(orders);
        this.cup = cup;
        this.init();
    }

    init() {
        this._mixColor = mix_rgbs(...this.getComponentsColorsOfCup());
        this.gameContainer.replaceChildren();

        let cupContainer = this._createCupContainer();

        let barElementsContainer = this._createBarElementsContainer();

        let pouringBarContainer = this._createPouringBarContainer();

        let pouringCupContainer = document.createElement('div');
        pouringCupContainer.id = 'pouringCupContainer';
        pouringCupContainer.classList.add('cup-container');

        this.pouringCup = new Drink(pouringCupContainer);

        this.pouringBar = new PouringBar(pouringBarContainer);
        
        let stopButton = this._createStopButton();

        this.cup.changeContainer(cupContainer);
        this.cup.draw();

        barElementsContainer.append(pouringBarContainer, stopButton);

        this.gameContainer.append(cupContainer, pouringCupContainer, barElementsContainer);
    }

    // arrow-func to make this!==document when used as callback in document.addEventListener
    // todo: `_stop = _stop.bind(this)` may be clearer?
    _stop = () => {
        this.pouringBar.stop();
        this.pouringCup.fill(this.pouringBar.progress, this._mixColor);
        this.volume = Volumes[Math.floor(this.pouringCup.volume / 33.34) - 1];
    }

    _createPouringBarContainer() {
        let pouringBarContainer = document.createElement('div');
        pouringBarContainer.id = 'pouringBarContainer';
        pouringBarContainer.classList.add('pouring-bar-container');

        for (let i = 1; i <= 2; i++) {
            let innerDiv = document.createElement('div');
            innerDiv.classList.add('divider');
            innerDiv.style.top = 33 * i + '%';
            pouringBarContainer.append(innerDiv);
        }
        return pouringBarContainer;
    }

    _createBarElementsContainer() {
        let barElementsContainer = document.createElement('div');
        barElementsContainer.id = 'barElementsContainer';
        barElementsContainer.classList.add('bar-elements-container');
        return barElementsContainer;
    }

    _createStopButton() {
        let stopButton = document.createElement('button');
        stopButton.id = 'stopButton';
        stopButton.textContent = 'Стоп';
        stopButton.classList.add('stop-button');
        stopButton.addEventListener('click', this._stop);
        stopButton.tabIndex = TabIndexOffsets.game;
        return stopButton;
    }

    getComponentsColorsOfCup() {
        let usedComponentsColors = [];
        for (let component of this.cup.components) {
            let componentColor = componentsColors[component];
            usedComponentsColors.push(convertRGB(componentColor));
        }
        return usedComponentsColors;
    }

    _createCupContainer() {
        let cupContainer = document.createElement('div');
        cupContainer.id = 'cupContainer';
        cupContainer.classList.add('container', 'cup-container');
        return cupContainer;
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