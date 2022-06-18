import { getRandomInt, getRgb, IsFilling } from "./helpers.js";


class Drawable {
    constructor(container) {
        this.container = container;
    }

    draw(...classList) {
        let element = document.createElement('div');
        for (let c of classList) {
            element.classList.add(c);            
        }
        this.container.append(element);
    }

    changeContainer(newContainer) {
        this.container = newContainer;
    }
}

class FillingBar extends Drawable {
    constructor(container, texture){
        super(container);
        this.texture = texture;
    }

    draw(firstTime) {
        if (firstTime) {
            super.draw("filling-bar", 'filling-bar-animation', this.texture);
        }
        else {
            super.draw("filling-bar", this.texture);
        }
    }


}

class ToppingBar extends Drawable {
    constructor(container, texture){
        super(container);
        this.texture = texture;
    }

    draw(firstTime) {
        if (firstTime) {
            super.draw("topping-bar", 'topping-bar-animation', this.texture);
        }
        else {
            super.draw("topping-bar", this.texture);
        }
    }

}

class PouringCupBar extends Drawable {
    constructor(container, texture, volume){
        super(container);
        this.texture = texture;
        this.volume = volume;
    }

    draw() {
        let element = document.createElement('div');
        element.classList.add("pouring-cup-bar", 'pouring-cup-animation');
        element.style.backgroundColor = `rgb(${this.texture[0]}, ${this.texture[1]}, ${this.texture[2]})`
        element.style.setProperty('--animation-height', this.volume + '%');
        this.container.append(element);
    }

}

class Cup extends Drawable {

    components = [];

    constructor(container, color='black') {
        super(container);        
        //this.color = color;
        this.draw();
    }

    fill(component) {
        if (this.components.length < 4){
            let fillBarContainer = document.querySelector('.filling-bar-container');
            this.drawFilling(fillBarContainer, component, true);
            this.components.push(component);
        }   
    }

    drawFilling(container, component, firstTime) {
        if (IsFilling[component]){
            let fillBar = new FillingBar(container, component);
            fillBar.draw(firstTime);
        }
        else {
            let fillBar = new ToppingBar(container, component);
            fillBar.draw(firstTime);        
        }
        
    }
    
    draw() {
        let cupBody = document.createElement('div');
        let fillBarContainer = document.createElement('div');
        fillBarContainer.classList.add('filling-bar-container');
        cupBody.classList.add('cup');
        cupBody.append(fillBarContainer);
        for (let component of this.components){
           this.drawFilling(fillBarContainer, component, false);
        }
        this.container.append(cupBody);
    }
}

class Drink extends Drawable {
    constructor(container) {
        super(container);
        this.draw();
        this.firstTimeFill = true;
    }

    fill(volume, texture) {
        this.volume = Math.ceil(volume / 33.34) * 33.34;
        if (this.firstTimeFill) {
            this.firstTimeFill = false;
            let fillBarContainer = document.getElementById('pouringFillBarContainer');
            this.drawFilling(fillBarContainer, texture);
        }    
    }

    drawFilling(container, texture) {
        let fillBar = new PouringCupBar(container, texture, this.volume);
        fillBar.draw();
    }

    draw() {
        let cupBody = document.createElement('div');
        let pouringFillBarContainer = document.createElement('div');
        pouringFillBarContainer.id = 'pouringFillBarContainer';
        pouringFillBarContainer.classList.add('mug-filling-bar-container');
        cupBody.classList.add('mug');
        cupBody.append(pouringFillBarContainer);
        this.container.append(cupBody);
    }
}

class PouringBar extends Drawable {
    constructor(container, barColor) {
        super(container);
        this.progress = 0;
        this.draw(barColor);
    }

    draw(barColor) {
        let oppositeDirection = false;
        let pouringBar = document.createElement('div');
        pouringBar.classList.add('pouring-bar');
        pouringBar.style.setProperty('--background-color', `rgb(${barColor[0]}, ${barColor[1]}, ${barColor[2]})`);
        this.container.append(pouringBar);
        
        this.interval = setInterval(() => {
            
            if (!oppositeDirection) {
                this.progress++;
                if (this.progress == 100) {
                    oppositeDirection = true;
                }
                
            }
            else {
                this.progress--;
                if (this.progress == 0) {
                    oppositeDirection = false;
                }
                
            }
            pouringBar.style.height = this.progress + '%';

        }, 15);      
    }

    stop() {
        clearInterval(this.interval);
    }
}

class Order {
    constructor(recipe, volume, isCursed) {
        this.name = recipe.name;
        this.components = recipe.components;
        this.volume = volume;
        this.isCursed = isCursed;
    }
}


export { Cup, PouringBar, Drink, Order };
