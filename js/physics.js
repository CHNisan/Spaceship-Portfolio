// Physics setup and configuration
SpaceGame.Physics = {
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
    WORLD_SIZE: 5000,
    WORLD_BOUNDS: null,
    walls: [],
    
    init() {
        // Create engine with no gravity
        this.engine = this.Engine.create({
            gravity: { x: 0, y: 0 }
        });
        this.world = this.engine.world;
        
        // Set world boundaries
        this.WORLD_BOUNDS = {
            min: { x: -this.WORLD_SIZE / 2, y: -this.WORLD_SIZE / 2 },
            max: { x: this.WORLD_SIZE / 2, y: this.WORLD_SIZE / 2 }
        };
        
        // Create boundary walls (physics only)
        this.createWalls();
    },
    
    createWalls() {
        const wallOptions = { 
            isStatic: true
        };
        
        this.walls = [
            this.Bodies.rectangle(0, -this.WORLD_SIZE / 2, this.WORLD_SIZE, 50, wallOptions), // Top
            this.Bodies.rectangle(0, this.WORLD_SIZE / 2, this.WORLD_SIZE, 50, wallOptions),  // Bottom
            this.Bodies.rectangle(-this.WORLD_SIZE / 2, 0, 50, this.WORLD_SIZE, wallOptions), // Left
            this.Bodies.rectangle(this.WORLD_SIZE / 2, 0, 50, this.WORLD_SIZE, wallOptions)   // Right
        ];
        
        this.World.add(this.world, this.walls);
    },
    
    update(deltaTime) {
        this.Engine.update(this.engine, deltaTime);
    },
    
    keepEntityInBounds(entity) {
        const pos = entity.physicsBody.position;
        
        if (pos.x < this.WORLD_BOUNDS.min.x) {
            this.Body.setPosition(entity.physicsBody, { x: this.WORLD_BOUNDS.min.x, y: pos.y });
            this.Body.setVelocity(entity.physicsBody, { x: 0, y: entity.physicsBody.velocity.y });
        }
        if (pos.x > this.WORLD_BOUNDS.max.x) {
            this.Body.setPosition(entity.physicsBody, { x: this.WORLD_BOUNDS.max.x, y: pos.y });
            this.Body.setVelocity(entity.physicsBody, { x: 0, y: entity.physicsBody.velocity.y });
        }
        if (pos.y < this.WORLD_BOUNDS.min.y) {
            this.Body.setPosition(entity.physicsBody, { x: pos.x, y: this.WORLD_BOUNDS.min.y });
            this.Body.setVelocity(entity.physicsBody, { x: entity.physicsBody.velocity.x, y: 0 });
        }
        if (pos.y > this.WORLD_BOUNDS.max.y) {
            this.Body.setPosition(entity.physicsBody, { x: pos.x, y: this.WORLD_BOUNDS.max.y });
            this.Body.setVelocity(entity.physicsBody, { x: entity.physicsBody.velocity.x, y: 0 });
        }
    }
};