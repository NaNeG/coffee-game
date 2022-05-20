import { Cup } from "./gameElements.js";
import { GameSession } from './gameSession.js'
import { iterFileRows } from "./helpers.js";
import { Recipes } from "./recipes.js";

const GameTime = 60;

let currentGameSession;
let gameTimer;

let scriptNode = document.getElementsByTagName('script')[0];
const overlayNode = document.querySelector('.overlay');
const recipesTable = document.querySelector('.recipes').firstElementChild;
const leaderboardTable = document.querySelector('.leaderboard').firstElementChild;

let startButton = createStartButton();

let navBarContainer = document.createElement('div');
navBarContainer.id = 'navBarContainer';

navBarContainer.append(startButton);

scriptNode.before(navBarContainer);

let recipesButton = createRecipesButton();

let recipesButtonContainer = document.createElement('div');
recipesButtonContainer.id = 'recipesButtonContainer';

recipesButtonContainer.append(recipesButton);

scriptNode.before(recipesButtonContainer);

let leaderboardButton = createLeaderboardButton();

let leaderboardButtonContainer = document.createElement('div');
leaderboardButtonContainer.id = 'leaderboardButtonContainer';

leaderboardButtonContainer.append(leaderboardButton);

scriptNode.before(leaderboardButtonContainer);

for (let {name, components} of Object.values(Recipes)) {
    // let recipe = document.createElement('div');
    // recipe.append(`${name}: ${components.join(', ')}`);
    // let x = document.createElement('table').insertRow();
    let row = recipesTable.insertRow();
    row.insertCell().textContent = name + ':';
    row.insertCell().textContent = components.join(', ');
}

// scriptNode.before(recipesNode);

for (let line of iterFileRows('leaderboard.txt')) {
    let [id, score] = line.split(' ');
    let row = leaderboardTable.insertRow();
    row.insertCell().textContent = id;
    row.insertCell().textContent = score;
}

// scriptNode.before(leaderboardNode);

function createStartButton() {
    let startButton = document.createElement('button');
    startButton.id = 'startButton';
    startButton.textContent = 'Start';
    startButton.addEventListener('click', () => initGame());
    return startButton;
}

function createRecipesButton() {
    let recipesButton = document.createElement('button');
    recipesButton.id = 'recipesButton';
    recipesButton.textContent = 'Recipes';
    recipesButton.addEventListener('click', () => showLightBox('.recipes'));
    return recipesButton;
}

function createLeaderboardButton() {
    let leaderboardButton = document.createElement('button');
    leaderboardButton.id = 'leaderboardButton';
    leaderboardButton.textContent = 'Leaderboard';
    leaderboardButton.addEventListener('click', () => showLightBox('.leaderboard'));
    return leaderboardButton;
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
    scoreText.textContent = 0;
    scoreContainer.append(scoreText);

    let orderContainer = document.createElement('div');
    orderContainer.id = 'orderContainer';
    
    let gameContainer = document.createElement('div');
    gameContainer.id = 'gameContainer';

    let timerContainer = document.createElement('div');
    timerContainer.id = 'timerContainer';
    let timer = document.createElement('h1');
    timer.id = 'timer';
    timer.textContent = GameTime;
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

    scriptNode.before(timerContainer, orderContainer, gameContainer, scoreContainer, menuContainer);

    let orderText = document.createElement('h1');
    orderText.id = 'orderText';
    orderText.textContent = '';
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

    let scoreContainer =  document.createElement('div');
    scoreContainer.id = 'scoreContainer';
    scoreContainer.classList.add('container', 'score-container');

    let scoreText = document.createElement('h1');
    scoreText.textContent = gameScore;
    scoreContainer.append(scoreText);

    resultsScreenContainer.append(scoreContainer, quitButton, restartButton);

    scriptNode.before(resultsScreenContainer);
}

function createStartScreen() {

}

function hideAllLightboxes() {
    document.querySelector('.overlay').style.display = 'none';
    document.querySelectorAll('.lightbox').forEach(x => x.hidden = true);
}
overlayNode.addEventListener('click', hideAllLightboxes);

function showLightBox(className) {
    hideAllLightboxes();
    document.querySelector('.overlay').style.display = 'flex';
    document.querySelector('.overlay ' + className).hidden = false;
}


