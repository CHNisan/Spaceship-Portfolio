// Main game class
import config from './config/index.js';
import PhysicsEngine from './core/physics.js';  
import Entities from './managers/entity-manager.js';
import Camera from './core/camera.js';          
import InputManager from './core/input.js';
import BackgroundManager from './managers/background-manager.js';

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
        this.backgroundManager = null;
    }
    
    init() {
        // Initialize PIXI Application with transparent background
        this.app = new PIXI.Application({
            backgroundAlpha: 0, // Transparent background
            resizeTo: window,
        });
        
        document.body.appendChild(this.app.view);
        
        // Initialize background manager
        this.backgroundManager = new BackgroundManager(this.app);
        this.app.stage.addChildAt(this.backgroundManager.init(), 0);
        
        // Create game container for camera movement
        this.gameContainer = new PIXI.Container();
        this.app.stage.addChild(this.gameContainer);
        
        // Set up stage for interaction
        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen;
        
        // Initialize all systems - pass required references
        this.physics.init();
        Entities.init(this.gameContainer, this.physics, this.camera);
        this.camera.init(this.gameContainer, this.app);
        this.input.init(this.app, this.gameContainer, Entities.ship, this.camera, this.physics);
        
        // Start the game loop
        this.setupGameLoop();
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