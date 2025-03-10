// Main game class
import config from './config/index.js';
import PhysicsEngine from './core/physics.js';  
import Entities from './entity-manager.js';
import Camera from './core/camera.js';          
import InputManager from './core/input.js';     

// Import the configs we need
const { world: worldConfig, ui: uiConfig } = config;

export default class Game {
    constructor() {
        this.app = null;
        this.gameContainer = null;
        this.isPaused = false;
        
        // Create instances of game systems
        this.physics = new PhysicsEngine();
        this.camera = new Camera();
        this.input = new InputManager();
    }
    
    init() {
        // Initialize PIXI Application with background color from config
        this.app = new PIXI.Application({
            background: worldConfig.BACKGROUND.COLOR,
            resizeTo: window,
        });
        
        document.body.appendChild(this.app.view);
        
        // Create game container for camera movement
        this.gameContainer = new PIXI.Container();
        this.app.stage.addChild(this.gameContainer);
        
        // Initialize all systems - pass required references
        this.physics.init();
        Entities.init(this.gameContainer, this.physics, this.camera);
        this.camera.init(this.gameContainer, this.app);
        this.input.init(this.app, this.gameContainer, Entities.ship, this.camera, this.physics);
        
        // Show instructions
        this.createInstructions();
        
        // Start the game loop
        this.setupGameLoop();
    }
    
    createInstructions() {
        // Create instructions text using config settings
        const instructions = new PIXI.Text(
            "Control the spaceship with your mouse\nClick and hold to thrust\nClick on colored areas to focus camera",
            {
                fontFamily: uiConfig.TEXT.INSTRUCTIONS.FONT_FAMILY,
                fontSize: uiConfig.TEXT.INSTRUCTIONS.FONT_SIZE,
                fill: uiConfig.TEXT.INSTRUCTIONS.COLOR,
                align: 'center'
            }
        );
        
        // Position using config values
        instructions.position.set(
            uiConfig.TEXT.INSTRUCTIONS.POSITION.X, 
            uiConfig.TEXT.INSTRUCTIONS.POSITION.Y
        );
        
        // Set resolution for sharp text
        instructions.resolution = 2;
        
        this.app.stage.addChild(instructions);
    }
    
    setupGameLoop() {
        this.app.ticker.add(() => {
            // Skip updates if game is paused
            if (this.isPaused) return;
            
            // Update physics
            this.physics.update(this.app.ticker.deltaMS);
            
            // Apply ship controls
            this.input.applyShipControls();
            
            // Update all entity positions
            Entities.update();
            
            // Update camera position
            this.camera.follow(Entities.ship);
            this.camera.update(this.app.ticker.deltaMS);
            
            // Keep ship in bounds
            this.physics.keepEntityInBounds(Entities.ship);
        });
    }
}