import PhysicsEntity from '../main/physics-entity.js';
import config from '../../config/index.js';

const { asteroid: asteroidConfig } = config;

export default class Asteroid extends PhysicsEntity {
    constructor(container, physics, x, y, size, segments) {
        super(container, physics); // Constructs graphics, physics body, position and rotation
        this.x = x;
        this.y = y;
        this.size = size;
        this.segments = segments;
        this.points = [];
    }
    
    createGraphic() {
        this.generatePoints();
        
        this.graphic = new PIXI.Graphics();
        this.graphic.beginFill(asteroidConfig.ASTEROIDS.COLOR);
        
        this.graphic.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.segments; i++) {
            this.graphic.lineTo(this.points[i].x, this.points[i].y);
        }
        this.graphic.lineTo(this.points[0].x, this.points[0].y);
        
        this.graphic.endFill();
        this.graphic.position.set(this.x, this.y);
    }
    
    generatePoints() {
        // Generate points for the jagged asteroid shape
        this.points = [];
        for (let i = 0; i < this.segments; i++) {
            const angle = (i / this.segments) * Math.PI * 2;
            const radius = this.size * (0.7 + Math.random() * 0.3);
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            this.points.push({ x: px, y: py });
        }
    }
    
    createPhysicsBody() {
        const physicsPoints = this.points.map(p => ({ x: p.x, y: p.y }));
        this.physicsBody = this.physics.Bodies.fromVertices(this.x, this.y, [physicsPoints], {
            restitution: asteroidConfig.ASTEROIDS.PHYSICS.RESTITUTION,
            friction: asteroidConfig.ASTEROIDS.PHYSICS.FRICTION,
            density: asteroidConfig.ASTEROIDS.PHYSICS.DENSITY
        });
    }
}