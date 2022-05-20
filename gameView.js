import { Cup } from "./gameElements.js";
import { GameSession } from './gameSession.js'
import { iterFileRows } from "./helpers.js";
import { Recipes } from "./recipes.js";

const GameTime = 60;

let currentGameSession;
let gameTimer;

let scriptNode = document.getElementsByTagName('script')[0];

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

let recipes = document.createElement('block');
recipes.id = 'recipes';
recipes.hidden = true;
recipes.style.position = 'fixed';
recipes.style.top = recipes.style.left = '50%';
recipes.style.transform = 'translateX(-50%) translateY(-100%)';
recipes.append('Рецепты:')
for (let {name, components} of Object.values(Recipes)) {
    let recipe = document.createElement('div');
    recipe.append(`${name}: ${components.join(', ')}`);
    recipes.append(recipe);
}

scriptNode.before(recipes);

let leaderboard = document.createElement('block');
leaderboard.id = 'leaderboard';
leaderboard.hidden = true;
leaderboard.style.position = 'fixed';
leaderboard.style.top = leaderboard.style.left = '50%';
leaderboard.style.transform = 'translateX(-50%) translateY(-100%)';
let leaderboardHeader = 'Таблица лидеров';//document.createElement('div');
// leaderboardHeader.textContent = 'Таблица лидеров:';
leaderboard.append(leaderboardHeader);
let minPadd = document.createElement('div');
minPadd.style.width = '20px';
for (let row of iterFileRows('leaderboard.txt')) {
    let [id, score] = row.split(' ');
    let idDiv = document.createElement('div');
    idDiv.textContent = id;
    let scoreDiv = document.createElement('div');
    scoreDiv.textContent = score;
    let rowDiv = document.createElement('div');
    rowDiv.style.width = '100%';
    rowDiv.style.display = 'flex';
    rowDiv.style.flexDirection = 'row';
    scoreDiv.style.marginLeft = 'auto';
    rowDiv.append(idDiv, minPadd, scoreDiv);
    leaderboard.append(rowDiv);
}

scriptNode.before(leaderboard);

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
    recipesButton.addEventListener('click', () => { recipes.hidden ^= true; });
    return recipesButton;
}

function createLeaderboardButton() {
    let leaderboardButton = document.createElement('button');
    leaderboardButton.id = 'leaderboardButton';
    leaderboardButton.textContent = 'Leaderboard';
    leaderboardButton.addEventListener('click', () => { leaderboard.hidden ^= true; });
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





