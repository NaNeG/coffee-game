import { Order } from "./gameElements.js";
import { FillState, MixState, PourState, FinalState } from "./gameStates.js";
import { equalArrays } from "./helpers.js";

export class GameSession {
    orders = [new Order(['tea', 'coffee', 'juice'], 'medium'), new Order(['tea', 'coffee', 'coffee'], 'small')];

    constructor(playerId) {
        this.playerId = playerId;
        this.gameState = new FillState(this.orders); 
    }

    get getState()
    {
        return this.state;
    }

    createOrder() {

    }

    nextState() {
        let cup = this.gameState.handleEvent('dispose');
        if (this.gameState instanceof FillState) {
            this.gameState = new MixState(this.orders, cup);
        } 
        else if (this.gameState instanceof MixState) {
            if (equalArrays(this.gameState.userInputs, this.gameState.requiredInputs)){
                console.log('correct');
                this.gameState = new PourState(this.orders, cup);
            }
            else {
                this.gameState.userInputs = [];
                alert('Try again');
                console.log('incorrect');
            }         
        } 
        else if (this.gameState instanceof PourState) {
            this.gameState = new FinalState(this.orders, cup.components, this.gameState.volume);
        } 
        else if (this.gameState instanceof FinalState)  {
            this.gameState = new FillState(this.orders);
        }
    }

    restart() {
        this.gameState.handleEvent('restart');
        console.log(2);
    }
}

