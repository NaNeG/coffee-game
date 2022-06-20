import { Cup, Drink, PouringBar } from './gameElements.js';
import { mix_rgbs, getRandomInt, equalOrders, Inputs, Volumes,
         inputImages, FullScore, Fillings, Toppings,
         convertRGB, TabIndexOffsets,
         componentsColors,
         CursedFillings,
         CursedToppings, curLang} from "./helpers.js";


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
    constructor(orders, previousOrder, firstTime) {
        super(orders);
        this.previousOrder = previousOrder;
        if (this.previousOrder == this.orders[0]) {
            firstTime = false;
        } else {
            firstTime = true;
        }
        this.init(firstTime);

    }

    init(firstTime) {
        this._recipesButton = document.getElementById('recipesButton');
        this._cursedRecipesButton = document.getElementById('cursedRecipesButton');

        let stageText = document.getElementById('stageText'); // todo: state or stage?
        stageText.textContent = curLang.fillStateText;

        this._cupContainer = this._createCupContainer();

        let fillingTitleContainer = this._createFillingTitleContainer();
        let fillingsContainer = this._createFillingsContainer();
        let toppingTitleContainer = this._createToppingTitleContainer();
        let toppingsContainer = this._createToppingsContainer();

        this._fillingMenuDimming = this._createFillingMenuDimming();
        this._toppingMenuDimming = this._createFillingMenuDimming();

        this.cup = new Cup(this._cupContainer);

        if (this.orders[0].isCursed) {
            this._addComponents(fillingsContainer, toppingsContainer, true);
            if (firstTime && (this.previousOrder == undefined || !this.previousOrder.isCursed)) {
                setTimeout(() => this._becomeCursed(), 750);
            } else {
                this._setCursedClassToElements();
            }

        } else {
            this._addComponents(fillingsContainer, toppingsContainer, false);
            this._displayRecipesButton(false);
            this._removeCursedClassFromElements();
        }

        this._fillGameContainer(fillingTitleContainer, fillingsContainer, this._fillingMenuDimming, toppingTitleContainer, toppingsContainer, this._toppingMenuDimming, this._cupContainer);
    }

    _displayRecipesButton(cursed = false) {
        this._cursedRecipesButton.style.display = cursed ? 'block' : 'none';
        this._recipesButton.style.display = cursed ? 'none' : 'block';
    }

    _removeCursedClassFromElements() {
        let h1Elements = document.getElementsByTagName("h1");
        for (let i = 0; i < h1Elements.length; i++) {
            h1Elements[i].classList.remove('cursed');
        }
        this._cupContainer.classList.remove('cursed');
        this._fillingMenuDimming.classList.remove('cursed');
        this._toppingMenuDimming.classList.remove('cursed');
    }

    _becomeCursed() {
        this._displayRecipesButton(true);
        this._setCursedClassToElements();
    }

    _setCursedClassToElements() {
        let h1Elements = document.getElementsByTagName("h1");
        for (let i = 0; i < h1Elements.length; i++) {
            h1Elements[i].classList.add('cursed');
        }
        // let h2Elements = document.getElementsByTagName("h2");
        // for (let i = 0; i < h2Elements.length; i++) {
        //     h2Elements[i].classList.add('cursed');
        // }
        // above never worked and probably for good
        this._cupContainer.classList.add('cursed');
        this._fillingMenuDimming.classList.add('cursed');
        this._toppingMenuDimming.classList.add('cursed');
    }

    _addComponents(fillingsContainer, toppingsContainer, cursed = false) {
        let offset = TabIndexOffsets.game; // todo: make via special obj
        for (let component of (cursed ? CursedFillings : Fillings)) {
            let button = this._createIngredientButton(component, curLang[component]);
            button.tabIndex = offset;
            fillingsContainer.append(button);
            offset++;
        }
        for (let component of (cursed ? CursedToppings : Toppings)) {
            let button = this._createIngredientButton(component, curLang[component]);
            button.tabIndex = offset;
            toppingsContainer.append(button);
            offset++;
        }
    }

    _fillGameContainer(fillingTitleContainer, fillingsContainer, fillingMenuDimming, toppingTitleContainer, toppingsContainer, toppingMenuDimming, cupContainer) {
        let fillingMenuContainer = this._createFillingMenuContainer();
        let toppingMenuContainer = this._createFillingMenuContainer();

        if (window.matchMedia("(min-width: 1251px)").matches) {
            this.gameContainer.style.flexWrap = 'nowrap';
            fillingMenuContainer.append(fillingTitleContainer, fillingsContainer, fillingMenuDimming);
            toppingMenuContainer.append(toppingTitleContainer, toppingsContainer, toppingMenuDimming);
            this.gameContainer.replaceChildren(fillingMenuContainer, cupContainer, toppingMenuContainer);
        } else {
            this.gameContainer.style.flexWrap = 'wrap';
            fillingMenuContainer.append(fillingTitleContainer, fillingsContainer, toppingTitleContainer, toppingsContainer, fillingMenuDimming);
            this.gameContainer.replaceChildren(cupContainer, fillingMenuContainer);
        }
    }

    _createFillingMenuContainer() {
        let fillingMenuContainer = document.createElement('div');
        fillingMenuContainer.classList.add('filling-menu-container');
        return fillingMenuContainer;
    }

    _createFillingMenuDimming() {
        let fillingMenuDimming = document.createElement('div');
        fillingMenuDimming.classList.add('filling-menu-dimming');
        return fillingMenuDimming;
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
        return this._createTitleContainer(curLang.fillStateToppingTitle);
    }

    _createFillingTitleContainer() {
        return this._createTitleContainer(curLang.fillStateFillingTitle);
    }

    _createCupContainer() {
        let cupContainer = document.createElement('div');
        cupContainer.id = 'cupContainer';
        cupContainer.classList.add('container', 'cup-container');
        return cupContainer;
    }

    _createTitleContainer(toppingTitle) {
        let titleContainer = document.createElement('div');
        titleContainer.classList.add('filling-title-container');
        let title = document.createElement('h2');
        title.textContent = toppingTitle;
        titleContainer.append(title);
        return titleContainer;
    }

    restart() {
        this.gameContainer.replaceChildren();
        this.init(false);
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

        this.gameContainer.style.flexWrap = 'wrap';

        let stageText = document.getElementById('stageText');
        stageText.textContent = curLang.mixStateText;

        let cupContainer = this._createCupContainer();
        let mixButtonsContainer = this._createMixButtonsContainer();
        let requiredInputsContainer = this._createRequiredInputsContainer();

        this.requiredInputs = [];

        for (let i = 0; i < 3 + getRandomInt(3); i++) { // todo: remove magic constants
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
        if (this.orders[0].isCursed) {
            cupContainer.classList.add('cursed');
        }
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
        if (this.orders[0].isCursed) {
            requiredInputsContainer.classList.add('cursed');
        }
        return requiredInputsContainer;
    }

    _createMixButton(dirName) {
        let mixButton = document.createElement('button');
        mixButton.id = dirName + 'MixButton';
        mixButton.classList.add('mix-button');
        mixButton.addEventListener('click', () => this._onMixButtonClick(dirName));
        let img = document.createElement('img');
        img.src = `img/${dirName}.png`;
        img.height = '100';
        mixButton.append(img);
        this._buttons[dirName] = mixButton;
        return mixButton;
    }

    _onMixButtonClick(dirName) {
        if (this.userInputs.length >= this.requiredInputs.length) {
            return;
        }
        this.userInputs.push(dirName);
        this.compareMixInput();
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
        this._onMixButtonClick(dirName);
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
        let elementOrder = this.userInputs.length - 1; // cannot be more than this.requiredIputs.length
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
            arrowObject.classList.remove(...arrowObject.classList);
        }
        let requiredInputsContainer = document.getElementById('requiredInputsContainer');

        if (this.orders[0].isCursed) {
            requiredInputsContainer.classList.add('flash-background-cursed');
            setTimeout(() => requiredInputsContainer.classList.remove('flash-background-cursed'), 1000);
        } else {
            requiredInputsContainer.classList.add('flash-background');
            setTimeout(() => requiredInputsContainer.classList.remove('flash-background'), 1000);
        }
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
        this.gameContainer.style = '';

        let stageText = document.getElementById('stageText');
        stageText.textContent = curLang.pourStateText;

        this._mixColor = mix_rgbs(...this.getComponentsColorsOfCup());
        console.log(this._mixColor);
        this.gameContainer.replaceChildren();

        let cupContainer = this._createCupContainer();

        let barElementsContainer = this._createBarElementsContainer();

        let pouringBarContainer = this._createPouringBarContainer();

        let pouringCupContainer = document.createElement('div');
        pouringCupContainer.id = 'pouringCupContainer';
        pouringCupContainer.classList.add('container', 'cup-container');
        if (this.orders[0].isCursed) {
            pouringCupContainer.classList.add('cursed');
        }

        this.pouringCup = new Drink(pouringCupContainer);

        this.pouringBar = new PouringBar(pouringBarContainer, this._mixColor);

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
        let volumeType = this.pouringBar.progress <= 33.34 ? 0
                       : this.pouringBar.progress <= 66.68 ? 1
                       : 2;
        this.volume = Volumes[volumeType];
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
        stopButton.textContent = curLang.pourStateStopButtonText;
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
        if (this.orders[0].isCursed) {
            cupContainer.classList.add('cursed');
        }
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

        let stageText = document.getElementById('stageText');
        stageText.textContent = curLang.finalStateText;

        let scoreContainer = document.createElement('div');
        scoreContainer.classList.add('final-info-container');

        let componentsEqualityContainer = document.createElement('div');
        componentsEqualityContainer.classList.add('final-info-container');

        let volumesEqualityContainer = document.createElement('div');
        volumesEqualityContainer.classList.add('final-info-container');

        let scoreText = document.createElement('h1');
        let streakText = document.createElement('h1');

        scoreContainer.append(scoreText, streakText);

        this.gameContainer.append(scoreContainer);

        if (this.orders[0].isCursed) {
            let h1Elements = document.getElementsByTagName("h1");
            for (let i = 0; i < h1Elements.length; i++) {
                h1Elements[i].classList.add('cursed');
            }
        }
        if (equalOrders(this.orders[0], this.components, this.volume)) {
            if (this.orders[0].isCursed) {
                this.score += 3 * (FullScore + FullScore * this.streak / 2);
            } else {
                this.score += FullScore + FullScore * this.streak / 2;
            }
            this.streak++;
            this.currentOrder = this.orders.shift();
            let orderText = document.getElementById('orderText');
            if (this.orders.length === 0) {
                orderText.textContent = ''; // todo: why empty?
            } else {
                orderText.textContent = curLang.orderText(curLang[this.orders[0].name], this.orders[0].volume);
            }
        } else {
            this.currentOrder = this.orders[0];
            this.streak = 0;
        }

        scoreText.textContent = curLang.orderScoreText(this.score);
        streakText.textContent = curLang.streakText(this.streak);
    }

    restart() {

    }
}

export {FillState, MixState, PourState, FinalState}