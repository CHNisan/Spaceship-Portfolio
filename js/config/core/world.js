// js/config/core/world.js
import themeConfig from './theme.js'

const worldConfig = {
    // Size of the game world (separate width and height)
    WIDTH: 12000,
    HEIGHT: 8000,
    
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
            X: 0,
            Y: 500
        },
        DIMENSIONS: {
            PATH_WIDTH: 10,
            PATH_HEIGHT: 1000,
            LANE_WIDTH: 600,
        },
        WALL_COLORS: {
            TOP: themeConfig.COLORS.YELLOW,
            BOTTOM: themeConfig.COLORS.BLUE,
            LEFT: themeConfig.COLORS.PINK,
            RIGHT: themeConfig.COLORS.GREEN
        }
    }
};

// Calculate min/max x/y values of the world based on separate width and height
worldConfig.BOUNDS = {
    MIN_X: -worldConfig.WIDTH / 2,
    MAX_X: worldConfig.WIDTH / 2,
    MIN_Y: -worldConfig.HEIGHT / 2,
    MAX_Y: worldConfig.HEIGHT / 2
};

export default worldConfig;