import PhysicsEntity from './physics-entity.js';
import config from '../config/index.js';

const { entities: entitiesConfig } = config;

export default class Wall extends PhysicsEntity {
    constructor(container, physics, x, y, size, segments) {
        super(container, physics);
        this.x = x;
        this.y = y;
        this.size = size;
        this.segments = segments;
        this.points = [];
    }
    
    createGraphic() {
        // Generate points for the jagged asteroid shape
        this.generatePoints();
        
        // Create asteroid graphic
        this.graphic = new PIXI.Graphics();
        this.graphic.beginFill(entitiesConfig.ASTEROIDS.COLOR);
        
        this.graphic.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.segments; i++) {
            this.graphic.lineTo(this.points[i].x, this.points[i].y);
        }
        this.graphic.lineTo(this.points[0].x, this.points[0].y);
        
        this.graphic.endFill();
        this.graphic.position.set(this.x, this.y);
    }
    
    generatePoints() {
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
            restitution: entitiesConfig.ASTEROIDS.PHYSICS.RESTITUTION,
            friction: entitiesConfig.ASTEROIDS.PHYSICS.FRICTION,
            density: entitiesConfig.ASTEROIDS.PHYSICS.DENSITY
        });
    }
}