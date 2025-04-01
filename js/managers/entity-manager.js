import Ship from '../entities/ship.js';
import WorldObjectManager from './world-object-manager.js'
import PlaygroundManager from './playground-manager.js'
import config from '../config/index.js';

const { 
    world: worldConfig, 
} = config;

class EntityManager {
    constructor() {
        this.container = null;
        this.physics = null;
        this.camera = null;
        
        // Entity collections
        this.ship = null;
        
        // Containers
        this.worldObjectsContainer = null
        this.playgroundContainer = null;
    }
    
    //#region Setup
    init(container, physics, camera) {
        this.container = container;
        this.physics = physics;
        this.camera = camera;
        
        this.createContainers();
        
        // Initialize entity subsystems
        this.createSpaceship();
        this.createBoundaryVisual();
        this.createZoomAreaVisual();

        WorldObjectManager.init(this.worldObjectsContainer, this.physics, this.camera);
        PlaygroundManager.init(this.playgroundContainer, this.physics);
    }
    
    createContainers() {
        this.worldObjectsContainer = new PIXI.Container();
        this.playgroundContainer = new PIXI.Container();
        
        this.container.addChild(this.worldObjectsContainer);
        this.container.addChild(this.playgroundContainer);
    }
    //#endregion 

      
    
    //#region Ship
    createSpaceship() {
        this.ship = new Ship(this.container, this.physics);
        this.ship.init();
    }

    // Helper to make sure a ship exists before setting it's engine glow
    setEngineGlow(isVisible) {
        if (this.ship) {
            this.ship.setEngineGlow(isVisible);
        }
    }
    //#endregion
    


    //#region Boundary
    createBoundaryVisual() {
        const boundary = new PIXI.Graphics();
        boundary.lineStyle(worldConfig.BOUNDARY.LINE_WIDTH, worldConfig.BOUNDARY.COLOR);
        boundary.drawRect(
            worldConfig.BOUNDS.MIN_X, 
            worldConfig.BOUNDS.MIN_Y, 
            worldConfig.WIDTH,  // Now using WIDTH instead of SIZE
            worldConfig.HEIGHT  // Now using HEIGHT instead of SIZE
        );
        this.container.addChild(boundary);
    }

    createZoomAreaVisual() {
        const zoomArea = worldConfig.ZOOM_AREA;
        
        // Create a subtle indicator for the zoom area
        const zoomAreaVisual = new PIXI.Graphics();
        zoomAreaVisual.lineStyle(2, 0x00FF00, 0.4);  // Thin green line, partially transparent
        zoomAreaVisual.drawRect(
            zoomArea.MIN_X, 
            zoomArea.MIN_Y, 
            zoomArea.MAX_X - zoomArea.MIN_X, 
            zoomArea.MAX_Y - zoomArea.MIN_Y
        );
        
        // Add a visual indication of the transition area
        zoomAreaVisual.lineStyle(1, 0x00FF00, 0.2);  // Thinner, more transparent line
        zoomAreaVisual.drawRect(
            zoomArea.MIN_X - zoomArea.TRANSITION_DISTANCE, 
            zoomArea.MIN_Y - zoomArea.TRANSITION_DISTANCE, 
            (zoomArea.MAX_X - zoomArea.MIN_X) + (zoomArea.TRANSITION_DISTANCE * 2), 
            (zoomArea.MAX_Y - zoomArea.MIN_Y) + (zoomArea.TRANSITION_DISTANCE * 2)
        );
        
        this.container.addChild(zoomAreaVisual);
    }
    //#endregion
    
    
    
    update(deltaTime) {
        if (this.ship) {
            this.ship.update(deltaTime);
        }

        PlaygroundManager.update();
        WorldObjectManager.update();
    }
}


// Export as a singleton
const Entities = new EntityManager();
export default Entities;