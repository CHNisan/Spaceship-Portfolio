// Input handling system
SpaceGame.Input = {
    app: null,
    gameContainer: null,
    ship: null,
    mousePosition: { x: 0, y: 0 },
    isThrusting: false,
    targetRotation: 0,
    
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
        SpaceGame.Physics.Body.setAngularVelocity(shipBody, normalizedDiff * 0.1);
        
        // Apply thrust if mouse is down
        if (this.isThrusting) {
            const force = SpaceGame.Physics.Vector.create(
                Math.cos(shipBody.angle) * 0.0005,
                Math.sin(shipBody.angle) * 0.0005
            );
            SpaceGame.Physics.Body.applyForce(shipBody, shipBody.position, force);
        }
    }
};