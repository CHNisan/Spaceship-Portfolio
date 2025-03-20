import themeConfig from './theme.js'

const worldConfig = {
    // Size of the game world (width and height)
    SIZE: 5000,
    
    // Background settings
    BACKGROUND: {
        // Light mode colors
        TOP_COLOR: themeConfig.MAIN.LIGHT.PRIMARY,    // Light color at the top
        BOTTOM_COLOR: themeConfig.MAIN.LIGHT.SECONDARY, // Bluish color at the bottom
        
        // Dark mode colors
        DARK_TOP_COLOR: themeConfig.MAIN.DARK.PRIMARY,    // Dark gray at the top
        DARK_BOTTOM_COLOR: themeConfig.MAIN.DARK.SECONDARY, // Almost black at the bottom
        
        ANGLE: 15,              // Angle in degrees for the gradient tilt
    },
    
    // Boundary visual settings
    BOUNDARY: {
        LINE_WIDTH: 2,
        COLOR: 0xFF0000  // Red boundary line
    },

    // Guide path settings
    GUIDE: {
        POSITION: {
            X: -1400,
            Y: 580
        },
        DIMENSIONS: {
            PATH_WIDTH: 1000,
            PATH_HEIGHT: 10,
            LANE_WIDTH: 400,
        },
        WALL_COLORS: {
            TOP: themeConfig.COLORS.YELLOW,
            BOTTOM: themeConfig.COLORS.BLUE,
            LEFT: themeConfig.COLORS.PINK,
            RIGHT: themeConfig.COLORS.GREEN
        }
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