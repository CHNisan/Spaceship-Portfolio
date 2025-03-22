const cameraConfig = {
    FOLLOW: {
        DAMPING: 0.1 
    },
    
    ZOOM: {
        DEFAULT: 1.0,   
        MIN: 0.3,       // Zoomed out
        MAX: 2.0,       // Zoomed in
        STEP: 0.1,      // Zoom amount per scroll
        DAMPING: 0.1    // Smooth zoom transition speed
    }
};

export default cameraConfig;