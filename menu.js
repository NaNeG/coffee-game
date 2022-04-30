import { Cup } from "./gameElements.js";
import { FillState } from "./states.js";

const GameState = {
    FillState: 'fillstate',
    MixState: 'mixstate',
    PourState: 'pourstate',
}

let startButton = document.getElementById('startGame');
startButton.addEventListener('click', () => new FillState());
