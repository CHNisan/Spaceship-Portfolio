import Entity from '../main/entity.js';

export default class Path extends Entity {
    constructor(container, x, y, width, height, color) {
        super(container); // Constructs graphics, position and rotation
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    
    createGraphic() {
        this.graphic = new PIXI.Graphics();

        this.graphic.beginFill(this.color);
        this.graphic.drawRect(0, 0, this.width, this.height);
        this.graphic.endFill();

        this.graphic.position.set(this.x, this.y);
    }
}