import { Order } from "./gameElements.js";
import { FillState, MixState, PourState, FinalState, addRipple, removeRipple } from "./gameStates.js";
import { equalArrays, getRandomInt, setRandomInterval, Volumes, ArcadeGameTime } from "./helpers.js";
import { CursedRecipes, Recipes } from "./recipes.js";
import { Languages } from "./translations.js";

const curLangName = 'russian';
const curLang = Languages[curLangName];

export class GameSession {
    score = 0;
    streak = 0;
    totalOrders = 0;
    correctOrders = 0;
    _orders = [];

    constructor(playerId, mode) {
        this.playerId = playerId;
        this._firstOrder = true;
        this._createOrder();
        this._gameState = new FillState(this._orders, undefined);
        this.mode = mode;
        switch (mode) {
            case 'classic':
                this.updateMistakeCounter();
                break;

            case 'arcade':
                this.gameTime = ArcadeGameTime;
                this.updateArcadeTimer();
                break;

            case 'infinite':
                this.gameTime = 0;
                this.updateInfiniteTimer();
                break;
        }
        this._orderCreator = setRandomInterval(() => {
            this._createOrder();
        }, 5000, 15000);
    }

    updateMistakeCounter() {
        let mistakeCounter = document.getElementById('modeInfo');
        mistakeCounter.textContent = curLang.mistakeCounterText(this.totalOrders - this.correctOrders);
    }

    updateInfiniteTimer() {
        let timer = document.getElementById('modeInfo');
        this.timerUpdater = setInterval(() => {
            this.gameTime += 1;
            timer.textContent = curLang.timerText(this.gameTime);
        }, 1000);
    }

    updateArcadeTimer() {
        let timer = document.getElementById('modeInfo');
        this.timerUpdater = setInterval(() => {
            this.gameTime -= 1;
            timer.textContent = curLang.timerText(this.gameTime);
        }, 1000);
    }

    _createOrder() {
        let volume = Volumes[getRandomInt(Volumes.length)];
        let nextStateButton = document.getElementById('nextStateButton');
        nextStateButton.disabled = false;
        if (getRandomInt(2) === 0) {
            let recipe = CursedRecipes[getRandomInt(CursedRecipes.length)];
            this._orders.push(new Order(recipe, volume, true));
            if (this._firstOrder) {
                addRipple();
            } else if (this._orders[0].isCursed && this._gameState instanceof FinalState && !this._gameState.currentOrder.isCursed) {
                nextStateButton.addEventListener('click', rippleEventListener = addRipple.bind(nextStateButton));
            }
            console.log(recipe.components, recipe.name, volume);
        } else {
            let recipe = Recipes[getRandomInt(Recipes.length)];
            this._orders.push(new Order(recipe, volume, false));
            if (!this._orders[0].isCursed && this._gameState instanceof FinalState && this._gameState.currentOrder.isCursed) {
                nextStateButton.addEventListener('click', rippleEventListener = removeRipple.bind(nextStateButton));
            }
            console.log(recipe.components, recipe.name, volume);
        }
        this._firstOrder = false;
        let orderText = document.getElementById('orderText');
        if (orderText.textContent == '') {
            orderText.textContent = curLang.orderText(curLang[this._orders[0].name], this._orders[0].volume);
        }
    }

    nextState() {
        if (this._gameState instanceof FillState) {
            this._getFillStateToNext();
        } else if (this._gameState instanceof MixState) {
            this._getMixStateToNext();
        } else if (this._gameState instanceof PourState) {
            this._getPourStateToNext();
        } else if (this._gameState instanceof FinalState) {
            this._getFinalStateToNext();
        }
    }

    _getFillStateToNext() {
        this._gameState.dispose();
        this._gameState = new MixState(this._orders, this._gameState.cup);
    }

    _getMixStateToNext() {
        if (equalArrays(this._gameState.userInputs, this._gameState.requiredInputs)) {
            console.log('correct');
            this._gameState.dispose();
            this._gameState = new PourState(this._orders, this._gameState.cup);
        } else {
            this._gameState.restart();
            console.log('incorrect');
        }
    }

    _getPourStateToNext() {
        if (this._gameState.volume == undefined) {
            return;
        }
        console.log(this._gameState.volume);
        this._gameState.dispose();
        this._gameState = new FinalState(this._orders, this._gameState.cup.components, this._gameState.volume, this.streak);
        this.score += this._gameState.score;
        if (this._gameState.score > 0) {
            this.streak++;
            this.correctOrders++;
        } else {
            this.streak = 0;
        }
        this.totalOrders++;
        if (this.mode == 'classic') {
            this.updateMistakeCounter();
        }

        let scoreText = document.getElementById('scoreText');
        scoreText.textContent = curLang.totalScoreText(this.score);

        let nextStateButton = document.getElementById('nextStateButton');
        if (this._orders.length === 0) {
            nextStateButton.disabled = true;
        }
    }

    _getFinalStateToNext() {
        let previousOrder = this._gameState.currentOrder;
        this._gameState.dispose();
        this._gameState = new FillState(this._orders, previousOrder);
    }

    restart() {
        this._gameState.restart();
    }

    finish() {
        this._orderCreator.clear();
        clearInterval(this.timerUpdater);
    }
}
