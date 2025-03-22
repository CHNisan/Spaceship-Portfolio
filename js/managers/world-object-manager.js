import Path from '../entities/world-objects/path.js';
import Sign from '../entities/world-objects/sign.js';
import Asteroid from '../entities/asteroid.js';
import PointOfInterest from '../entities/poi.js';
import config from '../config/index.js';

const { 
    sign: signConfig,
    world: worldConfig,
    asteroid: asteroidConfig,
    socialMediaButton: socialMediaButtonConfig
 } = config;

class WorldObjectManager {
    constructor() {
        // Main gameworld data
        this.container = null;
        this.physics = null;
        this.camera = null;
        
        // Entity collections
        this.paths = [];
        this.signs = [];
        this.socialsButtons = [];
        this.asteroids = [];
        
        // Containers
        this.pathsContainer = null;
        this.signsContainer = null;
        this.socialsButtonsContainer = null;
        this.asteroidsContainer = null;
    }
    
    init(container, physics, camera) {
        this.container = container;
        this.physics = physics;
        this.camera = camera;
        
        this.createContainers();
        
        this.createGuide();
        this.createAsteroids();
    }
    
    createContainers() {
        this.pathsContainer = new PIXI.Container();
        this.signsContainer = new PIXI.Container();
        this.soicalsButtonsContainer = new PIXI.Container();
        this.asteroidsContainer = new PIXI.Container();
        
        this.container.addChild(this.pathsContainer);
        this.container.addChild(this.signsContainer)
        this.container.addChild(this.soicalsButtonsContainer)
        this.container.addChild(this.asteroidsContainer);
    }



    createGuide(){
        const position = worldConfig.GUIDE.POSITION;
        const dimensions = worldConfig.GUIDE.DIMENSIONS;

        this.createPaths(position.X, position.Y, dimensions.PATH_WIDTH, dimensions.PATH_HEIGHT, dimensions.LANE_WIDTH);
        this.createSigns(position.X, position.Y);
        this.createSocialMediaButtons(position.X + signConfig.DATA.DETAILS.x, position.X + signConfig.DATA.DETAILS.y);
        // Clean this up a bit to make it more readable (needed the details.x and details.y bit to shift the buttons so they're relative to the details poition)
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



    createSocialMediaButtons(x, y){
        socialMediaButtonConfig.ITEMS.forEach((buttonData, index) => {
            const button = new PointOfInterest(
                this.soicalsButtonsContainer, 
                this.physics,
                this.camera, 
                buttonData, 
                index + 1,
                x,
                y
            );
            button.init();

            this.socialsButtons.push(button);
        });
    }




    createAsteroids() {
        // Use asteroid count from config
        for (let i = 0; i < asteroidConfig.ASTEROIDS.COUNT; i++) {
            // Find a valid position for the asteroid
            let x, y;

            x = this.getRandomNumber(asteroidConfig.ASTEROIDS.POSITION.MIN_X, asteroidConfig.ASTEROIDS.POSITION.MAX_X);
            y = this.getRandomNumber(asteroidConfig.ASTEROIDS.POSITION.MIN_Y, asteroidConfig.ASTEROIDS.POSITION.MAX_Y);
            
            // Generate asteroid properties
            const size = Math.random() * 
                (asteroidConfig.ASTEROIDS.MAX_SIZE - asteroidConfig.ASTEROIDS.MIN_SIZE) + 
                asteroidConfig.ASTEROIDS.MIN_SIZE;
            
            const segments = Math.floor(Math.random() * 
                (asteroidConfig.ASTEROIDS.MAX_SEGMENTS - asteroidConfig.ASTEROIDS.MIN_SEGMENTS) + 
                asteroidConfig.ASTEROIDS.MIN_SEGMENTS);
            
            // Create asteroid
            const asteroid = new Asteroid(this.asteroidsContainer, this.physics, x, y, size, segments);
            asteroid.init();
            this.asteroids.push(asteroid);
        }
    }

    getRandomNumber(min, max) {
        // Make sure min is actually less than max
        if (min > max) {
            [min, max] = [max, min]; // Swap values if needed
        }
        
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }




    update(deltaTime) {
        this.socialsButtons.forEach(button => {
            button.update(deltaTime);
        });
        
        this.asteroids.forEach(asteroid => {
            asteroid.update(deltaTime);
        });
    }
}

// Export as a singleton
const WorldObjects = new WorldObjectManager();
export default WorldObjects;