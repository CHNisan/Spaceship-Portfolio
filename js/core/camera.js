import config from '../config/index.js';

const { camera: cameraConfig } = config;

export default class Camera {
    constructor() {
        this.container = null;
        this.app = null;
        this.target = { x: 0, y: 0 };
        this.focusObject = null;
        this.damping = cameraConfig.FOLLOW.DAMPING;
    }
    
    init(container, app) {
        this.container = container;
        this.app = app;
    }

    setFocus(object) {
        // Set the camera to focus on a specific object (POI)
        this.focusObject = object;
    }
    
    resetFocus() {
        // Reset camera to follow the ship
        this.focusObject = null;
    }
    
    follow(target) {
        // If we have a specific focus object, use that instead of the ship
        if (this.focusObject) {
            this.target.x = this.focusObject.position.x;
            this.target.y = this.focusObject.position.y;
        } else {
            // Otherwise follow the ship (default behavior)
            this.target.x = target.position.x;
            this.target.y = target.position.y;
        }
    }
    
    update(deltaTime) {
        // Apply smooth camera movement using linear interpolation
        this.container.pivot.x = this.lerp(this.container.pivot.x, this.target.x, this.damping);
        this.container.pivot.y = this.lerp(this.container.pivot.y, this.target.y, this.damping);
        
        // Center the container in the screen
        this.container.position.x = this.app.screen.width / 2;
        this.container.position.y = this.app.screen.height / 2;
    }
    
    // Helper function for smooth interpolation
    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }
}