const poiConfig = {
    // Animation parameters
    ANIMATION: {
        SCALE_SPEED: 0.04,  // How fast the scaling animation happens
        MAX_SCALE: 1.2,     // Maximum scale when hovered
        MIN_SCALE: 1.0      // Minimum scale (normal size)
    },
    
    // Font settings
    FONT: {
        TITLE: {
            FAMILY: 'Arial',
            WEIGHT: 'bold',
            ALIGN: 'Left',
            SIZE: 35,
            XOFFSET: 0,
            YOFFSET: 50,
        },
        DESCRIPTION: {
            FAMILY: 'Arial',
            WEIGHT: 'normal',
            ALIGN: 'left',
            SIZE: 25,
            XOFFSET: 10,
            YOFFSET: 100
        }
    },
    
    // POI data definitions
    ITEMS: [
        { 
            x: 1000, 
            y: 1000, 
            width: 480, 
            height: 270, 
            color: 0x00FFFF,
            title: "This Website",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula ullamcorper orci quis tempor. Fusce sagittis dui sed aliquam dapibus.",
            webAddress: "https://github.com/CHNisan/Spaceship-Portfolio.git",
            image: "",
            gif: ""
        },
        { 
            x: -1200, 
            y: 800, 
            width: 480, 
            height: 270, 
            color: 0xFFAA00,
            title: "Mining Outpost Beta",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula ullamcorper orci quis tempor. Fusce sagittis dui sed aliquam dapibus.",
            webAddress: "https://www.space.com/topics/asteroids"
        },
        { 
            x: 500, 
            y: -1500, 
            width: 480, 
            height: 270, 
            color: 0x00FF00,
            title: "Communications Relay",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula ullamcorper orci quis tempor. Fusce sagittis dui sed aliquam dapibus.",
            webAddress: "https://www.esa.int/Enabling_Support/Operations/Estrack_tracking_stations"
        },
        { 
            x: -800, 
            y: -900, 
            width: 480, 
            height: 270, 
            color: 0xFF00FF,
            title: "Trading Hub Gamma",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula ullamcorper orci quis tempor. Fusce sagittis dui sed aliquam dapibus.",
            webAddress: "https://www.spacetraders.io/"
        }
    ]
};

export default poiConfig;