export const inputs = {
    0: 'up',
    1: 'right',
    2: 'down',
    3: 'left',
}

export const Volumes = {
    0: 'small',
    1: 'medium',
    2: 'large',
}

export const inputImages = {
    0: 'up.png',
    1: 'right.png',
    2: 'down.png',
    3: 'left.png',
}

export const Events = {
    init: 'init',
    restart: 'restart',
    dispose: 'dispose',
    nextState: 'nextState',
}

export const Fillings = {
    'coffee': 'Кофе',
    'tea': 'Чай',
    'juice': 'Сок',
}

export const Toppings = {
    'milk': 'Молоко',
    'cocoa': 'Какао',
    'fizzy-water': 'Газировка',
    'caramel': 'Карамель',
    'lemon': 'Лемон',
    'mint': 'Мята',
}

export const IsFilling = {
    'tea': true,
    'coffee': true,
    'juice': true,
    'milk': false,
    'cocoa': false,
    'fizzy-water': false,
    'caramel': false,
    'lemon': false,
    'mint': false,
}

export const VolumeTranslation = {
    'small': 'малый',
    'medium': 'средний',
    'large': 'большой'
}


export const FullScore = 1000;


export function getRgb(r, g, b){
    return `rgb(${r}, ${g}, ${b})`;
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export function equalArrays(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
}

export function mixColors(...colors) {
    
}

function containsAll (arr1, arr2) {
    return arr2.every(arr2Item => arr1.includes(arr2Item));
}
                
                
function sameMembers (arr1, arr2) {
    return containsAll(arr1, arr2) && containsAll(arr2, arr1);
}

export function equalOrders(order, cupComponents, cupVolume) {
    return sameMembers(order.components, cupComponents) && order.volume === cupVolume;
}


export function setRandomInterval (intervalFunction, minDelay, maxDelay) {
    let timeout;
  
    const runInterval = () => {
      const timeoutFunction = () => {
        intervalFunction();
        runInterval();
      };
  
      const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  
      timeout = setTimeout(timeoutFunction, delay);
    };
  
    runInterval();
  
    return {
      clear() { clearTimeout(timeout) },
    };
};
