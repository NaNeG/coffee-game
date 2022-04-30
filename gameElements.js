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
}

class Filling extends Drawable {
    constructor(container, texture){
        super(container);
        this.texture = texture;
        this.draw();
    }

    draw() {
        super.draw("filling-bar", this.texture);
    }
}

class Cup extends Drawable{

    contents = [];

    constructor(container, color) {
        super(container);        
        this.color = color;
        this.draw();
    }

    fill(filling) {
        let fillBarContainer = document.querySelector('.filling-bar-container');
        if (this.contents.length < 4){
            this.contents.push(filling);
            let fillBar = new Filling(fillBarContainer, filling);
        }   
    }
    
    draw() {
        let cupBody = document.createElement('div');
        let handle = document.createElement('div');
        let fillBarContainer = document.createElement('div');
        fillBarContainer.classList.add('filling-bar-container');
        cupBody.classList.add('cup');
        handle.classList.add('handle');
        cupBody.append(handle);
        cupBody.append(fillBarContainer);
        this.container.append(cupBody);
    }
}


export { Cup };
