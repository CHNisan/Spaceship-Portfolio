const entitiesConfig = {
    // Asteroid settings
    ASTEROIDS: {
        COUNT: 30,  // Number of asteroids to spawn
        MIN_SIZE: 20,  // Minimum asteroid size
        MAX_SIZE: 70,  // Maximum asteroid size
        MIN_SEGMENTS: 5,  // Minimum number of segments (polygon sides)
        MAX_SEGMENTS: 10,  // Maximum number of segments
        COLOR: 0x888888,  // Base asteroid color
        SAFE_RADIUS: 300,  // Minimum distance from center/ship spawn
        PHYSICS: {
            RESTITUTION: 0.6,  // Bounciness
            FRICTION: 0.01,
            DENSITY: 0.001
        }
    },
    
    // POI buffer distances to keep asteroids away
    POI_BUFFER: {
        X_MULTIPLIER: 0.5,  // 50% buffer on x-axis
        Y_MULTIPLIER: 0.5   // 50% buffer on y-axis
    }
};

export default entitiesConfig;