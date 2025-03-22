const uiConfig = {
    INTRO: {
        TITLE: {
            TEXT: 'Christopher Nisan',
            FONT_FAMILY: 'Arial',
            FONT_SIZE: 70,
            COLOR: 0x888888,
            POSITION: {
                X_PERCENT: 0.5, 
                Y_PERCENT: 0.35 
            }
        },

        SUBTITLE: {
            TEXT: 'Portfolio',
            FONT_FAMILY: 'Arial',
            FONT_SIZE: 50,
            COLOR: 0x888888,
            POSITION: {
                X_PERCENT: 0.5, 
                Y_OFFSET: 90  
            }
        },
        
        BUTTON: {
            TEXT: 'START',
            FONT_FAMILY: 'Arial',
            FONT_SIZE: 90,
            COLOR: 0x888888,
            POSITION: {
                X_PERCENT: 0.5,  
                Y_PERCENT: 0.65  
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

        // Animation of whole intro screen
        ANIMATION: {
            FADE_OUT_SPEED: 0.05 
        }
    }
};

export default uiConfig;