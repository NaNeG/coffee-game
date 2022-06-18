export const Inputs = {
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
    'chocolate': 'Шоколад',
    'fizzy-water': 'Газировка',
    'caramel': 'Карамель',
    'lemon': 'Лемон',
    'mint': 'Мята',
}

// export const CursedFillings = {
//     'uranium': 'Уран',
//     'muc': 'MUC-963',
//     'nakirium': 'Накириум'
// }

// export const CursedToppings = {
//     'y1': 'Y1',
//     'y2': 'Y2',
//     'y3': 'Y3'
// }
export const CursedFillings = {
    'x1': 'X1',
    'x2': 'X2',
    'x3': 'X3'
}

export const CursedToppings = {
    'y1': 'Y1',
    'y2': 'Y2',
    'y3': 'Y3'
}

export const ComponentTranslation = { ...Fillings, ...Toppings }

export const CursedComponentTranslation = { ...CursedFillings, ...CursedToppings }

export const IsFilling = {
    'tea': true,
    'coffee': true,
    'juice': true,
    'milk': false,
    'chocolate': false,
    'fizzy-water': false,
    'caramel': false,
    'lemon': false,
    'mint': false,
    'x1': true,
    'x2': true,
    'x3': true,
    'y1': false,
    'y2': false,
    'y3': false
}

export const VolumeTranslation = {
    'small': 'малый',
    'medium': 'средний',
    'large': 'большой'
}

export const GameModes = {
    'classic': 'Классика',
    'arcade': 'Аркада',
    'infinite': 'Бесконечный',
}

export const FullScore = 1000;

export const ArcadeGameTime = 120;

export const MaxLeaderboardEntriesCount = 5;

export const TabIndexOffsets = {
    navBar: 1,
    game: 501,
    menu: 1001,
}

export function getRgb(r, g, b){
    return `rgb(${r}, ${g}, ${b})`;
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export function equalArrays(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
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

export function equalComponents(order, cupComponents) {
    return sameMembers(order.components, cupComponents);
}

export function equalVolumes(order, cupVolume) {
    return sameMembers(order.volume, cupVolume);
}

export function getArrayDifference(arr1, arr2) {
    return arr1.filter(x => !arr2.includes(x)).concat(arr2.filter(x => !arr1.includes(x)));
}

export function getArrayIntersection(arr1, arr2) {
    return arr1.filter(x => arr2.includes(x))
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

function rgb2cmyk(r, g, b) {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);
    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);
    return [c, m, y, k];
}

function cmyk2rgb(c, m, y, k) {
    let r = c * (1 - k) + k;
    let g = m * (1 - k) + k;
    let b = y * (1 - k) + k;
    r = (1 - r) * 255 + .5;
    g = (1 - g) * 255 + .5;
    b = (1 - b) * 255 + .5;
    return [Math.floor(r), Math.floor(g), Math.floor(b)];
}

function mix_cmyks(...cmyks) {
    let c = cmyks.map(cmyk => cmyk[0]).reduce((a, b) => a + b, 0) / cmyks.length;
    let m = cmyks.map(cmyk => cmyk[1]).reduce((a, b) => a + b, 0) / cmyks.length;
    let y = cmyks.map(cmyk => cmyk[2]).reduce((a, b) => a + b, 0) / cmyks.length;
    let k = cmyks.map(cmyk => cmyk[3]).reduce((a, b) => a + b, 0) / cmyks.length;
    return [c, m, y, k];
}

export function mix_rgbs(...rgbs) {
    let cmyks = rgbs.map(rgb => rgb2cmyk(...rgb));
    let mixture_cmyk = mix_cmyks(...cmyks);
    let mixture_rgb = cmyk2rgb(...mixture_cmyk);
    return mixture_rgb;
}

export function convertRGB(colorString)
{
  const rgbKeys = ['r', 'g', 'b'];
  let rgbArray = [];
  let color = colorString.replace(/^rgb?\(|\s+|\)$/g,'').split(',');

  for (let i in rgbKeys)
    rgbArray.push(color[i] || 1);

  return rgbArray;
}

export function getRipplePosition(element) {
    let rect = element.getBoundingClientRect();
    return [rect.top + (rect.bottom - rect.top) / 2 - window.innerWidth, rect.left + (rect.right - rect.left) / 2 - window.innerWidth];
}

export const componentsColors = {};

if (window.document.styleSheets.length != 1) {
    throw new Error('Not Implemented');
}

const styleSheet = window.document.styleSheets[0];

for (let rule of styleSheet.cssRules) {
    if (!rule.selectorText || rule.selectorText.length <= 1) continue;
    let potentialClassName = rule.selectorText.substring(1);
    if (potentialClassName in Toppings || potentialClassName in Fillings || potentialClassName in CursedFillings || potentialClassName in CursedToppings) {
        componentsColors[potentialClassName] = rule.style.background;
    }
} // todo: possibly better to define and set colors in js only
