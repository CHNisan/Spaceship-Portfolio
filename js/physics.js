// Physics setup and configuration
import config from './config/index.js';

// Get physics and world config
const { physics: physicsConfig, world: worldConfig } = config;

const Physics = {
    // Matter.js modules
    Engine: Matter.Engine,
    World: Matter.World,
    Bodies: Matter.Bodies,
    Body: Matter.Body,
    Vector: Matter.Vector,
    
    // Physics properties
    engine: null,
    world: null,
    
    // Game world boundaries
    WORLD_SIZE: worldConfig.SIZE,
    WORLD_BOUNDS: worldConfig.BOUNDS,
    walls: [],
    
    init() {
        // Create engine with config gravity
        this.engine = this.Engine.create({
            gravity: physicsConfig.ENGINE.GRAVITY
        });
        this.world = this.engine.world;
        
        // Create boundary walls (physics only)
        this.createWalls();
    },
    
    createWalls() {
        const wallOptions = { 
            isStatic: physicsConfig.WALLS.IS_STATIC,
            restitution: physicsConfig.WALLS.RESTITUTION
        };
        
        this.walls = [
            this.Bodies.rectangle(0, this.WORLD_BOUNDS.MIN_Y, this.WORLD_SIZE, 
                                 physicsConfig.WALLS.THICKNESS, wallOptions), // Top
            this.Bodies.rectangle(0, this.WORLD_BOUNDS.MAX_Y, this.WORLD_SIZE, 
                                 physicsConfig.WALLS.THICKNESS, wallOptions),  // Bottom
            this.Bodies.rectangle(this.WORLD_BOUNDS.MIN_X, 0, physicsConfig.WALLS.THICKNESS, 
                                 this.WORLD_SIZE, wallOptions), // Left
            this.Bodies.rectangle(this.WORLD_BOUNDS.MAX_X, 0, physicsConfig.WALLS.THICKNESS, 
                                 this.WORLD_SIZE, wallOptions)   // Right
        ];
        
        this.World.add(this.world, this.walls);
    },
    
    update(deltaTime) {
        this.Engine.update(this.engine, deltaTime);
    },
    
    keepEntityInBounds(entity) {
        const pos = entity.physicsBody.position;
        
        if (pos.x < this.WORLD_BOUNDS.MIN_X) {
            this.Body.setPosition(entity.physicsBody, { x: this.WORLD_BOUNDS.MIN_X, y: pos.y });
            this.Body.setVelocity(entity.physicsBody, { x: 0, y: entity.physicsBody.velocity.y });
        }
        if (pos.x > this.WORLD_BOUNDS.MAX_X) {
            this.Body.setPosition(entity.physicsBody, { x: this.WORLD_BOUNDS.MAX_X, y: pos.y });
            this.Body.setVelocity(entity.physicsBody, { x: 0, y: entity.physicsBody.velocity.y });
        }
        if (pos.y < this.WORLD_BOUNDS.MIN_Y) {
            this.Body.setPosition(entity.physicsBody, { x: pos.x, y: this.WORLD_BOUNDS.MIN_Y });
            this.Body.setVelocity(entity.physicsBody, { x: entity.physicsBody.velocity.x, y: 0 });
        }
        if (pos.y > this.WORLD_BOUNDS.MAX_Y) {
            this.Body.setPosition(entity.physicsBody, { x: pos.x, y: this.WORLD_BOUNDS.MAX_Y });
            this.Body.setVelocity(entity.physicsBody, { x: entity.physicsBody.velocity.x, y: 0 });
        }
    }
};

export default Physics;