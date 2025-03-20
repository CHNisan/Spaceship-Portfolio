// Main entity manager
import config from '../config/index.js';
import Ship from '../entities/ship.js';
import PointOfInterest from '../entities/poi.js';
import Sign from "../entities/world-objects/sign.js"
import WorldObjectManager from './world-object-manager.js'
import PlaygroundManager from './playground-manager.js'

// Import configs
const { 
    world: worldConfig, 
    entities: asteroidConfig, 
    poi: poiConfig 
} = config;

class EntityManager {
    constructor() {
        this.container = null;
        this.physics = null;
        this.camera = null;
        
        // Entity collections
        this.ship = null;
        this.pointsOfInterest = [];
        
        // Containers
        this.poiContainer = null;
        this.poiSignContainer = null;
        this.worldObjectsContainer = null
        this.playgroundContainer = null;
        
        // POI data from config
        this.poiData = poiConfig.ITEMS;
    }
    
    init(container, physics, camera) {
        this.container = container;
        this.physics = physics;
        this.camera = camera;
        
        this.createContainers();
        
        // Initialize entity subsystems
        this.createSpaceship();
        this.createBoundaryVisual();
        
        // Create POIs
        this.createPointsOfInterest();

        WorldObjectManager.init(this.worldObjectsContainer, this.physics);
        PlaygroundManager.init(this.playgroundContainer, this.physics);
    }
    
    createContainers() {
        this.poiContainer = new PIXI.Container();
        this.poiSignContainer = new PIXI.Container();
        this.worldObjectsContainer = new PIXI.Container();
        this.playgroundContainer = new PIXI.Container();
        
        this.container.addChild(this.poiContainer);
        this.container.addChild(this.poiSignContainer);
        this.container.addChild(this.worldObjectsContainer);
        this.container.addChild(this.playgroundContainer);
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

            // Create Sign (not as child of poi otherwise it would get scaled up as well when hovered over)
            const title = new Sign(
                this.poiSignContainer, 
                poiConfig.FONT.TITLE.XOFFSET + poiData.x, // Plus poi position to move the text to the poi position
                poiConfig.FONT.TITLE.YOFFSET + poiData.y + poiData.height/2, // Plus half of poi height to move the text just below the poi
                poiConfig.FONT.TITLE.SIZE, 
                poiData.width, 
                poiData.title,
                poiConfig.FONT.TITLE.WEIGHT,
                poiConfig.FONT.TITLE.ALIGN
            );
            title.init();

            // Create Description as child of title graphic
            const description = new Sign(
                title.graphic, 
                0, 
                poiConfig.FONT.DESCRIPTION.YOFFSET, 
                poiConfig.FONT.DESCRIPTION.SIZE, 
                poiData.width - poiConfig.FONT.DESCRIPTION.XOFFSET, 
                poiData.description,
                poiConfig.FONT.DESCRIPTION.WEIGHT,
                poiConfig.FONT.DESCRIPTION.ALIGN);
            description.init();
            
            // Object to make a poi's title and description easy to reference
            this.pointsOfInterest.push({
                currentPoi: poi, 
                title: title, 
                description: description
            });
        });
    }
    
    update(deltaTime) {
        // Update ship
        if (this.ship) {
            this.ship.update(deltaTime);
        }
        
        // Update POIs
        this.pointsOfInterest.forEach(poi => {
            poi.currentPoi.update(deltaTime);
        });

        PlaygroundManager.update();
        WorldObjectManager.update();
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