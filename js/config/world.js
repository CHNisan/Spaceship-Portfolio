const worldConfig = {
    // Size of the game world (width and height)
    SIZE: 5000,
    
    // Background settings
    BACKGROUND: {
        COLOR: '#000033',  // Deep blue space background
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