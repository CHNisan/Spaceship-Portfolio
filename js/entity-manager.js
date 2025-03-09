// Main entity manager
import config from './config/index.js';
import Ship from './entities/ship.js';
import Asteroid from './entities/asteroid.js';
import Star from './entities/star.js';
import PointOfInterest from './entities/poi.js';
import PopupManager from './entities/popup-manager.js';

// Import configs
const { 
    world: worldConfig, 
    entities: entitiesConfig, 
    poi: poiConfig 
} = config;

class EntityManager {
    constructor() {
        this.container = null;
        this.physics = null;
        this.camera = null;
        
        // Entity collections
        this.ship = null;
        this.stars = [];
        this.asteroids = [];
        this.pointsOfInterest = [];
        
        // Containers
        this.starsContainer = null;
        this.asteroidsContainer = null;
        this.poiContainer = null;
        
        // Other managers
        this.popupManager = null;
        
        // POI data from config
        this.poiData = poiConfig.ITEMS;
    }
    
    init(container, physics, camera) {
        this.container = container;
        this.physics = physics;
        this.camera = camera;
        console.log(camera);

        // Create before the entity containers so it doesn't interfere with interactions 
        this.createBackgroundClickArea();
        
        this.createContainers();
        
        // Initialize entity subsystems
        this.createStars();
        this.createAsteroids();
        this.createSpaceship();
        this.createBoundaryVisual();
        
        // Initialize popup manager
        this.popupManager = new PopupManager(this.container);
        this.popupManager.init(this.poiData);
        
        // Create POIs after popup manager is ready
        this.createPointsOfInterest();
    }
    
    createContainers() {
        this.starsContainer = new PIXI.Container();
        this.asteroidsContainer = new PIXI.Container();
        this.poiContainer = new PIXI.Container();
        
        this.container.addChild(this.starsContainer);
        this.container.addChild(this.asteroidsContainer);
        this.container.addChild(this.poiContainer);
    }
    
    createStars() {
        // Use star count and properties from config
        for (let i = 0; i < worldConfig.BACKGROUND.STARS.COUNT; i++) {
            const x = Math.random() * worldConfig.SIZE - worldConfig.SIZE / 2;
            const y = Math.random() * worldConfig.SIZE - worldConfig.SIZE / 2;
            
            // Use min/max size from config
            const size = Math.random() * 
                (worldConfig.BACKGROUND.STARS.MAX_SIZE - worldConfig.BACKGROUND.STARS.MIN_SIZE) + 
                worldConfig.BACKGROUND.STARS.MIN_SIZE;
            
            // Use min/max opacity from config
            const brightness = Math.random() * 
                (worldConfig.BACKGROUND.STARS.MAX_OPACITY - worldConfig.BACKGROUND.STARS.MIN_OPACITY) + 
                worldConfig.BACKGROUND.STARS.MIN_OPACITY;
            
            const star = new Star(this.starsContainer, x, y, size, brightness);
            star.init();
            this.stars.push(star);
        }
    }
    
    createAsteroids() {
        // Use asteroid count from config
        for (let i = 0; i < entitiesConfig.ASTEROIDS.COUNT; i++) {
            // Find a valid position for the asteroid
            let x, y;
            let isValidPosition;
            
            do {
                x = Math.random() * worldConfig.SIZE - worldConfig.SIZE / 2;
                y = Math.random() * worldConfig.SIZE - worldConfig.SIZE / 2;
                
                // Check if too close to ship spawn
                isValidPosition = Math.sqrt(x*x + y*y) >= entitiesConfig.ASTEROIDS.SAFE_RADIUS;
                
                // Check if inside any POI
                if (isValidPosition) {
                    for (const poi of this.poiData) {
                        // Add buffer
                        const bufferX = poi.width * entitiesConfig.POI_BUFFER.X_MULTIPLIER;
                        const bufferY = poi.height * entitiesConfig.POI_BUFFER.Y_MULTIPLIER;
                        
                        if (x > poi.x - (poi.width/2 + bufferX) && 
                            x < poi.x + (poi.width/2 + bufferX) && 
                            y > poi.y - (poi.height/2 + bufferY) && 
                            y < poi.y + (poi.height/2 + bufferY)) {
                            isValidPosition = false;
                            break;
                        }
                    }
                }
            } while (!isValidPosition);
            
            // Generate asteroid properties
            const size = Math.random() * 
                (entitiesConfig.ASTEROIDS.MAX_SIZE - entitiesConfig.ASTEROIDS.MIN_SIZE) + 
                entitiesConfig.ASTEROIDS.MIN_SIZE;
            
            const segments = Math.floor(Math.random() * 
                (entitiesConfig.ASTEROIDS.MAX_SEGMENTS - entitiesConfig.ASTEROIDS.MIN_SEGMENTS) + 
                entitiesConfig.ASTEROIDS.MIN_SEGMENTS);
            
            // Create asteroid
            const asteroid = new Asteroid(this.asteroidsContainer, this.physics, x, y, size, segments);
            asteroid.init();
            this.asteroids.push(asteroid);
        }
    }
    
    createSpaceship() {
        this.ship = new Ship(this.container, this.physics);
        this.ship.init();
    }
    
    createBoundaryVisual() {
        const boundary = new PIXI.Graphics();
        boundary.lineStyle(worldConfig.BOUNDARY.LINE_WIDTH, worldConfig.BOUNDARY.COLOR);
        boundary.drawRect(
            worldConfig.BOUNDS.MIN_X, 
            worldConfig.BOUNDS.MIN_Y, 
            worldConfig.SIZE, 
            worldConfig.SIZE
        );
        this.container.addChild(boundary);
    }
    
    createBackgroundClickArea() {
        // Add a background click detector
        const bgClickArea = new PIXI.Graphics();
        bgClickArea.beginFill(0xFFFFFF, 0.01); // Almost invisible
        bgClickArea.drawRect(
            worldConfig.BOUNDS.MIN_X, 
            worldConfig.BOUNDS.MIN_Y, 
            worldConfig.SIZE, 
            worldConfig.SIZE
        );
        bgClickArea.endFill();
        
        // Make it interactive
        bgClickArea.eventMode = 'static';
        bgClickArea.on('pointerdown', () => {
            // Reset camera focus
            if (this.camera) {
                this.camera.resetFocus();
                console.log("click bg");
            }
            
            // Hide any active popup
            if (this.popupManager) {
                this.popupManager.hidePopup();
            }
        });
        
        // Add to container
        this.container.addChild(bgClickArea);
    }
    
    createPointsOfInterest() {
        // Create each POI from config data
        this.poiData.forEach((poiData, index) => {
            const poi = new PointOfInterest(
                this.poiContainer, 
                this.physics, 
                poiData, 
                index + 1, 
                this.popupManager,
                this.camera
            );
            poi.init();
            this.pointsOfInterest.push(poi);
        });
    }
    
    update(deltaTime) {
        // Update ship
        if (this.ship) {
            this.ship.update(deltaTime);
        }
        
        // Update asteroids
        this.asteroids.forEach(asteroid => {
            asteroid.update(deltaTime);
        });
        
        // Update POIs
        this.pointsOfInterest.forEach(poi => {
            poi.update(deltaTime);
        });
        
        // Update popup
        if (this.popupManager) {
            this.popupManager.update();
        }
    }
    
    // Helper method for thrust visuals
    setEngineGlow(isVisible) {
        if (this.ship) {
            this.ship.setEngineGlow(isVisible);
        }
    }
}

// Export as a singleton
const Entities = new EntityManager();
export default Entities;