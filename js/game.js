// Main game class
const Game = {
    app: null,
    gameContainer: null,
    
    init() {
        // Initialize PIXI Application
        this.app = new PIXI.Application({
            background: '#000033',
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
        const instructions = new PIXI.Text(
            "Control the spaceship with your mouse\nClick and hold to thrust",
            {
                fontFamily: 'Arial',
                fontSize: 16,
                fill: 0xffffff,
                align: 'center'
            }
        );
        instructions.position.set(20, 20);
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
            Camera.update();
            
            // Keep ship in bounds
            Physics.keepEntityInBounds(Entities.ship);
        });
    }
};