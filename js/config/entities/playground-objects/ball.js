import themeConfig from '../../core/theme.js'

const ballConfig = {
    // Ball type
    DEFAULT: {
        RADIUS: 50,
        COLOR: themeConfig.COLORS.GREEN,
        PHYSICS: {
            RESTITUTION: 0.7,
            FRICTION: 0.001,
            DENSITY: 0.000005
        }
    },
    BOWLING: {
        RADIUS: 40,
        COLOR: themeConfig.COLORS.RED,
        PHYSICS: {
            RESTITUTION: 0.7,
            FRICTION: 0.000001,
            DENSITY: 0.000005
        }
    },
    PIN: {
        RADIUS: 15,
        COLOR: themeConfig.COLORS.RED,
        PHYSICS: {
            RESTITUTION: 0.9,
            FRICTION: 0.0001,
            DENSITY: 0.00001
        }
    },
    OBSTACLE: {
        RADIUS: 30,
        COLOR: themeConfig.COLORS.YELLOW,
        PHYSICS: {
            RESTITUTION: 0.1,
            FRICTION: 0.001,
            DENSITY: 0.0001
        }
    }
};

export default ballConfig;