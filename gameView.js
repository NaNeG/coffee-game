import { Cup } from "./gameElements.js";
import { GameSession } from './gameSession.js'


let currentGameSession;

let scriptNode = document.getElementsByTagName('script')[0];

let startButton = createStartButton();

let navBarContainer = document.createElement('div');
navBarContainer.id = 'navBarContainer';

navBarContainer.append(startButton);

scriptNode.before(navBarContainer);


function finishSession() {
    currentGameSession.finish();
    currentGameSession = undefined;
    startButton = createStartButton();

    navBarContainer = document.createElement('div');
    navBarContainer.id = 'navBarContainer';

    navBarContainer.append(startButton);
    scoreContainer.remove();
    gameContainer.remove();
    menuContainer.remove();
    orderContainer.remove();

    scriptNode.before(navBarContainer);
}

function createStartButton() {
    let startButton = document.createElement('button');
    startButton.id = 'startButton';
    startButton.textContent = 'Start';
    startButton.addEventListener('click', () => initGame());
    return startButton;
}

function initGame() {
    let scoreContainer = document.createElement('div');
    scoreContainer.id = 'scoreContainer';
    let scoreText = document.createElement('h1');
    scoreText.id = 'scoreText';
    scoreText.textContent = 0;
    scoreContainer.append(scoreText);

    let orderContainer = document.createElement('div');
    orderContainer.id = 'orderContainer';
    

    let gameContainer = document.createElement('div');
    gameContainer.id = 'gameContainer';

    let menuContainer = document.createElement('div');
    menuContainer.id = 'menuContainer';

    let nextStateButton = document.createElement('button');
    nextStateButton.id = 'nextStateButton';
    nextStateButton.textContent = 'Следующий этап';
    nextStateButton.addEventListener('click', () => currentGameSession.nextState());

    let restartButton = document.createElement('button');
    restartButton.id = 'restartButton';
    restartButton.textContent = 'Рестарт';
    restartButton.addEventListener('click', () => currentGameSession.restart());

    let finishButton = document.createElement('button');
    finishButton.id = 'finishButton';
    finishButton.textContent = 'Выход';
    finishButton.addEventListener('click', () => {
        finishSession(); // Придумать что-нибудь получше
    });

    navBarContainer.remove();

    menuContainer.append(nextStateButton, restartButton, finishButton);

    scriptNode.before(orderContainer, gameContainer, scoreContainer, menuContainer);

    let orderText = document.createElement('h1');
    orderText.id = 'orderText';
    orderText.textContent = '';
    orderContainer.append(orderText);

    currentGameSession = new GameSession(123);
    
}





