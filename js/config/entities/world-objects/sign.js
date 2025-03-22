const signConfig = {
    FONT: {
        FAMILY: 'Arial',
        ALIGN: 'center',
        RESOLUTION: 2  // For sharp text
    },

    DATA: {
        // Order of paths: top, right, bottom, left
        PATHWAY: [
            { 
                x: 200, 
                y: -490, 
                size: 40, 
                wrapWidth: 70, 
                text: "PORTFOLIO",
            },

            { 
                x: 500, 
                y: -190, 
                size: 40, 
                wrapWidth: 70, 
                text: "DETAILS",
            },

            { 
                x: 200, 
                y: 860, 
                size: 50, 
                wrapWidth: 70, 
                text: "THIS WAY",
            },

            { 
                x: -150, 
                y: -190, 
                size: 40, 
                wrapWidth: 70, 
                text: "PLAYGROUND",
            },
        ],

        DETAILS: {
            x: 1700, 
            y: -140, 
            size: 40, 
            wrapWidth: 450, 
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula ullamcorper orci quis tempor. Fusce sagittis dui sed aliquam dapibus. Nullam consectetur neque lacus, sed ornare ex dictum et. Proin non libero tempus, ultrices risus elementum, fringilla nisl. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean porttitor dapibus dapibus. Sed in vehicula erat. Donec lobortis scelerisque libero, ac molestie felis laoreet quis. Sed sagittis ullamcorper odio nec laoreet. Nunc fringilla nulla vitae urna ullamcorper, sit amet facilisis sapien rutrum. Fusce ac pretium sapien. In nec nibh quis ligula imperdiet congue. Ut malesuada id mi eget dignissim. Etiam aliquet ipsum in risus pulvinar, eu commodo tortor maximus.",
        }
    }
};

export default signConfig;