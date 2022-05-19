import { Cup } from "./gameElements.js";
import { GameSession } from './gameSession.js'

const GameTime = 6000;

let currentGameSession;
let gameTimer;

let scriptNode = document.getElementsByTagName('script')[0];

let startButton = createStartButton();

let navBarContainer = document.createElement('div');
navBarContainer.id = 'navBarContainer';

navBarContainer.append(startButton);

scriptNode.before(navBarContainer);


function createStartButton() {
    let startButton = document.createElement('button');
    startButton.id = 'startButton';
    startButton.textContent = 'Start';
    startButton.addEventListener('click', () => initGame());
    return startButton;
}

function initGame() {
    if (currentGameSession instanceof GameSession) {
        finishSession();
    }

    if (document.getElementById('resultsScreenContainer')) {
        document.getElementById('resultsScreenContainer').remove();
    }
    
    let scoreContainer = document.createElement('div');
    scoreContainer.id = 'scoreContainer';
    let scoreText = document.createElement('h1');
    scoreText.id = 'scoreText';
    scoreText.textContent = 'Очки: ' + 0;
    scoreContainer.append(scoreText);

    let orderContainer = document.createElement('div');
    orderContainer.id = 'orderContainer';
    
    let gameContainer = document.createElement('div');
    gameContainer.id = 'gameContainer';

    let gameInfoContainer = document.createElement('div');
    gameInfoContainer.id = 'gameInfoContainer';

    let timerContainer = document.createElement('div');
    timerContainer.id = 'timerContainer';
    let timer = document.createElement('h1');
    timer.id = 'timer';
    timer.textContent = 'Время: ' + GameTime;
    timerContainer.append(timer);

    let menuContainer = document.createElement('div');
    menuContainer.id = 'menuContainer';

    let nextStateButton = document.createElement('button');
    nextStateButton.id = 'nextStateButton';
    nextStateButton.textContent = 'Следующий этап';
    nextStateButton.addEventListener('click', () => currentGameSession.nextState());

    let restartButton = document.createElement('button');
    restartButton.id = 'restartButton';
    restartButton.textContent = 'Сброс этапа';
    restartButton.addEventListener('click', () => currentGameSession.restart());

    let finishButton = document.createElement('button');
    finishButton.id = 'finishButton';
    finishButton.textContent = 'Выход';
    finishButton.addEventListener('click', () => {
        finishSession();
    });

    menuContainer.append(nextStateButton, restartButton, finishButton);
    gameInfoContainer.append(scoreContainer, timerContainer);

    scriptNode.before(gameInfoContainer, orderContainer, gameContainer, menuContainer);

    let orderText = document.createElement('h1');
    orderText.id = 'orderText';
    orderContainer.append(orderText);

    currentGameSession = new GameSession(123, GameTime); 
    gameTimer = setTimeout(() => {
        finishSession();
        console.log('fin');
    }, GameTime * 1000);
}

function finishSession() {
    document.getElementById('timerContainer').remove();
    document.getElementById('orderContainer').remove();
    document.getElementById('gameContainer').remove();
    document.getElementById('scoreContainer').remove();
    document.getElementById('menuContainer').remove();
    let gameScore = currentGameSession.finish();
    clearTimeout(gameTimer);
    currentGameSession = undefined;
    createResultScreen(gameScore);
    //startButton = createStartButton();
    //navBarContainer.append(startButton);
}

function createResultScreen(gameScore) {
    let resultsScreenContainer = document.createElement('div');
    resultsScreenContainer.id = 'resultsScreenContainer';

    let quitButton = document.createElement('button');
    quitButton.id = 'quitButton';
    quitButton.textContent = 'Меню';

    let restartButton = document.createElement('button');
    restartButton.id = 'restartButton';
    restartButton.textContent = 'Заново';

    quitButton.addEventListener('click', () => {
        resultsScreenContainer.remove();
        createStartScreen();
    });

    restartButton.addEventListener('click', () => {
        resultsScreenContainer.remove();
        initGame();
    });

    let resultScoreContainer =  document.createElement('div');
    resultScoreContainer.id = 'resultScoreContainer';
    resultScoreContainer.classList.add('container', 'score-container');

    let scoreText = document.createElement('h1');
    scoreText.textContent = gameScore;
    resultScoreContainer.append(scoreText);

    resultsScreenContainer.append(resultScoreContainer, quitButton, restartButton);

    scriptNode.before(resultsScreenContainer);
}

function createStartScreen() {

}





