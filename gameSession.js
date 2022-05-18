import { Order } from "./gameElements.js";
import { FillState, MixState, PourState, FinalState } from "./gameStates.js";
import { equalArrays, getRandomInt, setRandomInterval, Volumes } from "./helpers.js";
import { Recipes } from "./recipes.js";

export class GameSession {
    orders = [];
    score = 0;

    constructor(playerId, gameTime) {
        this.playerId = playerId;
        this.gameState = new FillState(this.orders); 
        this.gameTime = gameTime;
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
            timer.textContent = this.gameTime;
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
            orderText.textContent = this.orders[0].name + ' ' + this.orders[0].volume;
        }
    }

    nextState() {
        let cup = this.gameState.cup;
        if (this.gameState instanceof FillState) {
            this.gameState.handleEvent('dispose');
            this.gameState = new MixState(this.orders, cup);
        } 
        else if (this.gameState instanceof MixState) {
            if (equalArrays(this.gameState.userInputs, this.gameState.requiredInputs)){
                console.log('correct');
                this.gameState.handleEvent('dispose');
                this.gameState = new PourState(this.orders, cup);
            }
            else {
                this.gameState.userInputs = [];
                alert('Try again');
                console.log('incorrect');
            }         
        } 
        else if (this.gameState instanceof PourState) {
            if (this.gameState.volume != undefined) {
                console.log(this.gameState.volume);
                this.gameState.handleEvent('dispose');
                this.gameState = new FinalState(this.orders, cup.components, this.gameState.volume);
                this.score += this.gameState.score;
                let scoreText = document.getElementById('scoreText');
                scoreText.textContent = this.score;
            }
        } 
        else if (this.gameState instanceof FinalState) {
            this.gameState.handleEvent('dispose');
            this.gameState = new FillState(this.orders);
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
        return this.score;
    }
}

