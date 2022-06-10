import { Order } from "./gameElements.js";
import { FillState, MixState, PourState, FinalState } from "./gameStates.js";
import { equalArrays, getRandomInt, setRandomInterval, Volumes, VolumeTranslation } from "./helpers.js";
import { Recipes } from "./recipes.js";

export class GameSession {
    orders = [];
    score = 0;
    streak = 0;

    constructor(playerId, gameTime) {
        this.playerId = playerId;
        this.gameState = new FillState(this.orders, this.streak); 
        this.gameTime = gameTime;
        this.totalOrders = 0;
        this.correctOrders = 0;
        this.createOrder();
        this.orderCreator = setRandomInterval(() => { 
            this.createOrder();
        }, 10000, 15000);
        this.updateTimer();
    }

    updateTimer() {
        let timer = document.getElementById('timer');
        this.timerUpdater = setInterval(() => {
            this.gameTime -= 1;
            timer.textContent = 'Время: ' + this.gameTime;
        }, 1000);
    }

    createOrder() {
        let recipe = Recipes[getRandomInt(4)];
        let volume = Volumes[getRandomInt(3)];
        let nextStateButton = document.getElementById('nextStateButton');
        nextStateButton.disabled = false;
        this.orders.push(new Order(recipe, volume));
        console.log(recipe.components, recipe.name, volume);
        let orderText = document.getElementById('orderText');
        if (orderText.textContent == '') {
            orderText.textContent = 'Следующий заказ: ' + this.orders[0].name + ' ' + VolumeTranslation[this.orders[0].volume];
        }
    }

    nextState() {
        let cup = this.gameState.cup;
        if (this.gameState instanceof FillState) {
            this.gameState.handleEvent('dispose');
            this.gameState = new MixState(this.orders, cup, this.streak);
        } 
        else if (this.gameState instanceof MixState) {
            if (equalArrays(this.gameState.userInputs, this.gameState.requiredInputs)){
                console.log('correct');
                this.gameState.handleEvent('dispose');
                this.gameState = new PourState(this.orders, cup, this.streak);
            }
            else {
                this.gameState.handleEvent('restart');  
                console.log('incorrect');
            }         
        } 
        else if (this.gameState instanceof PourState) {
            if (this.gameState.volume != undefined) {
                console.log(this.gameState.volume);
                this.gameState.handleEvent('dispose');
                this.gameState = new FinalState(this.orders, cup.components, this.gameState.volume, this.streak);
                this.score += this.gameState.score;
                if (this.gameState.score > 0) {
                    this.streak++;
                    this.correctOrders++;
                } else {
                    this.streak = 0;
                } 
                this.totalOrders++;
                let scoreText = document.getElementById('scoreText');
                scoreText.textContent = 'Очки: ' + this.score;
            }
        } 
        else if (this.gameState instanceof FinalState) {
            this.gameState.handleEvent('dispose');
            this.gameState = new FillState(this.orders, this.streak);
            if (this.orders.length === 0) {
                let nextStateButton = document.getElementById('nextStateButton');
                nextStateButton.disabled = true;
            }
        }
    }

    restart() {
        this.gameState.handleEvent('restart');
    }

    finish() {
        this.orderCreator.clear();
        clearInterval(this.timerUpdater);
        return [this.score, this.totalOrders, this.correctOrders];
    }
}

