import themeConfig from '../../core/theme.js'
import ballConfig from './ball.js'

const playgroundConfig = {
    BOWLING: {
        POSITION: {
            // Top center position of the lanes
            X: -1400,
            Y: 580
        },
        DIMENSIONS: {
            WALL_WIDTH: 1000,
            WALL_HEIGHT: 10,
            LANE_WIDTH: 400,
        },
        WALL_COLOR: themeConfig.COLORS.BLUE,
        PINS: {
            ROWS: 6,
            SPACING: 75, // Horizontal spacing between rows
            BALL_TYPE: ballConfig.PIN // The ball type to be used as the pins
        }
    },
    
    BALL_IN_HOLE: {
        POSITION: {
            // Top center position of the horizontal walls
            X: -1400,
            Y: 1400
        },
        DIMENSIONS: {
            WALL_WIDTH: 1750,
            WALL_HEIGHT: 10,
            LANE_WIDTH: 800,
        },
        WALL_COLOR: themeConfig.COLORS.PINK,
        OBSTACLE: {
            ROWS: 3, 
            SPACING: 400, // Horizontal spacing between rows
            BALL_TYPE: ballConfig.OBSTACLE // The ball type to be used as the pins
        }
    }
};

export default playgroundConfig;