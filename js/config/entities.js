const entitiesConfig = {
    // Asteroid settings
    ASTEROIDS: {
        COUNT: 30,  // Number of asteroids to spawn
        MIN_SIZE: 20, 
        MAX_SIZE: 70,
        MIN_SEGMENTS: 5, //polygon sides
        MAX_SEGMENTS: 10, 
        COLOR: 0x888888, 
        PHYSICS: {
            RESTITUTION: 0.6,
            FRICTION: 0.01,
            DENSITY: 0.001
        },
        POSITION: {
            // Min and max posible x and y spawn positions
            MIN_X: -2400,
            MAX_X: -500,
            MIN_Y: -2400,
            MAX_Y: 300,
        }
    }
};

export default entitiesConfig;