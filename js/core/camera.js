// js/core/camera.js
import config from '../config/index.js';

const { camera: cameraConfig, world: worldConfig } = config;

export default class Camera {
    constructor() {
        this.container = null;
        this.app = null;
        this.target = { x: 0, y: 0 }; // Target position of camera's focus
        this.focusObject = null;
        this.damping = cameraConfig.FOLLOW.DAMPING;
        
        // Zoom properties
        this.currentZoom = cameraConfig.ZOOM.DEFAULT;
        this.targetZoom = cameraConfig.ZOOM.DEFAULT;
        this.zoomDamping = cameraConfig.ZOOM.DAMPING;
        
        // Auto-zoom properties (based on player position)
        this.autoZoomEnabled = true;       // Flag to enable/disable position-based auto zoom
        this.positionBasedZoom = cameraConfig.ZOOM.DEFAULT;  // Calculated zoom based on player position
        
        // Freecam properties
        this.freecamMode = false;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.lastPosition = { x: 0, y: 0 };
        this.shipPosition = { x: 0, y: 0 };
        
        // Track if manual zoom was used (to temporarily disable auto-zoom)
        this.manualZoomUsed = false;
    }
    
    //#region Setup
    init(container, app) {
        this.container = container;
        this.app = app;
        this.setupZoomControls();
        this.setupDragControls();
    }

    setupZoomControls() {
        this.app.view.addEventListener('wheel', (event) => {
            event.preventDefault();
            
            // Mark that manual zoom was used
            this.manualZoomUsed = true;
            
            const zoomDirection = event.deltaY < 0 ? 1 : -1;
            
            const zoomStep = cameraConfig.ZOOM.STEP;
            this.targetZoom += zoomDirection * zoomStep;
            
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
    //#endregion

    //#region Camera focus
    setFocus(object) {
        this.focusObject = object;
    }
    
    resetFocus() {
        // Reset camera to follow the ship
        this.focusObject = null;
    }
    
    follow(target) {
        // Store the ship's position for returning from freecam and for auto-zoom
        this.shipPosition.x = target.position.x;
        this.shipPosition.y = target.position.y;
        
        // Update position-based zoom if auto-zoom is enabled
        if (this.autoZoomEnabled && !this.manualZoomUsed) {
            this.updatePositionBasedZoom();
            
            // Set the target zoom to position-based zoom
            this.targetZoom = this.positionBasedZoom;
            
            // Clamp zoom to min/max
            this.targetZoom = Math.max(cameraConfig.ZOOM.MIN, 
                             Math.min(cameraConfig.ZOOM.MAX, this.targetZoom));
        }
        
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
    //#endregion

    //#region Auto-zoom based on position
    updatePositionBasedZoom() {
        const zoomArea = worldConfig.ZOOM_AREA;
        const shipX = this.shipPosition.x;
        const shipY = this.shipPosition.y;
        
        // Check if ship is completely inside the zoom area
        if (shipX >= zoomArea.MIN_X && shipX <= zoomArea.MAX_X && 
            shipY >= zoomArea.MIN_Y && shipY <= zoomArea.MAX_Y) {
            this.positionBasedZoom = zoomArea.INNER_ZOOM;
            return;
        }
        
        // Calculate distance to the nearest edge of the zoom area
        let distX = 0;
        let distY = 0;
        
        if (shipX < zoomArea.MIN_X) {
            distX = zoomArea.MIN_X - shipX;
        } else if (shipX > zoomArea.MAX_X) {
            distX = shipX - zoomArea.MAX_X;
        }
        
        if (shipY < zoomArea.MIN_Y) {
            distY = zoomArea.MIN_Y - shipY;
        } else if (shipY > zoomArea.MAX_Y) {
            distY = shipY - zoomArea.MAX_Y;
        }
        
        // Use the larger of the two distances for a smooth transition
        const distance = Math.max(distX, distY);
        
        // Calculate transition factor (0 = inner zoom, 1 = outer zoom)
        const transitionFactor = Math.min(distance / zoomArea.TRANSITION_DISTANCE, 1);
        
        // Interpolate between inner and outer zoom based on distance
        this.positionBasedZoom = zoomArea.INNER_ZOOM - 
            (zoomArea.INNER_ZOOM - zoomArea.OUTER_ZOOM) * transitionFactor;
    }
    
    // Toggle auto-zoom functionality
    toggleAutoZoom() {
        this.autoZoomEnabled = !this.autoZoomEnabled;
        this.manualZoomUsed = false;
        
        // If turning back on, immediately update zoom
        if (this.autoZoomEnabled) {
            this.updatePositionBasedZoom();
            this.targetZoom = this.positionBasedZoom;
        }
    }
    
    // Reset manual zoom flag to allow auto-zoom to resume
    resetManualZoom() {
        this.manualZoomUsed = false;
    }
    //#endregion

    //#region Freecam
    toggleFreecamMode() {
        this.freecamMode = !this.freecamMode;
        
        if (this.freecamMode) {
            this.app.view.style.cursor = 'grab';
        } else {
            this.app.view.style.cursor = 'auto';
            this.target.x = this.shipPosition.x;
            this.target.y = this.shipPosition.y;
        }
    }
    //#endregion

    //#region Zoom
    setZoom(value) {
        // Clamp zoom value to be between the max and min
        this.targetZoom = Math.max(cameraConfig.ZOOM.MIN, 
                          Math.min(cameraConfig.ZOOM.MAX, value));
    }

    resetZoom() {
        // Reset to default or position-based zoom if auto-zoom is enabled
        if (this.autoZoomEnabled) {
            this.updatePositionBasedZoom();
            this.targetZoom = this.positionBasedZoom;
        } else {
            this.targetZoom = cameraConfig.ZOOM.DEFAULT;
        }
        
        this.manualZoomUsed = false;
    }
    //#endregion

    //#region Helper functions
    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }
    //#endregion

    update(deltaTime) {
        // Apply smooth camera movement
        // The camera is moved by setting the screen container pivot to a position in world space
        // and shift everything (contained within a single container) to center that pivot on the screen
        this.container.pivot.x = this.lerp(this.container.pivot.x, this.target.x, this.damping);
        this.container.pivot.y = this.lerp(this.container.pivot.y, this.target.y, this.damping);
        
        // Smooth zoom transition
        this.currentZoom = this.lerp(this.currentZoom, this.targetZoom, this.zoomDamping);
        this.container.scale.set(this.currentZoom);
        
        // Center the container in the screen
        this.container.position.x = this.app.screen.width / 2;
        this.container.position.y = this.app.screen.height / 2;
    }
}