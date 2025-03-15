import Path from '../entities/path.js';
import config from '../config/index.js';

const { theme: themeConfig } = config;

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
        this.createPathPair(500, 990, 10, 1000, 350, themeConfig.COLORS.BLUE, true);
        this.createPathPair(500, -360, 10, 1000, 350, themeConfig.COLORS.YELLOW, true);
        this.createPathPair(870, 630, 750, 10, 350, themeConfig.COLORS.GREEN, false);
        this.createPathPair(-250, 630, 750, 10, 350, themeConfig.COLORS.PINK, false);
    }

    createPath(x, y, width, height, color){
        this.path = new Path(this.container, x, y, width, height, color);
        this.path.init();
        return this.path;
    }

    createPathPair(x, y, width, height, gap, color, isHorizontal = true){
        const xOffset = isHorizontal ? gap + width : 0;
        const yOffset = isHorizontal ? 0 : gap + height;

        this.paths.push(this.createPath(x, y, width, height, color));
        this.paths.push(this.createPath(x + xOffset, y + yOffset, width, height, color));
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