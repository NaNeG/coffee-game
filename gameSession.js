import { Order } from "./gameElements.js";
import { FillState, MixState, PourState, FinalState } from "./gameStates.js";
import { equalArrays, getRandomInt, setRandomInterval, Volumes, VolumeTranslation, ArcadeGameTime } from "./helpers.js";
import { Recipes } from "./recipes.js";

export class GameSession {
    orders = [];
    score = 0;
    streak = 0;

    constructor(playerId, mode) {
        this.playerId = playerId;
        this.gameState = new FillState(this.orders, this.streak); 
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
        this.createOrder();
        this.orderCreator = setRandomInterval(() => { 
            this.createOrder();
        }, 5000, 15000);
        
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
        let recipe = Recipes[getRandomInt(21)];
        let volume = Volumes[getRandomInt(3)];
        let nextStateButton = document.getElementById('nextStateButton');
        nextStateButton.disabled = false;
        this.orders.push(new Order(recipe, volume));
        console.log(recipe.components, recipe.name, volume);
        let orderText = document.getElementById('orderText');
        if (orderText.textContent == '') {
            orderText.textContent = 'Заказ: ' + this.orders[0].name + ' ' + VolumeTranslation[this.orders[0].volume];
        }
    }

    nextState() { // todo: why this.streak everywhere? only FinalState has such parameter
        let cup = this.gameState.cup;
        if (this.gameState instanceof FillState) {
            this.gameState.dispose();
            this.gameState = new MixState(this.orders, cup, this.streak);
        } 
        else if (this.gameState instanceof MixState) {
            if (equalArrays(this.gameState.userInputs, this.gameState.requiredInputs)){
                console.log('correct');
                this.gameState.dispose();
                this.gameState = new PourState(this.orders, cup, this.streak);
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
            }
        } 
        else if (this.gameState instanceof FinalState) {
            this.gameState.dispose();
            this.gameState = new FillState(this.orders, this.streak);
            if (this.orders.length === 0) {
                let nextStateButton = document.getElementById('nextStateButton');
                nextStateButton.disabled = true;
            }
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

