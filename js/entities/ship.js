import PhysicsEntity from './main/physics-entity.js';
import config from '../config/index.js';

const { ship: shipConfig } = config;

export default class Ship extends PhysicsEntity {
    constructor(container, physics) {
        super(container, physics); // Constructs graphics, physics body, position and rotation
        this.engineGlow = null;
        this.isThrusting = false;
    }
    
    createGraphic() {
        this.graphic = new PIXI.Container();
        
        // Ship body
        const shipGraphics = new PIXI.Graphics();
        shipGraphics.beginFill(shipConfig.VISUAL.BODY_COLOR);
        shipGraphics.moveTo(20, 0);
        shipGraphics.lineTo(-10, -10);
        shipGraphics.lineTo(-5, 0);
        shipGraphics.lineTo(-10, 10);
        shipGraphics.lineTo(20, 0);
        shipGraphics.endFill();
        this.graphic.addChild(shipGraphics);
        
        // Ship engine glow
        this.engineGlow = new PIXI.Graphics();
        this.engineGlow.beginFill(shipConfig.VISUAL.ENGINE_GLOW_COLOR);
        this.engineGlow.drawCircle(-7, 0, shipConfig.VISUAL.ENGINE_GLOW_SIZE);
        this.engineGlow.endFill();
        this.graphic.addChild(this.engineGlow);
        this.engineGlow.visible = false;

        this.graphic.rotation = shipConfig.SPAWN.ROTATION;
    }
    
    createPhysicsBody() {
        this.physicsBody = this.physics.Bodies.polygon(
            shipConfig.SPAWN.X, 
            shipConfig.SPAWN.Y, 
            3, 15, {
                density: shipConfig.PHYSICS.DENSITY,
                frictionAir: shipConfig.PHYSICS.FRICTION_AIR,
                restitution: shipConfig.PHYSICS.RESTITUTION,
                friction: shipConfig.PHYSICS.FRICTION
            }
        );

        this.physics.Body.setAngle(this.physicsBody, shipConfig.SPAWN.ROTATION);
    }
    
    setEngineGlow(isVisible) {
        if (this.engineGlow) {
            this.engineGlow.visible = isVisible;
        }
    }
}