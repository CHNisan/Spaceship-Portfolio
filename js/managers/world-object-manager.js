import Path from '../entities/world-objects/path.js';
import Wall from '../entities/world-objects/wall.js';
import Sign from '../entities/world-objects/sign.js';
import config from '../config/index.js';

const { 
    theme: themeConfig,
    sign: signConfig
 } = config;

class WorldObjectManager {
    constructor() {
        this.container = null;
        this.physics = null;
        
        // Entity collections
        this.paths = [];
        this.walls = [];
        this.signs = [];
        
        // Containers
        this.pathsContainer = null;
        this.wallsContainer = null;
        this.signsContainer = null;
    }
    
    init(container, physics) {
        this.container = container;
        this.physics = physics;
        
        this.createContainers();
        
        // Initialize entity subsystems
        this.createSigns();
        this.createPaths();

        this.wall = new Wall(this.wallsContainer, this.physics, -400, -400, 300, 300, themeConfig.COLORS.RED);
        this.wall.init();
    }
    
    createContainers() {
        this.pathsContainer = new PIXI.Container();
        this.wallsContainer = new PIXI.Container();
        this.signsContainer = new PIXI.Container();
        
        this.container.addChild(this.pathsContainer);
        this.container.addChild(this.wallsContainer);
        this.container.addChild(this.signsContainer)
    }
    



    createSigns(){
        // Create each POI from config data
                signConfig.DATA.PATHWAY.forEach((signData) => {
                    const sign = new Sign(
                        this.signsContainer, 
                        signData.x, 
                        signData.y, 
                        signData.size, 
                        signData.wrapWidth, 
                        signData.text);
                    sign.init();
                    this.signs.push(sign);
                });
    }
    



    createPaths() {
        this.createPathPair(500, 990, 10, 1000, 400, themeConfig.COLORS.BLUE, true);
        this.createPathPair(500, -410, 10, 1000, 400, themeConfig.COLORS.YELLOW, true);
        this.createPathPair(920, 580, 750, 10, 400, themeConfig.COLORS.GREEN, false);
        this.createPathPair(-250, 580, 750, 10, 400, themeConfig.COLORS.PINK, false);
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