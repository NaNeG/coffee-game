class Drawable {
    constructor(container, id) {
        this.container = container;
        this.id = id;
    }

    draw(...classList) {
        let element = document.createElement('div');
        for (let c of classList) {
            element.classList.add(c);            
        }
        if (this.id !== undefined){
            element.id = this.id;
        }
        this.container.append(element);
    }
}

class Filling extends Drawable {
    constructor(container, id, texture){
        super(container, id);
        this.texture = texture;
    }

    draw() {
        super.draw("box", this.texture);
    }
}

class Cup extends Drawable{

    contents = [];

    constructor(container, id, color) {
        super(container, id);        
        this.color = color;
    }

    fill(filling) {
        this.contents.push(filling);
    }
    
    draw() {
        let cupBody = document.createElement('div');
        let handle = document.createElement('div');
        cupBody.classList.add('cup');
        handle.classList.add('handle');
        cupBody.append(handle);
        this.container.append(cupBody);
    }
}


class Water extends Filling {
    constructor(container, id) {
        super(container, id, 'lightblue');
    }
}

class Tea extends Filling {
    constructor(container, id) {
        super(container, id, 'brown');
    }
}

class Coffee extends Filling {
    constructor(container, id) {
        super(container, id, 'black');
    }
}

export { Cup, Water, Tea, Coffee };
