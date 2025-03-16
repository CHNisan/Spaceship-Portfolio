// Main entity manager
import config from '../config/index.js';
import Ship from '../entities/ship.js';
import Asteroid from '../entities/asteroid.js';
import PointOfInterest from '../entities/poi.js';
import Sign from "../entities/world-objects/sign.js"
import WorldObjectManager from './world-object-manager.js'

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
        this.asteroids = [];
        this.pointsOfInterest = [];
        
        // Containers
        this.asteroidsContainer = null;
        this.poiContainer = null;
        this.worldObjectsContainer = null
        
        // POI data from config
        this.poiData = poiConfig.ITEMS;
    }
    
    init(container, physics, camera) {
        this.container = container;
        this.physics = physics;
        this.camera = camera;
        
        this.createContainers();
        
        // Initialize entity subsystems
        this.createAsteroids();
        this.createSpaceship();
        this.createBoundaryVisual();
        
        // Create POIs
        this.createPointsOfInterest();

        WorldObjectManager.init(this.worldObjectsContainer, this.physics);
    }
    
    createContainers() {
        this.asteroidsContainer = new PIXI.Container();
        this.poiContainer = new PIXI.Container();
        this.worldObjectsContainer = new PIXI.Container();
        
        this.container.addChild(this.asteroidsContainer);
        this.container.addChild(this.poiContainer);
        this.container.addChild(this.worldObjectsContainer);
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
    
    createPointsOfInterest() {
        // Create each POI from config data
        this.poiData.forEach((poiData, index) => {
            const poi = new PointOfInterest(
                this.poiContainer, 
                this.physics, 
                poiData, 
                index + 1,
                this.camera
            );
            poi.init();

            const title = new Sign(
                null, 
                poiConfig.FONT.TITLE.XOFFSET, 
                poiConfig.FONT.TITLE.YOFFSET, 
                poiConfig.FONT.TITLE.SIZE, 
                poiData.width, 
                poiData.title);
            title.init();

            poi.graphic.addChild(title.graphic);
            
            this.pointsOfInterest.push([poi, title]);
        });
        console.log(this.descriptions);
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
            poi[0].update(deltaTime);
        });
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