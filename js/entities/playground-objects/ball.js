import PhysicsEntity from '../physics-entity.js';
import config from '../../config/index.js';

const { ball: ballConfig } = config;

export default class Ball extends PhysicsEntity {
    constructor(container, physics, x, y, radius, color) {
        super(container, physics);
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
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
            restitution: ballConfig.DEFAULT.PHYSICS.RESTITUTION,
            friction: ballConfig.DEFAULT.PHYSICS.FRICTION,
            density: ballConfig.DEFAULT.PHYSICS.DENSITY
        });
    }
}