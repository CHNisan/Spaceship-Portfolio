import Path from '../entities/world-objects/path.js';
import Sign from '../entities/world-objects/sign.js';
import config from '../config/index.js';

const { 
    theme: themeConfig,
    sign: signConfig,
    world: worldConfig
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
        
        this.createGuide();
    }
    
    createContainers() {
        this.pathsContainer = new PIXI.Container();
        this.wallsContainer = new PIXI.Container();
        this.signsContainer = new PIXI.Container();
        
        this.container.addChild(this.pathsContainer);
        this.container.addChild(this.wallsContainer);
        this.container.addChild(this.signsContainer)
    }



    createGuide(){
        const position = worldConfig.GUIDE.POSITION;
        const dimensions = worldConfig.GUIDE.DIMENSIONS;

        this.createPaths(position.X, position.Y, dimensions.PATH_WIDTH, dimensions.PATH_HEIGHT, dimensions.LANE_WIDTH);
        this.createSigns(position.X, position.Y);
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
    



    createPaths(x, y, pathWidth, pathHeight, laneWidth) {
        // Create a plus sign layout of path pairs around a center point (top left corner of the bottom arm)
        
        const wallColors = worldConfig.GUIDE.WALL_COLORS;
        const isVertical = true;
        const isHorizontal = false;
        
        // Calculate positions for each arm of the plus sign
        const topY = y - pathWidth - pathHeight - laneWidth;
        const bottomY = y + pathWidth;
        const leftX = x + pathWidth - pathHeight;
        const leftY = y - pathWidth - laneWidth;
        const rightX = x + pathWidth + laneWidth;
        const rightY = y - laneWidth - pathWidth;
        
        // Create each path pair to form the complete plus sign
        this.createPathPair(x, topY, pathWidth, pathHeight, laneWidth, wallColors.TOP, isVertical); // Top arm
        this.createPathPair(x, bottomY, pathWidth, pathHeight, laneWidth, wallColors.BOTTOM, isVertical); // Bottom arm
        this.createPathPair(leftX, leftY, pathHeight, pathWidth, laneWidth, wallColors.LEFT, isHorizontal); // Left arm
        this.createPathPair(rightX, rightY, pathHeight, pathWidth, laneWidth, wallColors.RIGHT, isHorizontal); // Right arm
    }

    createPathPair(x, y, pathWidth, pathHeight, laneWidth, color, isHorizontal = true){
        // Create a pair of paths offset by a certain amount
        const xOffset = isHorizontal ? laneWidth + pathWidth : 0;
        const yOffset = isHorizontal ? 0 : laneWidth + pathHeight;

        this.createPath(x, y, pathWidth, pathHeight, color, this.pathsContainer, this.paths);
        this.createPath(x + xOffset, y + yOffset, pathWidth, pathHeight, color, this.pathsContainer, this.paths);
    }

    createPath(x, y, pathWidth, pathHeight, color, container, array){
        const path = new Path(container, x, y, pathWidth, pathHeight, color);
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