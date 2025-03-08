const physicsConfig = {
    // Engine settings
    ENGINE: {
        GRAVITY: { x: 0, y: 0 },  // Zero gravity in space
        TIMING: {
            TIMESTEP: 1000 / 60,  // Target 60 FPS
            VELOCITY_ITERATIONS: 8,
            POSITION_ITERATIONS: 3
        }
    },
    
    // World boundaries (walls)
    WALLS: {
        THICKNESS: 50,  // Thickness of boundary walls
        IS_STATIC: true,
        RESTITUTION: 0.2  // Slight bounce when hitting walls
    }
};

export default physicsConfig;