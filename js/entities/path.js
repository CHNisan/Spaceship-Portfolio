import Entity from './entity.js';

export default class Path extends Entity {
    constructor(container, x, y, width, height, color) {
        super(container);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    
    createGraphic() {
        this.graphic = new PIXI.Graphics();

        this.graphic.beginFill(this.color);
        this.graphic.drawRect(this.x, this.y, this.width, this.height);
        this.graphic.endFill();
    }
}