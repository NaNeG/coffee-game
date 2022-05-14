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
                        
