const shipConfig = {
    // Physics properties
    PHYSICS: {
        DENSITY: 0.001,
        FRICTION_AIR: 0.03,
        RESTITUTION: 0.3,
        FRICTION: 0.01
    },
    
    // Thrust parameters
    THRUST: {
        FORCE_MULTIPLIER: 0.0007,  // Force applied when thrusting
        ANGULAR_VELOCITY_MULT: 0.2  // Angular velocity multiplier for rotation
    },
    
    // Visual properties
    VISUAL: {
        BODY_COLOR: 0x3498db,  // Blue spaceship color
        ENGINE_GLOW_COLOR: 0xff3300,  // Orange engine glow
        ENGINE_GLOW_SIZE: 3  // Size of engine glow effect
    },
    
    // Starting position
    SPAWN: {
        X: 0,
        Y: 0
    }
};

export default shipConfig;