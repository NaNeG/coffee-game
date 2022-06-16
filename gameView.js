import { Cup } from "./gameElements.js";
import { GameSession } from './gameSession.js'
import { Recipes } from "./recipes.js";
import { leaderboardDB } from "./leaderboardApi.js";
import { ArcadeGameTime, ComponentTranslation, GameModes, TabIndexOffsets } from "./helpers.js";

let currentGameSession;
let gameTimer;

let scriptNode = document.getElementsByTagName('script')[0];
const overlayNode = document.querySelector('.overlay');
const recipesTable = document.querySelector('.recipes').firstElementChild;
const leaderboardTable = document.querySelector('.leaderboard').firstElementChild;

//let startButton = createStartButton();

// let navBarContainer = document.createElement('div');
// navBarContainer.id = 'navBarContainer';

// navBarContainer.append(startButton);
// startButton.tabIndex = TabIndexOffsets.navBar;

createStartScreen();

for (let {name, components} of Object.values(Recipes)) {
    let row = recipesTable.insertRow();
    row.insertCell().textContent = name + ':';
    row.insertCell().textContent = components.map(x => ComponentTranslation[x]).join(', ');
}

function createStartButton(container) {
    let startButton = document.createElement('button');
    startButton.id = 'startButton';
    startButton.textContent = 'Start';
    startButton.classList.add('start-menu-button');
    startButton.addEventListener('click', () => {
        createModeButtons(container);
        startButton.remove();
    });
    return startButton;
}

function createModeButtons(container) {
    for (let mode of Object.keys(GameModes)) {
        let modeButton = document.createElement('button');
        modeButton.id = mode;
        modeButton.textContent = GameModes[mode];
        modeButton.classList.add('start-menu-button');
        modeButton.addEventListener('click', (event) => {
            hideStartScreen(event);
            setTimeout(() => initGame(mode), 750)
        });
        container.append(modeButton);
    }
}

function createStartScreen() {
    let startScreenContainer = document.createElement('div');
    startScreenContainer.id = 'startScreenContainer'; 
    let title = document.createElement('h1');
    title.id = 'startScreenTitle';
    title.textContent = 'Cofea';
    let startButton = createStartButton(startScreenContainer);
    let ripple = document.createElement('div');
    ripple.classList.add('start-screen-ripple');
    startScreenContainer.append(title, startButton, ripple);
    scriptNode.before(startScreenContainer);
}

function hideStartScreen(event) {
    let startScreenContainer = document.getElementById('startScreenContainer');
    let button = event.currentTarget;
    let ripple = document.querySelector('.start-screen-ripple');
    let ripplePosition = getRipplePosition(button);
    console.log(ripplePosition);
    ripple.style.top = `${ripplePosition[0]}px`;
    ripple.style.left = `${ripplePosition[1]}px`;
    ripple.classList.add('start-screen-animation');
    let menuButtons = document.querySelectorAll('.start-menu-button');
    for (let button of menuButtons){
        button.classList.add('start-button-animation');
    }
    setTimeout(() => {
        startScreenContainer.remove();
    }, 750);
}

