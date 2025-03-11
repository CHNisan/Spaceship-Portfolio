const cameraConfig = {
    // Camera follow parameters
    FOLLOW: {
        // Damping factor (0-1) - lower values = smoother camera, higher = tighter following
        DAMPING: 0.1
    },
    
    // Zoom parameters
    ZOOM: {
        DEFAULT: 1.0,   // Starting zoom level
        MIN: 0.3,       // Minimum zoom level (zoomed out)
        MAX: 2.0,       // Maximum zoom level (zoomed in)
        STEP: 0.1,      // Zoom amount per scroll
        DAMPING: 0.1    // Smooth zoom transition speed
    }
};

export default cameraConfig;