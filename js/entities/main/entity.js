// Base class for all game entities
export default class Entity {
    constructor(container) {
        this.container = container; // The container that holds the entity's graphics
        this.graphic = null;
        this.position = { x: 0, y: 0 };
        this.rotation = 0;
    }
    
    init() {
        this.createGraphic();
        
        if (this.graphic && this.container) {
            this.container.addChild(this.graphic);
        }
    }
    
    createGraphic() {
        // To be implemented by subclasses
        this.graphic = new PIXI.Container();
    }
    
    update(deltaTime) {
        // Base update method - update graphic from properties
        if (this.graphic) {
            this.graphic.position.set(this.position.x, this.position.y);
            this.graphic.rotation = this.rotation;
        }
    }
    
    destroy() {
        if (this.graphic && this.container) {
            this.container.removeChild(this.graphic);
        }
    }
}