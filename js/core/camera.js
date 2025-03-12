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
        
        // Freecam properties
        this.freecamMode = false;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.lastPosition = { x: 0, y: 0 };
        this.shipPosition = { x: 0, y: 0 };
    }
    
    init(container, app) {
        this.container = container;
        this.app = app;
        this.setupZoomControls();
        this.setupDragControls();
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
        // Store the ship's position for returning from freecam
        this.shipPosition.x = target.position.x;
        this.shipPosition.y = target.position.y;
        
        // If in freecam mode, don't update the target
        if (this.freecamMode) {
            return;
        }
        
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
    
    setupDragControls() {
        // Add mouse drag controls for freecam mode
        this.app.view.addEventListener('mousedown', (event) => {
            if (!this.freecamMode) return;
            
            this.isDragging = true;
            const bounds = this.app.view.getBoundingClientRect();
            this.dragStart.x = event.clientX - bounds.left;
            this.dragStart.y = event.clientY - bounds.top;
            this.lastPosition.x = this.container.pivot.x;
            this.lastPosition.y = this.container.pivot.y;
            
            // Change cursor to grabbing
            this.app.view.style.cursor = 'grabbing';
        });
        
        this.app.view.addEventListener('mousemove', (event) => {
            if (!this.freecamMode || !this.isDragging) return;
            
            const bounds = this.app.view.getBoundingClientRect();
            const currentX = event.clientX - bounds.left;
            const currentY = event.clientY - bounds.top;
            
            // Calculate drag distance
            const deltaX = (currentX - this.dragStart.x) / this.currentZoom;
            const deltaY = (currentY - this.dragStart.y) / this.currentZoom;
            
            // Set target directly for immediate response
            this.target.x = this.lastPosition.x - deltaX;
            this.target.y = this.lastPosition.y - deltaY;
        });
        
        // Add mouseup event to window (to catch releases outside the canvas)
        window.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                // Reset cursor
                this.app.view.style.cursor = this.freecamMode ? 'grab' : 'auto';
            }
        });
    }
    
    toggleFreecamMode() {
        this.freecamMode = !this.freecamMode;
        
        if (this.freecamMode) {
            // Enter freecam mode
            this.app.view.style.cursor = 'grab';
        } else {
            // Exit freecam mode, return to ship
            this.app.view.style.cursor = 'auto';
            this.target.x = this.shipPosition.x;
            this.target.y = this.shipPosition.y;
        }
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