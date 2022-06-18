import { Order } from "./gameElements.js";
import { FillState, MixState, PourState, FinalState, addRipple, removeRipple } from "./gameStates.js";
import { equalArrays, getRandomInt, setRandomInterval, Volumes, VolumeTranslation, ArcadeGameTime, getRipplePosition } from "./helpers.js";
import { CursedRecipes, Recipes } from "./recipes.js";

export class GameSession {
    orders = [];
    score = 0;
    streak = 0;

    constructor(playerId, mode) {
        this.playerId = playerId;
        this.firstOrder = true;
        this.createOrder();
        this.gameState = new FillState(this.orders, undefined); 
        this.mode = mode;
        this.totalOrders = 0;
        this.correctOrders = 0;
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
        this.orderCreator = setRandomInterval(() => { 
            this.createOrder();
        }, 12000, 12000);
        
    }

    updateMistakeCounter() {
        let mistakeCounter = document.getElementById('modeInfo');
        mistakeCounter.textContent = `Ошибок: ${this.totalOrders - this.correctOrders}`;
    }

    updateInfiniteTimer() {
        let timer = document.getElementById('modeInfo');
        this.timerUpdater = setInterval(() => {
            this.gameTime += 1;
            timer.textContent = 'Время: ' + this.gameTime;
        }, 1000);
    }

    updateArcadeTimer() {
        let timer = document.getElementById('modeInfo');
        this.timerUpdater = setInterval(() => {
            this.gameTime -= 1;
            timer.textContent = 'Время: ' + this.gameTime;
        }, 1000);
    }

    createOrder() {
        let volume = Volumes[getRandomInt(3)];
        let nextStateButton = document.getElementById('nextStateButton');
        nextStateButton.disabled = false;
        if (getRandomInt(2) === 0) {
            let recipe = CursedRecipes[getRandomInt(3)];
            this.orders.push(new Order(recipe, volume, true));
            if (this.firstOrder) {
                addRipple();
            } else if (this.orders[0].isCursed && this.gameState instanceof FinalState && !this.gameState.currentOrder.isCursed) {
                nextStateButton.addEventListener('click', rippleFunc = addRipple.bind(nextStateButton));
            }
            console.log(recipe.components, recipe.name, volume);
        } else {
            let recipe = Recipes[getRandomInt(21)];
            this.orders.push(new Order(recipe, volume, false));
            if (!this.orders[0].isCursed && this.gameState instanceof FinalState && this.gameState.currentOrder.isCursed) {
                nextStateButton.addEventListener('click', rippleFunc = removeRipple.bind(nextStateButton));
            }
            console.log(recipe.components, recipe.name, volume);
        }
        this.firstOrder = false;
        let orderText = document.getElementById('orderText');
        if (orderText.textContent == '') {
            orderText.textContent = 'Заказ: ' + this.orders[0].name + ' ' + VolumeTranslation[this.orders[0].volume];
        }
    }

    nextState() { 
        let cup = this.gameState.cup;
        if (this.gameState instanceof FillState) {
            this.gameState.dispose();
            this.gameState = new MixState(this.orders, cup);
        } 
        else if (this.gameState instanceof MixState) {
            if (equalArrays(this.gameState.userInputs, this.gameState.requiredInputs)){
                console.log('correct');
                this.gameState.dispose();
                this.gameState = new PourState(this.orders, cup);
            }
            else {
                this.gameState.restart();
                console.log('incorrect');
            }         
        } 
        else if (this.gameState instanceof PourState) {
            if (this.gameState.volume != undefined) {
                console.log(this.gameState.volume);
                this.gameState.dispose();
                this.gameState = new FinalState(this.orders, cup.components, this.gameState.volume, this.streak);
                this.score += this.gameState.score;
                if (this.gameState.score > 0) {
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
                scoreText.textContent = 'Очки: ' + this.score;

                let nextStateButton = document.getElementById('nextStateButton');
                if (this.orders.length === 0) {  
                    nextStateButton.disabled = true;
                }
            }
        } 
        else if (this.gameState instanceof FinalState) {
            let previousOrder = this.gameState.currentOrder;
            this.gameState.dispose();
            this.gameState = new FillState(this.orders, previousOrder);
        }
    }

    restart() {
        this.gameState.restart();
    }

    finish() {
        this.orderCreator.clear();
        clearInterval(this.timerUpdater);
        return [this.score, this.totalOrders, this.correctOrders];
    }
}



