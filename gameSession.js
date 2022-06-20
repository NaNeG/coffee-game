import { Order } from "./gameElements.js";
import { FillState, MixState, PourState, FinalState } from "./gameStates.js";
import { equalArrays, getRandomInt, setRandomInterval, Volumes, ArcadeGameTime, getRipplePosition, curLang } from "./helpers.js";
import { CursedRecipes, Recipes } from "./recipes.js";


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
        if (this._orders[0].isCursed) {
            this._addRipple();
        }
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
            console.log(recipe.components, recipe.name, volume);
        } else {
            let recipe = Recipes[getRandomInt(Recipes.length)];
            this._orders.push(new Order(recipe, volume, false));
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
        if (!previousOrder.isCursed && this._orders[0].isCursed) {
            this._addRipple();
        } else if (previousOrder.isCursed && !this._orders[0].isCursed) {
            this._removeRipple();
        }
    }
    
    _addRipple() {
        let scriptNode = document.getElementsByTagName('script')[0];
        let ripple = document.createElement('div');
        let ripplePosition = getRipplePosition(nextStateButton);
        console.log(ripplePosition);
        ripple.classList.add('cursed-screen-ripple');
        ripple.style.top = `${ripplePosition[0]}px`;
        ripple.style.left = `${ripplePosition[1]}px`;
        scriptNode.before(ripple);
        ripple.classList.add('start-screen-animation');
        setTimeout(() => {
            document.body.style.background = 'rgb(80, 0, 69)';
            ripple.remove();
        }, 750);
    }
    
    _removeRipple() {
        let scriptNode = document.getElementsByTagName('script')[0];
        let ripple = document.createElement('div');
        let ripplePosition = getRipplePosition(nextStateButton);
        console.log(ripplePosition);
        ripple.classList.add('cursed-screen-ripple');
        ripple.style.top = `${ripplePosition[0]}px`;
        ripple.style.left = `${ripplePosition[1]}px`;
        scriptNode.before(ripple);
        ripple.classList.add('result-screen-animation');
        document.body.style.background = '#FFFDF0';
        setTimeout(() => {
            document.body.style.background = '#FFFDF0';
            ripple.remove();
        }, 750);
    }

    restart() {
        this._gameState.restart();
    }

    finish() {
        this._orderCreator.clear();
        clearInterval(this.timerUpdater);
    }
}
