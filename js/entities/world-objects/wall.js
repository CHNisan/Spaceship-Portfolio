import PhysicsEntity from '../physics-entity.js';

export default class Wall extends PhysicsEntity {
    constructor(container, physics, x, y, width, height, color) {
        super(container, physics);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    
    createGraphic() {
        this.graphic = new PIXI.Graphics();

        this.graphic.beginFill(this.color);
        this.graphic.drawRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        this.graphic.endFill();
    }
    
    createPhysicsBody() {
        this.physicsBody = this.physics.Bodies.rectangle(this.x, this.y, this.width, this.height, {isStatic: true});
    }
}