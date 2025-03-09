import Entity from './entity.js';

export default class PhysicsEntity extends Entity {
    constructor(container, physics) {
        super(container);
        this.physics = physics;
        this.physicsBody = null;
    }
    
    init() {
        super.init();
        this.createPhysicsBody();
        
        if (this.physicsBody) {
            this.physics.World.add(this.physics.world, this.physicsBody);
        }
    }
    
    createPhysicsBody() {
        // To be implemented by subclasses
    }
    
    update(deltaTime) {
        // Update position and rotation from physics body
        if (this.physicsBody) {
            this.position.x = this.physicsBody.position.x;
            this.position.y = this.physicsBody.position.y;
            this.rotation = this.physicsBody.angle;
        }
        
        // Update graphic
        super.update(deltaTime);
    }
    
    destroy() {
        // Remove physics body
        if (this.physicsBody) {
            this.physics.World.remove(this.physics.world, this.physicsBody);
        }
        
        // Call parent destroy
        super.destroy();
    }
}