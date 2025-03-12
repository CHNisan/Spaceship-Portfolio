const worldConfig = {
    // Size of the game world (width and height)
    SIZE: 5000,
    
    // Background settings
    BACKGROUND: {
        // Light mode colors
        TOP_COLOR: 0xF4F3EE,    // Light color at the top
        BOTTOM_COLOR: 0xE4E5DA, // Bluish color at the bottom
        
        // Dark mode colors
        DARK_TOP_COLOR: 0x323330,    // Dark gray at the top
        DARK_BOTTOM_COLOR: 0x191919, // Almost black at the bottom
        
        ANGLE: 15,              // Angle in degrees for the gradient tilt
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