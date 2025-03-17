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
            x: 100, 
            y: -1100, 
            width: 480, 
            height: 270, 
            color: 0x00FFFF,
            title: "This Website",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula ullamcorper orci quis tempor. Fusce sagittis dui sed aliquam dapibus.",
            webAddress: "https://github.com/CHNisan/Spaceship-Portfolio.git",
            image: "",
            video: ""
        },
        { 
            x: 700, 
            y: -1100, 
            width: 480, 
            height: 270, 
            color: 0xFFAA00,
            title: "GMTK Game Jam",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula ullamcorper orci quis tempor. Fusce sagittis dui sed aliquam dapibus.",
            webAddress: "https://spslink.itch.io/",
            image: "GMTKGameJamScreenShot",
            video: "TestGif"
        },
        { 
            x: 1300, 
            y: -1100, 
            width: 480, 
            height: 270, 
            color: 0x00FF00,
            title: "COVID-19 Simulation",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula ullamcorper orci quis tempor. Fusce sagittis dui sed aliquam dapibus.",
            webAddress: "https://www.linkedin.com/posts/chrisnisan_a-paper-i-did-on-simulating-covid-19-in-a-activity-7201553501112406017-bLVm?utm_source=share&utm_medium=member_desktop&rcm=ACoAAE7N2JcB6SCyqA9-yM4d_7QIhpQZGKw34uc",
            image: "COVIDSimScreenShot",
            video: "TestGif"
        }
    ]
};

export default poiConfig;