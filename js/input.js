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
        this.app.view.addEventListener('mousedown', () => {
            this.isThrusting = true;
            SpaceGame.Entities.setEngineGlow(true);
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