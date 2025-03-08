const poiConfig = {
    // Animation parameters
    ANIMATION: {
        SCALE_SPEED: 0.04,  // How fast the scaling animation happens
        MAX_SCALE: 1.2,     // Maximum scale when hovered
        MIN_SCALE: 1.0      // Minimum scale (normal size)
    },
    
    // Font settings
    FONT: {
        FAMILY: 'Arial',
        SIZE: 14,
        COLOR: 0xFFFFFF,
        ALIGN: 'center',
        RESOLUTION: 2  // For sharp text
    },
    
    // POI data definitions
    ITEMS: [
        { 
            x: 1000, 
            y: 1000, 
            width: 100, 
            height: 100, 
            color: 0x00FFFF,
            title: "Research Station Alpha",
            description: "A cutting-edge research facility studying the unusual stellar phenomena in this sector. Scientists here have made significant discoveries about dark matter.",
            imageKey: "station-alpha",
            webAddress: "https://www.nasa.gov/missions/"
        },
        { 
            x: -1200, 
            y: 800, 
            width: 150, 
            height: 80, 
            color: 0xFFAA00,
            title: "Mining Outpost Beta",
            description: "An asteroid mining facility that extracts rare minerals from the surrounding asteroid field. The outpost supplies resources to nearby colonies.",
            imageKey: "mining-outpost",
            webAddress: "https://www.space.com/topics/asteroids"
        },
        { 
            x: 500, 
            y: -1500, 
            width: 120, 
            height: 120, 
            color: 0x00FF00,
            title: "Communications Relay",
            description: "This relay station maintains the subspace communication network in this quadrant. All transmissions between systems pass through here.",
            imageKey: "comm-relay",
            webAddress: "https://www.esa.int/Enabling_Support/Operations/Estrack_tracking_stations"
        },
        { 
            x: -800, 
            y: -900, 
            width: 80, 
            height: 160, 
            color: 0xFF00FF,
            title: "Trading Hub Gamma",
            description: "A bustling marketplace where traders from all over the sector come to exchange goods. Known for its exotic wares and reasonable prices.",
            imageKey: "trading-hub",
            webAddress: "https://www.spacetraders.io/"
        }
    ]
};

export default poiConfig;