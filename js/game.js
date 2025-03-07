// Main game class
SpaceGame.Game = {
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
        SpaceGame.Physics.init();
        SpaceGame.Entities.init(this.gameContainer);
        SpaceGame.Camera.init(this.gameContainer, this.app);
        SpaceGame.Input.init(this.app, this.gameContainer, SpaceGame.Entities.ship);
        
        // Show instructions
        this.createInstructions();
        
        // Start the game loop
        this.setupGameLoop();
    },
    
    createInstructions() {
        const instructions = new PIXI.Text(
            "Control the spaceship with your mouse\nClick and hold to thrust\nClick on colored areas to focus camera",
            {
                fontFamily: 'Arial',
                fontSize: 16,
                fill: 0xffffff,
                align: 'center'
            }
        );
        instructions.position.set(20, 20);
        instructions.resolution = 2;  // For sharp text rendering
        this.app.stage.addChild(instructions);
    },
    
    setupGameLoop() {
        this.app.ticker.add(() => {
            // Update physics
            SpaceGame.Physics.update(this.app.ticker.deltaMS);
            
            // Apply ship controls
            SpaceGame.Input.applyShipControls();
            
            // Update all entity positions
            SpaceGame.Entities.update();
            
            // Update camera position
            SpaceGame.Camera.follow(SpaceGame.Entities.ship);
            SpaceGame.Camera.update(this.app.ticker.deltaMS);
            
            // Keep ship in bounds
            SpaceGame.Physics.keepEntityInBounds(SpaceGame.Entities.ship);
        });
    }
};