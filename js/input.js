// Input handling system
SpaceGame.Input = {
    app: null,
    gameContainer: null,
    ship: null,
    mousePosition: { x: 0, y: 0 },
    isThrusting: false,
    targetRotation: 0,
    forceMult: 0.0007,
    angularVelocityMult: 0.2,
    
    init(app, gameContainer, ship) {
        this.app = app;
        this.gameContainer = gameContainer;
        this.ship = ship;
        
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        // Mouse move handler
        this.app.view.addEventListener('mousemove', (event) => {
            this.handleMouseMove(event);
        });
        
        // Mouse button handlers
        this.app.view.addEventListener('mousedown', (event) => {
            // Check if we clicked on a POI
            const clickedOnPOI = this.checkPoiClick(event);
            
            // If we didn't click on a POI, reset camera focus and apply thrust
            if (!clickedOnPOI) {
                // Reset focus back to ship
                SpaceGame.Camera.resetFocus();
                
                // Handle thrusting
                this.isThrusting = true;
                SpaceGame.Entities.setEngineGlow(true);
            }
        });
        
        this.app.view.addEventListener('mouseup', () => {
            this.isThrusting = false;
            SpaceGame.Entities.setEngineGlow(false);
        });
    },
    


    
    handleMouseMove(event) {
        // Convert screen coordinates to world coordinates
        const bounds = this.app.view.getBoundingClientRect();
        const screenX = event.clientX - bounds.left;
        const screenY = event.clientY - bounds.top;
        
        // Adjust for camera position
        this.mousePosition.x = screenX + this.gameContainer.pivot.x - this.app.screen.width / 2;
        this.mousePosition.y = screenY + this.gameContainer.pivot.y - this.app.screen.height / 2;
        
        // Calculate angle between ship and mouse
        const dx = this.mousePosition.x - this.ship.physicsBody.position.x;
        const dy = this.mousePosition.y - this.ship.physicsBody.position.y;
        this.targetRotation = Math.atan2(dy, dx);
        
        // Update PIXI interaction manager to handle POI hover states
        // This is needed because we're using a moving camera
        if (this.app.renderer.plugins.interaction) {
            const interaction = this.app.renderer.plugins.interaction;
            
            // Map screen position to world position
            interaction.mapPositionToPoint(
                interaction.mouse.global,
                event.clientX,
                event.clientY
            );
        }
    },

    


    // Add this new method for checking POI clicks
    checkPoiClick(event) {
        // Get mouse position in screen coordinates
        const bounds = this.app.view.getBoundingClientRect();
        const screenX = event.clientX - bounds.left;
        const screenY = event.clientY - bounds.top;
        
        // Convert to world coordinates
        const worldX = screenX + this.gameContainer.pivot.x - this.app.screen.width / 2;
        const worldY = screenY + this.gameContainer.pivot.y - this.app.screen.height / 2;
        
        // Check if click position is within any POI
        const pois = SpaceGame.Entities.pointsOfInterest.children;
        for (let i = 0; i < pois.length; i++) {
            const poi = pois[i];
            const poiWidth = poi.width / 2; // Half width for center-aligned rectangle
            const poiHeight = poi.height / 2; // Half height for center-aligned rectangle
            
            // Check if click is within POI bounds
            if (worldX >= poi.position.x - poiWidth && 
                worldX <= poi.position.x + poiWidth &&
                worldY >= poi.position.y - poiHeight &&
                worldY <= poi.position.y + poiHeight) {
                
                // Set camera focus to this POI
                SpaceGame.Camera.setFocus(poi);
                return true;
            }
        }
        
        return false;
    },

    handleBackgroundClick() {
        // Reset camera focus back to the ship when clicking on the background
        SpaceGame.Camera.resetFocus();
        console.log("background clicked");
    },
    



    applyShipControls() {
        const shipBody = this.ship.physicsBody;
        
        // Rotate ship towards mouse
        const currentRotation = shipBody.angle;
        const rotationDiff = this.targetRotation - currentRotation;
        
        // Normalize angle difference
        let normalizedDiff = rotationDiff;
        while (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2;
        while (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2;
        
        // Apply torque to rotate ship
        SpaceGame.Physics.Body.setAngularVelocity(shipBody, normalizedDiff * this.angularVelocityMult);
        
        // Apply thrust if mouse is down
        if (this.isThrusting) {
            const force = SpaceGame.Physics.Vector.create(
                Math.cos(shipBody.angle) * this.forceMult,
                Math.sin(shipBody.angle) * this.forceMult
            );
            SpaceGame.Physics.Body.applyForce(shipBody, shipBody.position, force);
        }
    }
};