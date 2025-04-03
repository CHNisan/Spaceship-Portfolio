import config from '../config/index.js';
import Camera from './camera.js';

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
        
        // Add speed modification flags
        this.isSlowMode = false;
        this.isFastMode = false;
    }
    
    //#region Setup
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
        this.app.view.addEventListener('mousemove', (event) => {
            this.handleMouseMove(event);
        });
        
        this.app.stage.eventMode = 'static'; // Is hit tested and emits events
        
        this.app.stage.on('pointerdown', () => {
            // Only apply thrust if we're following the ship (not a POI) and not in freecam mode
            if (!this.camera.focusObject && !this.camera.freecamMode) {
                this.setThrust(true);
            }
        });
        
        this.app.stage.on('pointerup', () => {
            this.setThrust(false);
        });
        
        this.app.view.addEventListener('mouseleave', () => {
            this.setThrust(false);
        });
    }
    
    setupKeyboardControls() {
        window.addEventListener('keydown', (event) => {
            if (!this.camera.manualCameraControlsActive) return // Check to see if the manul camera controls are enabled before entering freecam

            if (event.code === 'Space' || event.key === ' ') {
                if (this.camera) {
                    this.camera.toggleFreecamMode();
                    
                    this.setThrust(false);
                }

                event.preventDefault();
            }
            
            if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
                this.isSlowMode = true;
            }
            
            if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
                this.isFastMode = true;
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
                this.isSlowMode = false;
            }
            if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
                this.isFastMode = false;
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'd' || event.key === 'D') {
                const darkModeEvent = new CustomEvent('game:darkModeToggle');
                document.dispatchEvent(darkModeEvent);
            }
        });
    }

    // Setter method to connect to the entities module after initialization
    setEntities(entities) {
        this.entities = entities;
        this.ship = this.entities.ship;
    }
    //#endregion
    


    //#region Controls
    handleMouseMove(event) {
        // Account for position of the game in window when calculating screen cordinates
        const bounds = this.app.view.getBoundingClientRect();
        const screenX = event.clientX - bounds.left;
        const screenY = event.clientY - bounds.top;
        
        // Convert screen coordinates to world coordinates (position of the screen container pivot in world space)
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
        
        const currentRotation = shipBody.angle;
        const rotationDiff = this.targetRotation - currentRotation;
        
        let normalizedDiff = rotationDiff;
        while (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2; // Makes sure the angle is between 0 and 2pi so there is not extra loop
        while (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2;
        
        // Apply torque to rotate ship
        this.physics.Body.setAngularVelocity(shipBody, normalizedDiff * this.angularVelocityMult);
        
        if (this.isThrusting) {
            let effectiveForceMult = this.forceMult;
            
            if (this.isSlowMode && this.isFastMode) {
                effectiveForceMult = this.forceMult;
            }
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
    //#endregion



    setThrust(isActive) {
        this.isThrusting = isActive;
        if (this.ship && this.ship.setEngineGlow) {
            this.ship.setEngineGlow(isActive);
        }
    }
}