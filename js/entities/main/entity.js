// Base class for all game entities
export default class Entity {
    constructor(container) {
        this.container = container;
        this.graphic = null;
        this.position = { x: 0, y: 0 };
        this.rotation = 0;
    }
    
    init() {
        // Create the PIXI graphic for this entity
        this.createGraphic();
        
        // Add to the container
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
        // Remove from container and clean up
        if (this.graphic && this.container) {
            this.container.removeChild(this.graphic);
        }
    }
}