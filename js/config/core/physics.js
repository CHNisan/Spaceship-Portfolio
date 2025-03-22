const physicsConfig = {
    ENGINE: {
        GRAVITY: { x: 0, y: 0 },
        TIMING: {
            TIMESTEP: 1000 / 60,  // Target 60 FPS
            VELOCITY_ITERATIONS: 8,
            POSITION_ITERATIONS: 3
        }
    },
    
    // World boundaries
    WALLS: {
        THICKNESS: 50,
        IS_STATIC: true,
        RESTITUTION: 0.2
    }
};

export default physicsConfig;