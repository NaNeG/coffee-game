import { Cup, Drink, PouringBar, Order } from './gameElements.js';
import { mix_rgbs, getRandomInt, equalOrders, Inputs, Volumes,
         inputImages, Events, FullScore, Fillings, Toppings,
         VolumeTranslation, convertRGB, TabIndexOffsets, equalComponents,
         getArrayDifference, getArrayIntersection, ComponentTranslation,
         componentsColors } from "./helpers.js";

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

        let fillingMenuButtons = document.createElement('div'); // todo: unused

        let fillingMenuDimming = document.createElement('div');
        fillingMenuDimming.classList.add('filling-menu-dimming');

        let fillingMenuContainer = document.createElement('div');
        fillingMenuContainer.classList.add('filling-menu-container');
        fillingMenuContainer.append(fillingTitleContainer, fillingsContainer, toppingTitleContainer, toppingsContainer, fillingMenuDimming);

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
            this.requiredInputs.push(Inputs[direction]);
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
        mixButton.addEventListener('click', () => {
            this.userInputs.push(dirName);
            this.compareMixInput();
        });
        let img = document.createElement('img');
        img.src = `img/${dirName}.png`;
        img.height = '100';
        mixButton.append(img);
        this._buttons[dirName] = mixButton;
        return mixButton;
    }

    restart() {
        this.resetInputs(); // todo: inline?
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

    compareMixInput() {
        let elementOrder = this.userInputs.length - 1;
        let arrowObject = document.querySelector(`#requiredInputsContainer :nth-child(${elementOrder + 1})`);
        console.log(arrowObject);
        if (this.requiredInputs[elementOrder] == this.userInputs[elementOrder]) {
            arrowObject.classList.add('green-tint');
        } else {
            arrowObject.classList.add('red-tint');
        }
    }

    resetInputs() {
        for (let i = 1; i <= this.userInputs.length; i++) {
            let arrowObject = document.querySelector(`#requiredInputsContainer :nth-child(${i})`);
            // todo: userInputs.length > number of children in requiredInputsContainer causes bug
            arrowObject.classList.remove(...arrowObject.classList);
        }
        let requiredInputsContainer = document.getElementById('requiredInputsContainer');
        requiredInputsContainer.classList.add('flash-background');
        setTimeout(() => requiredInputsContainer.classList.remove('flash-background'), 1000);
        this.userInputs = [];
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
    constructor(orders, components, volume, streak){
        super(orders);
        this.components = components;
        this.volume = volume;
        this.score = 0;
        this.streak = streak;

        this.gameContainer.replaceChildren();

        let scoreContainer =  document.createElement('div');
        scoreContainer.classList.add('final-info-container');

        let componentsEqualityContainer = document.createElement('div');
        componentsEqualityContainer.classList.add('final-info-container');

        let volumesEqualityContainer = document.createElement('div');
        volumesEqualityContainer.classList.add('final-info-container');

        let scoreText = document.createElement('h1');
        let streakText = document.createElement('h1');

        let addedComponentsText = document.createElement('h1');
        let requiredComponentsText = document.createElement('h1');
        let componentDifferenceText = document.createElement('h1');

        let addedVolumeText = document.createElement('h1');
        let requiredVolumeText = document.createElement('h1');

        addedComponentsText.textContent = `Ваш состав: ${this.components.map(x => ComponentTranslation[x]).join(', ')}`;
        requiredComponentsText.textContent = `Требуемый состав: ${this.orders[0].components.map(x => ComponentTranslation[x]).join(', ')}`;

        if (getArrayDifference(this.components, this.orders[0].components).length !== 0) {
            componentDifferenceText.textContent = `Разница: ${getArrayDifference(this.components, this.orders[0].components).map(x => ComponentTranslation[x]).join(', ')}`;
        }

        addedVolumeText.textContent = `Ваш объем: ${VolumeTranslation[this.volume]}`;
        requiredVolumeText.textContent = `Требуемый объем: ${VolumeTranslation[this.orders[0].volume]}`;

        if (equalOrders(this.orders[0], this.components, this.volume)) {
            this.score += FullScore + FullScore * this.streak / 2;
            this.streak++;
            this.orders.shift();
            let orderText = document.getElementById('orderText');
            if (this.orders.length === 0) {
                orderText.textContent = ''; // todo: why empty?
            } else {
                orderText.textContent = `Следующий заказ: ${this.orders[0].name} ${VolumeTranslation[this.orders[0].volume]}`;
            }
        } else {
            this.streak = 0;
        }

        scoreText.textContent = `Ваш счет: ${this.score}`;
        streakText.textContent = `Серия: ${this.streak}`;

        scoreContainer.append(scoreText, streakText);

        componentsEqualityContainer.append(addedComponentsText, requiredComponentsText, componentDifferenceText);
        volumesEqualityContainer.append(addedVolumeText, requiredVolumeText);

        this.gameContainer.append(scoreContainer, componentsEqualityContainer, volumesEqualityContainer);
    }

    restart() {
    }
}

export {FillState, MixState, PourState, FinalState}