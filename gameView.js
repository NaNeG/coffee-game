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

let startButton = createStartButton();

let navBarContainer = document.createElement('div');
navBarContainer.id = 'navBarContainer';

navBarContainer.append(startButton);
startButton.tabIndex = TabIndexOffsets.navBar;

scriptNode.before(navBarContainer);

// let recipesButton = createRecipesButton();

// let recipesButtonContainer = document.createElement('div');
// recipesButtonContainer.id = 'recipesButtonContainer';

// recipesButtonContainer.append(recipesButton);

// scriptNode.before(recipesButtonContainer);

// let leaderboardButton = createLeaderboardButton();

// let leaderboardButtonContainer = document.createElement('div');
// leaderboardButtonContainer.id = 'leaderboardButtonContainer';

// leaderboardButtonContainer.append(leaderboardButton);

// scriptNode.before(leaderboardButtonContainer);

for (let {name, components} of Object.values(Recipes)) {
    let row = recipesTable.insertRow();
    row.insertCell().textContent = name + ':';
    row.insertCell().textContent = components.join(', ');
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
    nextStateButton.classList.add('game-menu-button');

    let restartButton = document.createElement('button');
    restartButton.id = 'restartButton';
    restartButton.textContent = 'Сброс этапа';
    restartButton.addEventListener('click', () => currentGameSession.restart());
    restartButton.classList.add('game-menu-button');

    let finishButton = document.createElement('button');
    finishButton.id = 'finishButton';
    finishButton.textContent = 'Выход';
    finishButton.addEventListener('click', () => {
        finishSession();
    });
    finishButton.classList.add('game-menu-button');

    let recipesButton = createRecipesButton();
    let leaderboardButton = createLeaderboardButton();

    [finishButton, restartButton, recipesButton, leaderboardButton, nextStateButton].forEach(
        (btn, i) => btn.tabIndex = TabIndexOffsets.menu + i
    );
    menuContainer.append(finishButton, restartButton, recipesButton, leaderboardButton, nextStateButton);
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
    document.getElementById('gameInfoContainer').remove();
    document.getElementById('orderContainer').remove();
    document.getElementById('gameContainer').remove();
    document.getElementById('menuContainer').remove();
    let [gameScore, totalOrders, correctOrders] = currentGameSession.finish();
    clearTimeout(gameTimer);
    currentGameSession = undefined;
    createResultScreen(gameScore, totalOrders, correctOrders);
    //startButton = createStartButton();
    //navBarContainer.append(startButton);
}

function createResultScreen(gameScore, totalOrders, correctOrders) {
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

    let buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('filling-buttons-container')

    let scoreText = document.createElement('h1');
    scoreText.textContent = `Ваш счет: ${gameScore}`;

    let orderCount = document.createElement('h1');
    orderCount.textContent = `Выполнено заказов: ${correctOrders}`;

    let correctOrdersText = document.createElement('h1');
    if (totalOrders > 0) {
        correctOrdersText.textContent = `Процент успеха: ${(correctOrders / totalOrders).toFixed(2) * 100}`;
    } else {
        correctOrdersText.textContent = `Процент успеха: 0`;
    }
    
    resultScoreContainer.append(scoreText, orderCount, correctOrdersText);

    buttonsContainer.append(quitButton, restartButton);

    resultsScreenContainer.append(resultScoreContainer, buttonsContainer);

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
