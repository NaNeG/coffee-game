import { Cup } from "./gameElements.js";
import { GameSession } from './gameSession.js'
import { Recipes } from "./recipes.js";
import { leaderboardDB } from "./leaderboardApi.js";
import { TabIndexOffsets } from "./helpers.js";

const GameTime = 6000;

let currentGameSession;
let gameTimer;

let scriptNode = document.getElementsByTagName('script')[0];
const overlayNode = document.querySelector('.overlay');
const recipesTable = document.querySelector('.recipes').firstElementChild;
const leaderboardTable = document.querySelector('.leaderboard').firstElementChild;

let navBarContainer = createNavBarContainer();
scriptNode.before(navBarContainer);

for (let {name, components} of Object.values(Recipes)) {
    let row = recipesTable.insertRow();
    row.insertCell().textContent = name + ':';
    row.insertCell().textContent = components.join(', ');
}

function createNavBarContainer() {
    let navBarContainer = document.createElement('div');
    navBarContainer.id = 'navBarContainer';
    let startButton = createStartButton();
    startButton.tabIndex = TabIndexOffsets.navBar;
    navBarContainer.append(startButton);
    return navBarContainer;
}

function createStartButton() {
    let startButton = document.createElement('button');
    startButton.id = 'startButton';
    startButton.textContent = 'Start';
    startButton.classList.add('nav-bar-button');
    startButton.addEventListener('click', () => initGame());
    return startButton;
}

function createRecipesButton() {
    let recipesButton = document.createElement('button');
    recipesButton.id = 'recipesButton';
    recipesButton.textContent = 'Рецепты';
    recipesButton.addEventListener('click', () => showLightBox('.recipes'));
    recipesButton.classList.add('game-menu-button');
    return recipesButton;
}

function createLeaderboardButton() {
    let leaderboardButton = document.createElement('button');
    leaderboardButton.id = 'leaderboardButton';
    leaderboardButton.textContent = 'Таблица лидеров';
    leaderboardButton.addEventListener('click', () => {
        leaderboardButton.disabled = true;
        showLeaderboard(5).then(() => leaderboardButton.disabled = false);
    });
    leaderboardButton.classList.add('game-menu-button');
    return leaderboardButton;
}

function initGame() {
    if (currentGameSession instanceof GameSession) {
        finishSession();
    }

    let timerContainer = createTimerContainer();
    let scoreContainer = createScoreContainer();
    let gameInfoContainer = createGameInfoContainer(scoreContainer, timerContainer);
    // todo: move timer & score containers creation inside?

    let orderContainer = createOrderContainer();
    
    let gameContainer = createGameContainer();

    let finishButton = createFinishButton();
    let restartButton = createRestartButton();
    let recipesButton = createRecipesButton();
    let leaderboardButton = createLeaderboardButton();
    let nextStateButton = createNextStateButton();
    let menuContainer = createMenuContainer(finishButton, restartButton, recipesButton, leaderboardButton, nextStateButton);
    // todo: move buttons creation inside?
    // todo: redundant css class for button, menu's id is enough?

    scriptNode.before(gameInfoContainer, orderContainer, gameContainer, menuContainer);

    currentGameSession = new GameSession(123, GameTime); 
    gameTimer = setTimeout(() => {
        createResultScreen(finishSession());
        console.log('fin');
    }, GameTime * 1000);
}

function createMenuContainer(...buttons) {
    let menuContainer = document.createElement('div');
    menuContainer.id = 'menuContainer';

    buttons.forEach((btn, i) => btn.tabIndex = TabIndexOffsets.menu + i); // todo: move outside?
    menuContainer.append(...buttons);
    return menuContainer;
}

function createNextStateButton() {
    let nextStateButton = document.createElement('button');
    nextStateButton.id = 'nextStateButton';
    nextStateButton.textContent = 'Следующий этап';
    nextStateButton.addEventListener('click', () => currentGameSession.nextState());
    nextStateButton.classList.add('game-menu-button');
    return nextStateButton;
}

function createRestartButton() {
    let restartButton = document.createElement('button');
    restartButton.id = 'restartButton';
    restartButton.textContent = 'Сброс этапа';
    restartButton.addEventListener('click', () => currentGameSession.restart());
    restartButton.classList.add('game-menu-button');
    return restartButton;
}

function createFinishButton() {
    let finishButton = document.createElement('button');
    finishButton.id = 'finishButton';
    finishButton.textContent = 'Выход';
    finishButton.addEventListener('click', () => {
        createResultScreen(finishSession());
    });
    finishButton.classList.add('game-menu-button');
    return finishButton;
}

function createGameInfoContainer(scoreContainer, timerContainer) {
    let gameInfoContainer = document.createElement('div');
    gameInfoContainer.id = 'gameInfoContainer';
    gameInfoContainer.append(scoreContainer, timerContainer);
    return gameInfoContainer;
}

function createTimerContainer() {
    let timerContainer = document.createElement('div');
    timerContainer.id = 'timerContainer';
    let timer = document.createElement('h1');
    timer.id = 'timer';
    timer.textContent = 'Время: ' + GameTime;
    timerContainer.append(timer);
    return timerContainer; // todo: return method for setting time?
}

function createGameContainer() {
    let gameContainer = document.createElement('div');
    gameContainer.id = 'gameContainer';
    return gameContainer;
}

function createOrderContainer() {
    let orderContainer = document.createElement('div');
    orderContainer.id = 'orderContainer';
    let orderText = document.createElement('h1');
    orderText.id = 'orderText';
    orderContainer.append(orderText);
    return orderContainer;
}

function createScoreContainer() {
    let scoreContainer = document.createElement('div');
    scoreContainer.id = 'scoreContainer';
    let scoreText = document.createElement('h1');
    scoreText.id = 'scoreText';
    scoreText.textContent = 'Очки: ' + 0;
    scoreContainer.append(scoreText);
    return scoreContainer; // todo: return method for setting score?
}

function finishSession() {
    document.getElementById('gameInfoContainer').remove();
    document.getElementById('orderContainer').remove();
    document.getElementById('gameContainer').remove();
    document.getElementById('menuContainer').remove();
    let gameScore = currentGameSession.finish();
    clearTimeout(gameTimer);
    currentGameSession = undefined;
    return gameScore;
}

function createResultScreen(gameScore) {
    let resultsScreenContainer = document.createElement('div');
    resultsScreenContainer.id = 'resultsScreenContainer';

    let quitButton = document.createElement('button');
    quitButton.id = 'quitButton';
    quitButton.textContent = 'Меню';
    quitButton.classList.add('game-menu-button');

    let restartButton = document.createElement('button');
    restartButton.id = 'restartButton';
    restartButton.textContent = 'Заново';
    restartButton.classList.add('game-menu-button');

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

async function showLeaderboard(count = Infinity) {
    while (leaderboardTable.rows.length > 0) {
        leaderboardTable.deleteRow(-1);
    }
    (await leaderboardDB.getAll(count, false)).forEach(doc => {
        const {id, points} = doc;
        let row = leaderboardTable.insertRow();
        row.insertCell().textContent = id;
        row.insertCell().textContent = points;
    });
    showLightBox('.leaderboard');
}
