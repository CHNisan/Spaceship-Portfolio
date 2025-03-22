import PhysicsEntity from '../main/physics-entity.js';

export default class Ball extends PhysicsEntity {
    constructor(container, physics, x, y, radius, color, physicsSettings) {
        super(container, physics);
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.physicsSettings = physicsSettings // Config values for specific kinds of balls
    }
    
    createGraphic() {
        this.graphic = new PIXI.Graphics();

        this.graphic.beginFill(this.color);
        this.graphic.drawCircle(0, 0, this.radius);
        this.graphic.endFill();

        this.graphic.position.set(this.x, this.y);
    }
    
    createPhysicsBody() {
        this.physicsBody = this.physics.Bodies.circle(this.x, this.y, this.radius, {
            restitution: this.physicsSettings.RESTITUTION,
            friction: this.physicsSettings.FRICTION,
            density: this.physicsSettings.DENSITY
        });
    }
}