function getRipplePosition(element) {
    let rect = element.getBoundingClientRect();
    return [rect.top + (rect.bottom - rect.top) / 2 - window.innerWidth, rect.left + (rect.right - rect.left) / 2 - window.innerWidth];
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

function initGame(mode) {
    if (currentGameSession instanceof GameSession) {
        finishSession();
    }

    let modeInfoContainer = createModeInfoContainer(mode);
    let scoreContainer = createScoreContainer();
    let gameInfoContainer = createGameInfoContainer(scoreContainer, modeInfoContainer);
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

    [finishButton, restartButton, recipesButton, leaderboardButton, nextStateButton].forEach(
        (btn, i) => btn.tabIndex = TabIndexOffsets.menu + i
    );
    menuContainer.append(finishButton, restartButton, recipesButton, leaderboardButton, nextStateButton);
    gameInfoContainer.append(scoreContainer, modeInfoContainer);

    scriptNode.before(gameInfoContainer, orderContainer, gameContainer, menuContainer);

    gameInfoContainer.classList.add('game-elements-fade-in');
    orderContainer.classList.add('game-elements-fade-in');
    gameContainer.classList.add('game-elements-fade-in');
    menuContainer.classList.add('game-elements-fade-in');   

    scriptNode.before(gameInfoContainer, orderContainer, gameContainer, menuContainer);

    currentGameSession = new GameSession(123, mode); //add playerId
    switch (mode) {
        case 'classic':
            gameTimer = setInterval(() => {
                if (currentGameSession.totalOrders - currentGameSession.correctOrders === 3) {
                    finishSession();
                    console.log('fin');
                }
            }, 50);
            break;
        
        case 'arcade':
            gameTimer = setTimeout(() => {
                finishSession();
                console.log('fin');
            }, ArcadeGameTime * 1000);
            break;

        case 'infinite':
            break;
    }
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
    nextStateButton.textContent = 'Готово!';
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
        finishSession();
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

function createModeInfoContainer(mode) {
    let modeInfoContainer = document.createElement('div');
    modeInfoContainer.id = 'modeInfoContainer';
    let modeInfo = document.createElement('h1');
    modeInfo.id = 'modeInfo';
    switch (mode) {
        case 'classic':
            modeInfo.textContent = 'Ошибок: 0'
            break;

        case 'arcade':
            modeInfo.textContent = `Время: ${ArcadeGameTime}`;
            break;

        case 'infinite':
            modeInfo.textContent = `Время: 0`;
            break;
    } 
    modeInfoContainer.append(modeInfo);
    return modeInfoContainer;
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



function finishSession() {
    clearInterval(gameTimer);
    let gameInfoContainer = document.getElementById('gameInfoContainer');
    let orderContainer = document.getElementById('orderContainer');
    let gameContainer = document.getElementById('gameContainer');
    let menuContainer = document.getElementById('menuContainer');
    gameInfoContainer.classList.add('game-elements-fade-out');
    orderContainer.classList.add('game-elements-fade-out');
    gameContainer.classList.add('game-elements-fade-out');
    menuContainer.classList.add('game-elements-fade-out');
    setTimeout(() => {
        document.getElementById('gameInfoContainer').remove();
        document.getElementById('orderContainer').remove();
        document.getElementById('gameContainer').remove();
        document.getElementById('menuContainer').remove();
        let currentGameMode = currentGameSession.mode;
        let [gameScore, totalOrders, correctOrders] = currentGameSession.finish();
        clearTimeout(gameTimer);
        currentGameSession = undefined;
        createResultScreen(currentGameMode, gameScore, totalOrders, correctOrders);
    }, 500);
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

function createResultScreen(gameMode, gameScore, totalOrders, correctOrders) {
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

    let ripple = document.createElement('div');
    ripple.classList.add('result-screen-ripple');
    
    quitButton.addEventListener('click', () => {
        let ripplePosition = getRipplePosition(quitButton);
        ripple.style.top = `${ripplePosition[0]}px`;
        ripple.style.left = `${ripplePosition[1]}px`;
        ripple.classList.add('result-screen-animation');
        // resultScoreContainer.remove();
        // buttonsContainer.remove();
        resultsScreenContainer.style.background = '#FFFDF0';
        createStartScreen();
        setTimeout(() => {
            resultsScreenContainer.remove()
        }, 750);
        
    });

    restartButton.addEventListener('click', () => {
        resultsScreenContainer.remove();
        console.log(gameMode);
        initGame(gameMode);
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
        correctOrdersText.textContent = `Процент успеха: ${(correctOrders / totalOrders).toFixed(2) * 100}%`;
    } else {
        correctOrdersText.textContent = `Процент успеха: 0%`;
    }
    
    resultScoreContainer.append(scoreText, orderCount, correctOrdersText);

    buttonsContainer.append(quitButton, restartButton);

    resultsScreenContainer.append(resultScoreContainer, buttonsContainer, ripple);

    scriptNode.before(resultsScreenContainer);
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
