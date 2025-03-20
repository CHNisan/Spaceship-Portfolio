import themeConfig from './theme.js'
import ballConfig from './ball.js'

const playgroundConfig = {
    BOWLING: {
        POSITION: {
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
            SPACING: 75,
            BALL_TYPE: ballConfig.PIN
        }
    },
    
    BALL_IN_HOLE: {
        POSITION: {
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
            SPACING: 400,
            BALL_TYPE: ballConfig.OBSTACLE
        }
    }
};

export default playgroundConfig;