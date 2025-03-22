const shipConfig = {
    PHYSICS: {
        DENSITY: 0.001,
        FRICTION_AIR: 0.03,
        RESTITUTION: 0.3,
        FRICTION: 0.01
    },
    
    THRUST: {
        FORCE_MULTIPLIER: 0.0007,  // Force applied when thrusting
        ANGULAR_VELOCITY_MULT: 0.2, 
        SLOW_MULTIPLIER: 0.3, // Fraction of normal speed when Control is pressed
        FAST_MULTIPLIER: 2 // Fraction of normal speed when Shift is pressed
    },
    
    VISUAL: {
        BODY_COLOR: 0x4AA8E2,
        ENGINE_GLOW_COLOR: 0xF76565, 
        ENGINE_GLOW_SIZE: 3 
    },
    
    SPAWN: {
        X: 0,
        Y: 0,
        ROTATION: -Math.PI / 2
    }
};

export default shipConfig;