import { Cup } from "./gameElements.js";
import { GameSession } from './gameSession.js';
import { CursedRecipes, Recipes } from "./recipes.js";
import { leaderboardDBs } from "./leaderboardApi.js";
import { ArcadeGameTime, GameModes, TabIndexOffsets, MaxLeaderboardEntriesCount, getRipplePosition } from "./helpers.js";
import { Languages } from "./translations.js";

const firstGameMode = Object.keys(GameModes)[0];

const curLangName = 'russian';
const curLang = Languages[curLangName];

let playerId;
let currentGameSession;
let gameTimer;

let scriptNode = document.getElementsByTagName('script')[0];
const overlayNode = document.querySelector('.overlay');
const recipesTable = document.querySelector('.recipes table');
const cursedRecipesTable = document.querySelector('.cursed-recipes table');
const leaderboardLightBox = document.querySelector('.leaderboard');
const leaderboardTable = leaderboardLightBox.querySelector('table');
const leaderboardModeSelection = leaderboardLightBox.querySelector('#leaderboardModeSelection');

createStartScreen();
addModeSelectionButtonsToLeaderboardLightbox();

for (let {name, components} of Object.values(Recipes)) {
    let row = recipesTable.insertRow();
    row.insertCell().textContent = name + ':';
    row.insertCell().textContent = components.map(x => curLang[x]).join(', ');
}

for (let {name, components} of Object.values(CursedRecipes)) {
    let row = cursedRecipesTable.insertRow();
    row.insertCell().textContent = name + ':';
    row.insertCell().textContent = components.map(x => curLang[x]).join(', ');
}

function nicknameIsValid(nickname) {
    return 1 <= nickname.length && nickname.length <= 12;
}

function createStartButton(container) {
    let startButton = document.createElement('button');
    startButton.id = 'startButton';
    startButton.textContent = curLang.startText;
    startButton.classList.add('start-menu-button');
    startButton.addEventListener('click', () => {
        let nickInput = document.querySelector('#nickname-input');
        if (!nicknameIsValid(nickInput.value)) {
            startButton.disabled = true;
            return;
        }
        createModeButtons(container);
        playerId = nickInput.value;
        startButton.remove();
        nickInput.remove();
        document.getElementById('leaderboardButton').remove();
    });
    return startButton;
}

function createNicknameInput() {
    let input = document.createElement('input');
    input.id = 'nickname-input';
    input.type = 'text';
    input.placeholder = curLang.nicknamePlaceholder;
    input.maxLength = 12;
    input.addEventListener('input', () => document.querySelector('#startButton').disabled = !nicknameIsValid(input.value));
    return input;
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
    let backButton = document.createElement('button');
    backButton.textContent = curLang.backButtonText;
    backButton.classList.add('start-menu-button');
    backButton.addEventListener('click', () => {
        startScreenContainer.remove();
        createStartScreen();
    });
    container.append(backButton);
}

