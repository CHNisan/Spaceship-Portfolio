import config from '../config/index.js';

const { camera: cameraConfig } = config;

export default class Camera {
    constructor() {
        this.container = null;
        this.app = null;
        this.target = { x: 0, y: 0 };
        this.focusObject = null;
        this.damping = cameraConfig.FOLLOW.DAMPING;
        
        // Zoom properties
        this.currentZoom = cameraConfig.ZOOM.DEFAULT;
        this.targetZoom = cameraConfig.ZOOM.DEFAULT;
        this.zoomDamping = cameraConfig.ZOOM.DAMPING;
    }
    
    init(container, app) {
        this.container = container;
        this.app = app;
        this.setupZoomControls();
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
    
    setupZoomControls() {
        // Add mouse wheel event listener to the canvas
        this.app.view.addEventListener('wheel', (event) => {
            event.preventDefault();
            
            // Determine zoom direction
            const zoomDirection = event.deltaY < 0 ? 1 : -1;
            
            // Calculate new zoom level
            const zoomStep = cameraConfig.ZOOM.STEP;
            this.targetZoom += zoomDirection * zoomStep;
            
            // Clamp zoom level to min/max
            this.setZoom(this.targetZoom);
        });
    }
    
    update(deltaTime) {
        // Apply smooth camera movement using linear interpolation
        this.container.pivot.x = this.lerp(this.container.pivot.x, this.target.x, this.damping);
        this.container.pivot.y = this.lerp(this.container.pivot.y, this.target.y, this.damping);
        
        // Smooth zoom transition
        this.currentZoom = this.lerp(this.currentZoom, this.targetZoom, this.zoomDamping);
        this.container.scale.set(this.currentZoom);
        
        // Center the container in the screen
        this.container.position.x = this.app.screen.width / 2;
        this.container.position.y = this.app.screen.height / 2;
    }
    
    // Helper function for smooth interpolation
    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }
    
    // Reset zoom to default
    resetZoom() {
        this.targetZoom = cameraConfig.ZOOM.DEFAULT;
    }
    
    // Set zoom to a specific value
    setZoom(value) {
        this.targetZoom = Math.max(cameraConfig.ZOOM.MIN, 
                          Math.min(cameraConfig.ZOOM.MAX, value));
    }
}