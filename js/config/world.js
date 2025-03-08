const worldConfig = {
    // Size of the game world (width and height)
    SIZE: 5000,
    
    // Background settings
    BACKGROUND: {
        COLOR: '#000033',  // Deep blue space background
        STARS: {
            COUNT: 1000,    // Number of stars to generate
            MIN_SIZE: 1,    // Minimum star size
            MAX_SIZE: 3,    // Maximum star size
            MIN_OPACITY: 0.5,  // Minimum star opacity
            MAX_OPACITY: 1.0   // Maximum star opacity
        }
    },
    
    // Boundary visual settings
    BOUNDARY: {
        LINE_WIDTH: 2,
        COLOR: 0xFF0000  // Red boundary line
    }
};

// Add computed properties
worldConfig.BOUNDS = {
    MIN_X: -worldConfig.SIZE / 2,
    MAX_X: worldConfig.SIZE / 2,
    MIN_Y: -worldConfig.SIZE / 2,
    MAX_Y: worldConfig.SIZE / 2
};

export default worldConfig;