function createStartScreen() {
    let startScreenContainer = document.createElement('div');
    startScreenContainer.id = 'startScreenContainer'; 
    let title = document.createElement('h1');
    title.id = 'startScreenTitle';
    title.textContent = 'Cofea';
    let startButton = createStartButton(startScreenContainer);
    let nicknameInput = createNicknameInput();
    let leaderboardButton = createLeaderboardButton();
    let ripple = document.createElement('div');
    ripple.classList.add('start-screen-ripple');
    startScreenContainer.append(title, nicknameInput, startButton, leaderboardButton, ripple);
    scriptNode.before(startScreenContainer);
    nicknameInput.value = playerId ?? '';
    nicknameInput.dispatchEvent(new Event('input'));
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

function createRecipesButton() {
    let recipesButton = document.createElement('button');
    recipesButton.id = 'recipesButton';
    recipesButton.textContent = curLang.recipesButtonText;
    recipesButton.addEventListener('click', () => showLightBox('.recipes'));
    recipesButton.classList.add('game-menu-button');
    return recipesButton;
}

function createCursedRecipesButton() {
    let recipesButton = document.createElement('button');
    recipesButton.id = 'cursedRecipesButton';
    recipesButton.textContent = curLang.recipesButtonText;
    recipesButton.addEventListener('click', () => showLightBox('.cursed-recipes'));
    recipesButton.classList.add('cursed-menu-button');
    recipesButton.style.display = 'none';
    return recipesButton;
}

function createLeaderboardButton() {
    let leaderboardButton = document.createElement('button');
    leaderboardButton.id = 'leaderboardButton';
    leaderboardButton.textContent = curLang.leaderboardButtonText;
    leaderboardButton.addEventListener('click', () => {
        leaderboardButton.disabled = true;
        showLeaderboard(currentGameSession?.mode ?? firstGameMode, MaxLeaderboardEntriesCount).then(() => leaderboardButton.disabled = false);
    });
    leaderboardButton.classList.add('start-menu-button');
    return leaderboardButton;
}

async function initGame(mode) {
    if (currentGameSession instanceof GameSession) {
        await finishSession();
    }

    let modeInfoContainer = createModeInfoContainer(mode);
    let scoreContainer = createScoreContainer();
    let stageInfoContainer = createStageInfoContainer();
    let gameInfoContainer = createGameInfoContainer(scoreContainer, stageInfoContainer, modeInfoContainer);
    // todo: move timer & score containers creation inside?

    let orderContainer = createOrderContainer();
    
    let gameContainer = createGameContainer();

    let finishButton = createFinishButton();
    let restartButton = createRestartButton();
    let recipesButton = createRecipesButton();
    let cursedRecipesButton = createCursedRecipesButton();
    let nextStateButton = createNextStateButton();
    let menuContainer = createMenuContainer(finishButton, restartButton, cursedRecipesButton, recipesButton, nextStateButton);
    // todo: move buttons creation inside?
    // todo: redundant css class for button, menu's id is enough?

    [finishButton, restartButton, recipesButton, nextStateButton].forEach(
        (btn, i) => btn.tabIndex = TabIndexOffsets.menu + i
    );
    // menuContainer.append(finishButton, restartButton, recipesButton, nextStateButton);
    //gameInfoContainer.append(scoreContainer, modeInfoContainer);

    scriptNode.before(gameInfoContainer, orderContainer, gameContainer, menuContainer);

    gameInfoContainer.classList.add('game-elements-fade-in');
    orderContainer.classList.add('game-elements-fade-in');
    gameContainer.classList.add('game-elements-fade-in');
    menuContainer.classList.add('game-elements-fade-in');   

    scriptNode.before(gameInfoContainer, orderContainer, gameContainer, menuContainer);

    currentGameSession = new GameSession(playerId, mode);
    switch (mode) {
        case 'classic':
            gameTimer = setInterval(() => {
                if (currentGameSession.totalOrders - currentGameSession.correctOrders === 3) {
                    finishSession().then(console.log('fin'));
                }
            }, 50);
            break;
        
        case 'arcade':
            gameTimer = setTimeout(() => finishSession().then(console.log('fin')), ArcadeGameTime * 1000);
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
    nextStateButton.textContent = curLang.nextStateButtonText;
    nextStateButton.addEventListener('click', () => currentGameSession.nextState());
    nextStateButton.classList.add('game-menu-button');
    return nextStateButton;
}

function createRestartButton() {
    let restartButton = document.createElement('button');
    restartButton.id = 'restartButton';
    restartButton.textContent = curLang.restartStateButtonText;
    restartButton.addEventListener('click', () => currentGameSession.restart());
    restartButton.classList.add('game-menu-button');
    return restartButton;
}

function createFinishButton() {
    let finishButton = document.createElement('button');
    finishButton.id = 'finishButton';
    finishButton.textContent = curLang.finishButtonText;
    finishButton.addEventListener('click', finishSession);
    finishButton.classList.add('game-menu-button');
    return finishButton;
}

function createGameInfoContainer(scoreContainer, stageInfoContainer, timerContainer) {
    let gameInfoContainer = document.createElement('div');
    gameInfoContainer.id = 'gameInfoContainer';
    gameInfoContainer.append(scoreContainer, stageInfoContainer, timerContainer);
    return gameInfoContainer;
}

function createModeInfoContainer(mode) {
    let modeInfoContainer = document.createElement('div');
    modeInfoContainer.id = 'modeInfoContainer';
    let modeInfo = document.createElement('h1');
    modeInfo.id = 'modeInfo';
    switch (mode) {
        case 'classic':
            modeInfo.textContent = curLang.mistakeCounterText(0);
            break;

        case 'arcade':
            modeInfo.textContent = curLang.timerText(ArcadeGameTime);
            break;

        case 'infinite':
            modeInfo.textContent = curLang.timerText(0);
            break;
    } 
    modeInfoContainer.append(modeInfo);
    return modeInfoContainer;
}

function createStageInfoContainer() {
    let stageInfoContainer = document.createElement('div');
    stageInfoContainer.id = 'stageInfoContainer';
    let stageText = document.createElement('h1');
    stageText.id = 'stageText';
    stageText.textContent = curLang.fillStateText;
    stageInfoContainer.append(stageText);
    return stageInfoContainer;
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



async function finishSession() {
    clearInterval(gameTimer);
    let gameInfoContainer = document.getElementById('gameInfoContainer');
    let orderContainer = document.getElementById('orderContainer');
    let gameContainer = document.getElementById('gameContainer');
    let menuContainer = document.getElementById('menuContainer');
    gameInfoContainer.classList.add('game-elements-fade-out');
    orderContainer.classList.add('game-elements-fade-out');
    gameContainer.classList.add('game-elements-fade-out');
    menuContainer.classList.add('game-elements-fade-out');
    let currentGameMode = currentGameSession.mode;
    let gameScore = currentGameSession.score;
    let totalOrders = currentGameSession.totalOrders;
    let correctOrders = currentGameSession.correctOrders;
    let playerId = currentGameSession.playerId;
    let playerData = await leaderboardDBs[currentGameMode].get(playerId);
    if ((playerData?.points ?? -1) < gameScore) {
        leaderboardDBs[currentGameMode].create(playerId, {points: gameScore});
    }
    setTimeout(() => {
        document.getElementById('gameInfoContainer').remove();
        document.getElementById('orderContainer').remove();
        document.getElementById('gameContainer').remove();
        document.getElementById('menuContainer').remove();
        currentGameSession.finish();
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
    scoreText.textContent = curLang.totalScoreText(0);
    scoreContainer.append(scoreText);
    return scoreContainer; // todo: return method for setting score?
}

function createResultScreen(gameMode, gameScore, totalOrders, correctOrders) {
    document.body.style.background = '#FFFDF0';
    let resultsScreenContainer = document.createElement('div');
    resultsScreenContainer.id = 'resultsScreenContainer';

    let quitButton = document.createElement('button');
    quitButton.id = 'quitButton';
    quitButton.textContent = curLang.goMenuButtonText;
    quitButton.classList.add('game-menu-button');

    let restartButton = document.createElement('button');
    restartButton.id = 'restartButton';
    restartButton.textContent = curLang.restartButtonText;
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
        document.body.style.background = '#FFFDF0';
        createStartScreen();
        setTimeout(() => {
            resultsScreenContainer.remove()
        }, 750);
        
    });

    restartButton.addEventListener('click', async () => {
        resultsScreenContainer.remove();
        document.body.style.background = '#FFFDF0';
        console.log(gameMode);
        await initGame(gameMode);
    });

    let resultScoreContainer =  document.createElement('div');
    resultScoreContainer.id = 'resultScoreContainer';

    let buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('filling-buttons-container')

    let scoreText = document.createElement('h1');
    scoreText.textContent = curLang.totalScoreText(gameScore); // 'Ваш счет: ' + 

    let orderCount = document.createElement('h1');
    orderCount.textContent = curLang.completedOrdersCountText(correctOrders);

    let correctOrdersText = document.createElement('h1');
    if (totalOrders > 0) {
        correctOrdersText.textContent = curLang.successPercentageText((correctOrders / totalOrders).toFixed(2) * 100);
    } else {
        correctOrdersText.textContent = curLang.successPercentageText(0);
    }
    
    resultScoreContainer.append(scoreText, orderCount, correctOrdersText);

    buttonsContainer.append(quitButton, restartButton);

    resultsScreenContainer.append(resultScoreContainer, buttonsContainer, ripple);

    scriptNode.before(resultsScreenContainer);
}

function addModeSelectionButtonsToLeaderboardLightbox() {
    Object.keys(GameModes).forEach(mode => {
        let button = document.createElement('button');
        button.textContent = GameModes[mode];
        button.classList.add('mode-selection-button');
        button.addEventListener('click', () => {
            button.disabled = true;
            showLeaderboard(mode, MaxLeaderboardEntriesCount).then(() => button.disabled = false);
        })
        leaderboardModeSelection.appendChild(button);
    });
}

function hideAllLightboxes() {
    document.querySelector('.lightboxes').style.display = 'none';
    document.querySelectorAll('.lightbox').forEach(x => x.hidden = true);
}
overlayNode.addEventListener('click', hideAllLightboxes); // todo: move up

function showLightBox(className) { // todo: make it not require dot in beginning
    document.querySelector('.lightboxes').style.display = 'flex';
    document.querySelectorAll('.lightbox').forEach(x => x.hidden = !x.classList.contains(className));
    document.querySelector('.lightboxes ' + className).hidden = false;
}

async function showLeaderboard(gameMode, count = Infinity) {
    while (leaderboardTable.rows.length > 0) {
        leaderboardTable.deleteRow(-1);
    }
    (await leaderboardDBs[gameMode].getAll(count, false)).forEach(doc => {
        const {id, points} = doc;
        let row = leaderboardTable.insertRow();
        row.insertCell().textContent = id;
        row.insertCell().textContent = points;
    });
    showLightBox('.leaderboard');
}
