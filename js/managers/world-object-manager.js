import Path from '../entities/world-objects/path.js';
import Sign from '../entities/world-objects/sign.js';
import config from '../config/index.js';

const { 
    theme: themeConfig,
    sign: signConfig
 } = config;

class WorldObjectManager {
    constructor() {
        // Main gameworld data
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
        this.createGuide(500, 990, 10, 1000, 400)
    }
    
    createContainers() {
        this.pathsContainer = new PIXI.Container();
        this.wallsContainer = new PIXI.Container();
        this.signsContainer = new PIXI.Container();
        
        this.container.addChild(this.pathsContainer);
        this.container.addChild(this.wallsContainer);
        this.container.addChild(this.signsContainer)
    }



    createGuide(x, y, width, height, gap){
        this.createPaths(x, y, width, height, gap);
        this.createSigns(x, y);
    }
    



    createSigns(x, y){
        // Parameters so the signs can be moved with the paths while maintaining their relative positions

        // Create each pathway sign
        signConfig.DATA.PATHWAY.forEach((signData) => {
            const sign = new Sign(
                this.signsContainer, 
                signData.x + x, 
                signData.y + y, 
                signData.size, 
                signData.wrapWidth, 
                signData.text);
            sign.init();
            this.signs.push(sign);
        });

        // Create details as a sign
        const details = new Sign(
            this.signsContainer, 
            signConfig.DATA.DETAILS.x + x, 
            signConfig.DATA.DETAILS.y + y, 
            signConfig.DATA.DETAILS.size, 
            signConfig.DATA.DETAILS.wrapWidth, 
            signConfig.DATA.DETAILS.text);
        details.init();
        this.signs.push(details);
    }
    



    createPaths(x, y, width, height, gap) {
        // Paramenters so the paths can be moved/resized as one while maintaining their layout

        // Create each path pair to make a full pathway
        this.createPathPair(x, y + width, width, height, gap, themeConfig.COLORS.BLUE, true);
        this.createPathPair(x, y - width - height - gap, width, height, gap, themeConfig.COLORS.YELLOW, true);
        this.createPathPair(x + width + gap , y - gap - width, height, width, gap, themeConfig.COLORS.GREEN, false);
        this.createPathPair(x + width - height, y - width - gap, height, width, gap, themeConfig.COLORS.PINK, false);
    }

    createPathPair(x, y, width, height, gap, color, isHorizontal = true){
        // Create a pair of paths offset by a certain amount
        const xOffset = isHorizontal ? gap + width : 0;
        const yOffset = isHorizontal ? 0 : gap + height;

        this.createPath(x, y, width, height, color, this.pathsContainer, this.paths);
        this.createPath(x + xOffset, y + yOffset, width, height, color, this.pathsContainer, this.paths);
    }

    createPath(x, y, width, height, color, container, array){
        const path = new Path(container, x, y, width, height, color);
        path.init();
        array.push(path)
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