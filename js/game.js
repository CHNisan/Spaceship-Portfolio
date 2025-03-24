import PhysicsEngine from './core/physics.js';  
import Entities from './managers/entity-manager.js';
import Camera from './core/camera.js';          
import InputManager from './core/input.js';
import BackgroundManager from './managers/background-manager.js';
import IntroScreen from './ui/intro-screen.js';
import { preloadAssets } from './managers/asset-manager.js';

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
        
        // Intro screen
        this.introScreen = null;
        this.gameInitialized = false;
    }
    
    init() {
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
        
        this.showIntroScreen();
    }
    
    showIntroScreen() {
        this.introScreen = new IntroScreen(this.app, () => {
            this.startGame();
        });
        
        this.app.stage.addChild(this.introScreen.init());
    }
    
    async startGame() {
        if (this.gameInitialized) return;
        
        try {
            await preloadAssets();
            
            this.physics.init();
            Entities.init(this.gameContainer, this.physics, this.camera);
            this.camera.init(this.gameContainer, this.app);
            this.input.init(this.app, this.gameContainer, Entities.ship, this.camera, this.physics);
            
            this.setupGameLoop();
            
            this.gameInitialized = true;
        } catch (error) {
            console.error('Error starting game:', error);
        }
    }
    
    setupGameLoop() {
        this.app.ticker.add(() => {
            if (this.isPaused) return;
            
            this.physics.update(this.app.ticker.deltaMS);
            
            this.input.applyShipControls();
            
            Entities.update();
            
            this.camera.follow(Entities.ship);
            this.camera.update(this.app.ticker.deltaMS);
            
            this.physics.keepEntityInBounds(Entities.ship);
        });
    }
}