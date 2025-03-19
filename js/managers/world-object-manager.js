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
    



    createPaths(x, y, pathWidth, pathHeight, gap) {
        // Create a plus sign layout of path pairs around a center point (top left corner of the bottom arm)
        
        const COLORS = themeConfig.COLORS;
        const isVertical = true;
        const isHorizontal = false;
        
        // Calculate positions for each arm of the plus sign
        const topY = y - pathWidth - pathHeight - gap;
        const bottomY = y + pathWidth;
        const leftX = x + pathWidth - pathHeight;
        const leftY = y - pathWidth - gap;
        const rightX = x + pathWidth + gap;
        const rightY = y - gap - pathWidth;
        
        // Create each path pair to form the complete plus sign
        this.createPathPair(x, topY, pathWidth, pathHeight, gap, COLORS.YELLOW, isVertical); // Top arm
        this.createPathPair(x, bottomY, pathWidth, pathHeight, gap, COLORS.BLUE, isVertical); // Bottom arm
        this.createPathPair(leftX, leftY, pathHeight, pathWidth, gap, COLORS.PINK, isHorizontal); // Left arm
        this.createPathPair(rightX, rightY, pathHeight, pathWidth, gap, COLORS.GREEN, isHorizontal); // Right arm
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