// Main game class
import config from './config/index.js';
import Physics from './physics.js';
import Entities from './entities.js';
import Camera from './camera.js';
import Input from './input.js';

// Import the configs we need
const { world: worldConfig, ui: uiConfig } = config;

const Game = {
    app: null,
    gameContainer: null,
    
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
        
        // Initialize all systems
        Physics.init();
        Entities.init(this.gameContainer);
        Camera.init(this.gameContainer, this.app);
        Input.init(this.app, this.gameContainer, Entities.ship);
        
        // Show instructions
        this.createInstructions();
        
        // Start the game loop
        this.setupGameLoop();
    },
    
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
    },
    
    setupGameLoop() {
        this.app.ticker.add(() => {
            // Update physics
            Physics.update(this.app.ticker.deltaMS);
            
            // Apply ship controls
            Input.applyShipControls();
            
            // Update all entity positions
            Entities.update();
            
            // Update camera position
            Camera.follow(Entities.ship);
            Camera.update(this.app.ticker.deltaMS);
            
            // Keep ship in bounds
            Physics.keepEntityInBounds(Entities.ship);
        });
    }
};

// For backward compatibility during transition
window.SpaceGame.Game = Game;

export default Game;