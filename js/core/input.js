import config from '../config/index.js';

const { ship: shipConfig } = config;

export default class InputManager {
    constructor() {
        this.app = null;
        this.gameContainer = null;
        this.ship = null;
        this.mousePosition = { x: 0, y: 0 };
        this.isThrusting = false;
        this.targetRotation = 0;
        
        // References to other systems
        this.camera = null;
        this.physics = null;
        this.entities = null;
        
        // Get thrust parameters from config
        this.forceMult = shipConfig.THRUST.FORCE_MULTIPLIER;
        this.angularVelocityMult = shipConfig.THRUST.ANGULAR_VELOCITY_MULT;
        this.slowModeMultiplier = shipConfig.THRUST.SLOW_MULTIPLIER;
        this.fastModeMultiplier = shipConfig.THRUST.FAST_MULTIPLIER;
        
        // Add speed modification flags and multipliers
        this.isSlowMode = false;
        this.isFastMode = false;
    }
    
    init(app, gameContainer, ship, camera, physics) {
        this.app = app;
        this.gameContainer = gameContainer;
        this.ship = ship;
        this.camera = camera;
        this.physics = physics;
        
        this.setupEventListeners();
        this.setupKeyboardControls();
    }
    
    setupEventListeners() {
        // Mouse move handler (use DOM event for mouse position tracking)
        this.app.view.addEventListener('mousemove', (event) => {
            this.handleMouseMove(event);
        });
        
        // Use PIXI events for thruster control
        // Listen for mousedown/up on the stage for thrust control
        this.app.stage.eventMode = 'static';
        
        this.app.stage.on('pointerdown', () => {
            // Only apply thrust if we're following the ship (not a POI) and not in freecam mode
            if (!this.camera.focusObject && !this.camera.freecamMode) {
                this.setThrust(true);
            }
        });
        
        this.app.stage.on('pointerup', () => {
            this.setThrust(false);
        });
        
        // Handle pointer leaving the canvas
        this.app.view.addEventListener('mouseleave', () => {
            this.setThrust(false);
        });
    }
    
    setupKeyboardControls() {
        // Add keyboard event listener for spacebar
        window.addEventListener('keydown', (event) => {
            // Toggle freecam mode with spacebar
            if (event.code === 'Space' || event.key === ' ') {
                if (this.camera) {
                    this.camera.toggleFreecamMode();
                    
                    // Reset any thrust and glow effect
                    this.setThrust(false);
                }
                // Prevent default spacebar behavior (like scrolling)
                event.preventDefault();
            }
            
            // Enable slow mode with Control key
            if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
                this.isSlowMode = true;
            }
            
            // Enable fast mode with Shift key
            if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
                this.isFastMode = true;
            }
        });

        // Add listener for releasing Control and Shift keys
        window.addEventListener('keyup', (event) => {
            if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
                this.isSlowMode = false;
            }
            if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
                this.isFastMode = false;
            }
        });

        window.addEventListener('keydown', (event) => {
            // Toggle dark mode when 'd' key is pressed
            if (event.key === 'd' || event.key === 'D') {
                // Dispatch a custom event 
                const darkModeEvent = new CustomEvent('game:darkModeToggle');
                document.dispatchEvent(darkModeEvent);
            }

            // FOR CHECKING POSITIONING
            if (event.key === 't' || event.key === 'T') {
                console.log(this.ship.physicsBody.position.x, this.ship.physicsBody.position.y);
            }
            // DELTE LATER
        });
    }
    
    handleMouseMove(event) {
        // Convert screen coordinates to world coordinates
        const bounds = this.app.view.getBoundingClientRect();
        const screenX = event.clientX - bounds.left;
        const screenY = event.clientY - bounds.top;
        
        // Adjust for camera position and zoom level
        const cameraZoom = this.camera.currentZoom;
        this.mousePosition.x = (screenX / cameraZoom) + this.gameContainer.pivot.x - (this.app.screen.width / cameraZoom / 2);
        this.mousePosition.y = (screenY / cameraZoom) + this.gameContainer.pivot.y - (this.app.screen.height / cameraZoom / 2);
        
        // Calculate angle between ship and mouse
        if (this.ship && this.ship.physicsBody) {
            const dx = this.mousePosition.x - this.ship.physicsBody.position.x;
            const dy = this.mousePosition.y - this.ship.physicsBody.position.y;
            this.targetRotation = Math.atan2(dy, dx);
        }
    }
    
    applyShipControls() {
        if (!this.ship || !this.ship.physicsBody) return;
        
        // Don't apply ship controls when in freecam mode
        if (this.camera.freecamMode) return;
        
        const shipBody = this.ship.physicsBody;
        
        // Rotate ship towards mouse
        const currentRotation = shipBody.angle;
        const rotationDiff = this.targetRotation - currentRotation;
        
        // Normalize angle difference
        let normalizedDiff = rotationDiff;
        while (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2;
        while (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2;
        
        // Apply torque to rotate ship
        this.physics.Body.setAngularVelocity(shipBody, normalizedDiff * this.angularVelocityMult);
        
        // Apply thrust if mouse is down
        if (this.isThrusting) {
            // Calculate effective force multiplier based on key combinations
            let effectiveForceMult = this.forceMult;
            
            // If both slow and fast modes are active, they cancel out to normal speed
            if (this.isSlowMode && this.isFastMode) {
                effectiveForceMult = this.forceMult;
            }
            // Otherwise apply just the active modifier
            else if (this.isSlowMode) {
                effectiveForceMult = this.forceMult * this.slowModeMultiplier;
            }
            else if (this.isFastMode) {
                effectiveForceMult = this.forceMult * this.fastModeMultiplier;
            }
            
            const force = this.physics.Vector.create(
                Math.cos(shipBody.angle) * effectiveForceMult,
                Math.sin(shipBody.angle) * effectiveForceMult
            );
            this.physics.Body.applyForce(shipBody, shipBody.position, force);
        }
    }

    setThrust(isActive) {
        this.isThrusting = isActive;
        if (this.ship && this.ship.setEngineGlow) {
            this.ship.setEngineGlow(isActive);
        }
    }
    
    // Setter method to connect to the entities module after initialization
    setEntities(entities) {
        this.entities = entities;
        // Now we can access the ship via entities
        this.ship = this.entities.ship;
    }
}