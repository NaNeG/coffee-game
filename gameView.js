import { Cup } from "./gameElements.js";
import { GameSession } from './gameSession.js'


let currentGameSession;

let scriptNode = document.getElementsByTagName('script')[0];

let startButton = document.createElement('button');
startButton.id = 'startButton';
startButton.textContent = 'Start';
startButton.addEventListener('click', () => currentGameSession = new GameSession(123));

let navBarContainer = document.createElement('div');
navBarContainer.id = 'navBarContainer';

let gameContainer = document.createElement('div');
gameContainer.id = 'gameContainer';

let menuContainer = document.createElement('div');
menuContainer.id = 'menuContainer';

scriptNode.before(navBarContainer, gameContainer, menuContainer);
navBarContainer.append(startButton);

let nextStateButton = document.createElement('button');
nextStateButton.textContent = 'Следующий этап';
nextStateButton.addEventListener('click', () => currentGameSession.nextState());

let restartButton = document.createElement('button');
restartButton.textContent = 'Рестарт';
restartButton.addEventListener('click', () => currentGameSession.restart());

menuContainer.append(nextStateButton, restartButton);



