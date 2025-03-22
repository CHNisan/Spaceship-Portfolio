import themeConfig from './theme.js'

const worldConfig = {
    // Size of the game world (width and height)
    SIZE: 5000,
    
    // Background gradient colors and angle
    BACKGROUND: {
        // Light mode colors
        TOP_COLOR: themeConfig.MAIN.LIGHT.PRIMARY,
        BOTTOM_COLOR: themeConfig.MAIN.LIGHT.SECONDARY,
        
        // Dark mode colors
        DARK_TOP_COLOR: themeConfig.MAIN.DARK.PRIMARY,
        DARK_BOTTOM_COLOR: themeConfig.MAIN.DARK.SECONDARY,
        
        ANGLE: 15
    },
    
    BOUNDARY: {
        LINE_WIDTH: 2,
        COLOR: 0xFF0000
    },

    GUIDE: {
        POSITION: {
            // Top left position of the bottom paths
            X: 500,
            Y: 990
        },
        DIMENSIONS: {
            PATH_WIDTH: 10,
            PATH_HEIGHT: 1000,
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

// Calculate min/max x/y values of the world based off world size value
worldConfig.BOUNDS = {
    MIN_X: -worldConfig.SIZE / 2,
    MAX_X: worldConfig.SIZE / 2,
    MIN_Y: -worldConfig.SIZE / 2,
    MAX_Y: worldConfig.SIZE / 2
};

export default worldConfig;