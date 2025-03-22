import PhysicsEntity from '../main/physics-entity.js';

export default class Wall extends PhysicsEntity {
    constructor(container, physics, x, y, width, height, color) {
        super(container, physics); // Constructs graphics, physics body, position and rotation
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    
    createGraphic() {
        this.graphic = new PIXI.Graphics();

        this.graphic.beginFill(this.color);
        this.graphic.drawRect(-this.width/2, -this.height/2, this.width, this.height); // Minus half width and height for the graphic position as the rectangle is drawn from the top left (rather than the center like the physics body)
        this.graphic.endFill();

        this.graphic.position.set(this.x, this.y);
    }
    
    createPhysicsBody() {
        this.physicsBody = this.physics.Bodies.rectangle(this.x, this.y, this.width, this.height, {isStatic: true});
    }
}