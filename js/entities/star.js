import Entity from './entity.js';

export default class Star extends Entity {
    constructor(container, x, y, size, brightness) {
        super(container);
        this.position.x = x;
        this.position.y = y;
        this.size = size;
        this.brightness = brightness;
    }
    
    createGraphic() {
        this.graphic = new PIXI.Graphics();
        this.graphic.beginFill(0xFFFFFF, this.brightness);
        this.graphic.drawCircle(0, 0, this.size);
        this.graphic.endFill();
        this.graphic.position.set(this.position.x, this.position.y);
    }
}