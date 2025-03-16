const signConfig = {
    // Font settings
    FONT: {
        FAMILY: 'Arial',
        ALIGN: 'center',
        RESOLUTION: 2  // For sharp text
    },

    DATA: {
        PATHWAY: [
            { 
                x: 700, 
                y: 500, 
                size: 40, 
                wrapWidth: 70, 
                text: "PORTFOLIO",
            },

            { 
                x: 1000, 
                y: 800, 
                size: 40, 
                wrapWidth: 70, 
                text: "DETAILS",
            },

            { 
                x: 700, 
                y: 1850, 
                size: 50, 
                wrapWidth: 70, 
                text: "THIS WAY",
            },

            { 
                x: 350, 
                y: 800, 
                size: 40, 
                wrapWidth: 70, 
                text: "PLAYGROUND",
            },
        ],

        PLAYGROUND: {},

        DETAILS: {
            x: 1, 
            y: 1000, 
            size: 100, 
            wrapWidth: 100, 
            text: "",
        }
    }
};

export default signConfig;