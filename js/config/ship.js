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
        BODY_COLOR: 0x4AA8E2,  // Blue spaceship color
        ENGINE_GLOW_COLOR: 0xF76565,  // Red engine glow
        ENGINE_GLOW_SIZE: 3  // Size of engine glow effect
    },
    
    // Starting position
    SPAWN: {
        X: 0,
        Y: 0,
        ROTATION: -Math.PI / 2
    }
};

export default shipConfig;