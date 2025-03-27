// js/core/physics.js
import config from '../config/index.js';

const { physics: physicsConfig, world: worldConfig } = config;

export default class PhysicsEngine {
    constructor() {
        // Matter.js modules
        this.Engine = Matter.Engine;
        this.World = Matter.World;
        this.Bodies = Matter.Bodies;
        this.Body = Matter.Body;
        this.Vector = Matter.Vector;
        
        // Physics properties
        this.engine = null;
        this.world = null;
        
        // Game world boundaries - now using separate width and height
        this.WORLD_WIDTH = worldConfig.WIDTH;
        this.WORLD_HEIGHT = worldConfig.HEIGHT;
        this.WORLD_BOUNDS = worldConfig.BOUNDS;
        this.walls = [];
    }
    
    //#region Setup
    init() {
        this.engine = this.Engine.create({
            gravity: physicsConfig.ENGINE.GRAVITY
        });
        this.world = this.engine.world;
        
        // Create boundary walls (physics only)
        this.createWalls();
    }
    
    createWalls() {
        const wallOptions = { 
            isStatic: physicsConfig.WALLS.IS_STATIC,
            restitution: physicsConfig.WALLS.RESTITUTION
        };
        
        this.walls = [
            // Top wall 
            this.Bodies.rectangle(0, this.WORLD_BOUNDS.MIN_Y, this.WORLD_WIDTH, 
                                 physicsConfig.WALLS.THICKNESS, wallOptions),
            // Bottom wall 
            this.Bodies.rectangle(0, this.WORLD_BOUNDS.MAX_Y, this.WORLD_WIDTH, 
                                 physicsConfig.WALLS.THICKNESS, wallOptions),
            // Left wall 
            this.Bodies.rectangle(this.WORLD_BOUNDS.MIN_X, 0, physicsConfig.WALLS.THICKNESS, 
                                 this.WORLD_HEIGHT, wallOptions),
            // Right wall 
            this.Bodies.rectangle(this.WORLD_BOUNDS.MAX_X, 0, physicsConfig.WALLS.THICKNESS, 
                                 this.WORLD_HEIGHT, wallOptions)
        ];
        
        this.World.add(this.world, this.walls);
    }
    //#endregion
    
    keepEntityInBounds(entity) {
        // Additional check to make sure the ship stays in bounds even if it clips through the world walls
        if (!entity || !entity.physicsBody) return;
        
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

    update(deltaTime) {
        this.Engine.update(this.engine, deltaTime);
    }
}