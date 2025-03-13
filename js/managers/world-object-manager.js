import Path from '../entities/path.js';

class WorldObjectManager {
    constructor() {
        this.container = null;
        
        // Entity collections
        this.paths = [];
        this.walls = [];
        this.signs = [];
        
        // Containers
        this.pathsContainer = null;
        this.wallsContainer = null;
        this.signsContainer = null;
    }
    
    init(container) {
        this.container = container;
        
        this.createContainers();
        
        // Initialize entity subsystems
        this.createPaths();
    }
    
    createContainers() {
        this.pathsContainer = new PIXI.Container();
        this.wallsContainer = new PIXI.Container();
        this.signsContainer = new PIXI.Container();
        
        this.container.addChild(this.pathsContainer);
        this.container.addChild(this.wallsContainer);
        this.container.addChild(this.signsContainer)
    }
    
    createPaths() {
        this.paths.push(this.createPath(0, 0, 10, 750, 0x00FFFF));
        this.paths.push(this.createPath(300, 0, 10, 750, 0x00FFFF));

        this.paths.push(this.createPath(0, -1070, 10, 750, 0xFFAA00));
        this.paths.push(this.createPath(300, -1070, 10, 750, 0xFFAA00));

        this.paths.push(this.createPath(300, 0, 750, 10, 0x00FF00));
        this.paths.push(this.createPath(300, -320, 750, 10, 0x00FF00));

        this.paths.push(this.createPath(-750, 0, 750, 10, 0xFF00FF));
        this.paths.push(this.createPath(-750, -320, 750, 10, 0xFF00FF));
    }

    createPath(x, y, width, height, color){
        this.path = new Path(this.container, x, y, width, height, color);
        this.path.init();
        return this.path;
    }
    
    update(deltaTime) {
        // if (this.ship) {
        //     this.ship.update(deltaTime);
        // }
    }
}

// Export as a singleton
const WorldObjects = new WorldObjectManager();
export default WorldObjects;