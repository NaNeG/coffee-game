import { Cup, Water, Tea, Coffee } from './gameElements.js'
import { getRgb } from './helpers.js'

// let container = document.querySelector('.container');
// for (let i = 1; i < 4; i++){
//     let div = document.createElement('div');
//     div.classList.add('box');
//     setTimeout(() => container.append(div), 1000 * i); 
// }

let container = document.querySelector('.container');
let filling = new Water(container);
filling.draw();

// let mugContainer = document.querySelector('.cup-container');
// for (let i = 1; i < 4; i++){
//     let cup = new Cup('cup-container', getRgb(100, 100, 0), 1);  
//     cup.draw();
// }

