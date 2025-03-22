// Base class for all physics game entities
import Entity from './entity.js';

export default class PhysicsEntity extends Entity {
    constructor(container, physics) {
        super(container); // Constructs graphics, position and rotation
        this.physics = physics;
        this.physicsBody = null;
    }
    
    init() {
        super.init(); // Creates graphic and adds it to container
        this.createPhysicsBody();
        
        if (this.physicsBody) {
            this.physics.World.add(this.physics.world, this.physicsBody);
        }
    }
    
    createPhysicsBody() {
        // To be implemented by subclasses
    }
    
    update(deltaTime) {
        if (this.physicsBody) {
            this.position.x = this.physicsBody.position.x;
            this.position.y = this.physicsBody.position.y;
            this.rotation = this.physicsBody.angle;
        }
        
        // Update graphic
        super.update(deltaTime);
    }
    
    destroy() {
        if (this.physicsBody) {
            this.physics.World.remove(this.physics.world, this.physicsBody);
        }

        super.destroy();
    }
}