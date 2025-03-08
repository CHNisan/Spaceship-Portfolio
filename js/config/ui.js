const uiConfig = {
    // Popup settings
    POPUP: {
        ANIMATION_SPEED: 0.1,  // Speed of fade in/out (0-1)
        WIDTH: 240,
        HEIGHT: 200,
        CORNER_RADIUS: 10,
        BACKGROUND: {
            COLOR: 0x000000,
            ALPHA: 0.8
        },
        BORDER: {
            WIDTH: 2,
            COLOR: 0xFFFFFF
        },
        POSITION: {
            OFFSET_X: 20,  // Offset from POI
            OFFSET_Y: 0
        }
    },
    
    // Text settings
    TEXT: {
        TITLE: {
            FONT_FAMILY: 'Arial',
            FONT_SIZE: 16,
            FONT_WEIGHT: 'bold',
            COLOR: 0xFFFFFF,
            POSITION: {
                X: 10,
                Y: 10
            }
        },
        DESCRIPTION: {
            FONT_FAMILY: 'Arial',
            FONT_SIZE: 12,
            COLOR: 0xFFFFFF,
            POSITION: {
                X: 10,
                Y: 35
            }
        },
        INSTRUCTIONS: {
            FONT_FAMILY: 'Arial',
            FONT_SIZE: 16,
            COLOR: 0xFFFFFF,
            POSITION: {
                X: 20,
                Y: 20
            }
        }
    },
    
    // Image settings
    IMAGE: {
        SCALE: 0.9,
        POSITION: {
            X: 10,
            Y: 110  // Position from bottom of popup
        }
    }
};

export default uiConfig;