const uiConfig = {
    // Intro screen settings
    INTRO: {
        TITLE: {
            TEXT: 'Christopher Nisan',
            FONT_FAMILY: 'Arial',
            FONT_SIZE: 70,
            COLOR: 0x888888,
            POSITION: {
                X_PERCENT: 0.5,    // Center horizontally (50% of screen width)
                Y_PERCENT: 0.35    // Position at 33% from top
            }
        },
        SUBTITLE: {
            TEXT: 'Portfolio',
            FONT_FAMILY: 'Arial',
            FONT_SIZE: 50,
            COLOR: 0x888888,
            POSITION: {
                X_PERCENT: 0.5,    // Center horizontally
                Y_OFFSET: 90       // 60px below the title
            }
        },
        BUTTON: {
            TEXT: 'START',
            FONT_FAMILY: 'Arial',
            FONT_SIZE: 90,
            COLOR: 0x888888,
            POSITION: {
                X_PERCENT: 0.5,    // Center horizontally
                Y_PERCENT: 0.65    // Position at 75% from top
            },
            BORDER: {
                COLOR: 0x888888,
                WIDTH: 8,
                RADIUS: 0,
                BOX_WIDTH: 360,
                BOX_HEIGHT: 125
            },
            ANIMATION: {
                SCALE: 1.01,
                FADE_SPEED: 0.1
            }
        },
        ANIMATION: {
            FADE_OUT_SPEED: 0.05   // Speed of the intro screen fade-out
        }
    }
};

export default uiConfig;