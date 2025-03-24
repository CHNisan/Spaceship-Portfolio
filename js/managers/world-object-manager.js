import Path from '../entities/world-objects/path.js';
import Sign from '../entities/world-objects/sign.js';
import Asteroid from '../entities/world-objects/asteroid.js';
import PointOfInterest from '../entities/world-objects/poi.js';
import config from '../config/index.js';

const { 
    world: worldConfig,
    sign: signConfig,
    poi: poiConfig,
    socialMediaButton: socialMediaButtonConfig,
    asteroid: asteroidConfig
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
        this.pointsOfInterest = [];
        this.socialsButtons = [];
        this.asteroids = [];
        
        // Containers
        this.pathsContainer = null;
        this.signsContainer = null;
        this.poiContainer = null;
        this.poiSignContainer = null;
        this.socialsButtonsContainer = null;
        this.asteroidsContainer = null;

        // Data config
        this.poiData = poiConfig.ITEMS;
    }
    
    //#region Setup
    init(container, physics, camera) {
        this.container = container;
        this.physics = physics;
        this.camera = camera;
        
        this.createContainers();
        
        // Initialize entity subsystems
        this.createGuide();
        this.createPointsOfInterest();
        this.createAsteroids();
    }
    
    createContainers() {
        this.pathsContainer = new PIXI.Container();
        this.signsContainer = new PIXI.Container();
        this.poiContainer = new PIXI.Container();
        this.poiSignContainer = new PIXI.Container();
        this.soicalsButtonsContainer = new PIXI.Container();
        this.asteroidsContainer = new PIXI.Container();
        
        this.container.addChild(this.pathsContainer);
        this.container.addChild(this.signsContainer)
        this.container.addChild(this.poiContainer);
        this.container.addChild(this.poiSignContainer);
        this.container.addChild(this.soicalsButtonsContainer)
        this.container.addChild(this.asteroidsContainer);
    }

    createGuide(){
        const position = worldConfig.GUIDE.POSITION;
        const dimensions = worldConfig.GUIDE.DIMENSIONS;
        const details = signConfig.DATA.DETAILS;

        // Position values let the guide area be moved in the world while each element maintains their relative position
        this.createPaths(position.X, position.Y, dimensions.PATH_WIDTH, dimensions.PATH_HEIGHT, dimensions.LANE_WIDTH);
        this.createSigns(position.X, position.Y);

        const soicalsOffsetX = position.X + details.x; // Calculate the buttons' position relative to the details' (details' position are their origin)
        const soicalsOffsetY = position.X + details.y;
        this.createSocialMediaButtons(soicalsOffsetX, soicalsOffsetY);
    }
    //#endregion



    //#region Paths
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
        
        this.createPathPair(x, topY, pathWidth, pathHeight, laneWidth, wallColors.TOP, isVertical); // Top arm
        this.createPathPair(x, bottomY, pathWidth, pathHeight, laneWidth, wallColors.BOTTOM, isVertical); // Bottom arm
        this.createPathPair(leftX, leftY, pathHeight, pathWidth, laneWidth, wallColors.LEFT, isHorizontal); // Left arm
        this.createPathPair(rightX, rightY, pathHeight, pathWidth, laneWidth, wallColors.RIGHT, isHorizontal); // Right arm
    }

    createPathPair(x, y, pathWidth, pathHeight, laneWidth, color, isHorizontal = true){
        // Create a pair of paths offset by a certain amount
        const xOffset = isHorizontal ? laneWidth + pathWidth : 0; // If horizontal, the second path is offset on the x axis
        const yOffset = isHorizontal ? 0 : laneWidth + pathHeight;

        this.createPath(x, y, pathWidth, pathHeight, color, this.pathsContainer, this.paths);
        this.createPath(x + xOffset, y + yOffset, pathWidth, pathHeight, color, this.pathsContainer, this.paths);
    }

    createPath(x, y, pathWidth, pathHeight, color, container, array){
        const path = new Path(container, x, y, pathWidth, pathHeight, color);
        path.init();
        array.push(path)
    }
    //#endregion



    //#region Signs
    createSigns(x, y){
        // Create each pathway sign
        signConfig.DATA.PATHWAY.forEach((signData) => {
            const sign = new Sign(
                this.signsContainer, 
                signData.x + x, // Offset by the world position of the guide area
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
            signConfig.DATA.DETAILS.x + x, // Offset by the world position of the guide area
            signConfig.DATA.DETAILS.y + y, 
            signConfig.DATA.DETAILS.size, 
            signConfig.DATA.DETAILS.wrapWidth, 
            signConfig.DATA.DETAILS.text);
        details.init();
        this.signs.push(details);
    }
    //#endregion



    //#region Intractables
    createPointsOfInterest() {
        // Create each POI from config data
        this.poiData.forEach((poiData, index) => {
            const poi = new PointOfInterest(
                this.poiContainer, 
                this.physics, 
                this.camera,
                poiData, 
                index + 1,
            );
            poi.init();

            // Create Sign (not a child of poi otherwise it would get scaled up as well when hovered over)
            const title = new Sign(
                this.poiSignContainer, 
                poiConfig.FONT.TITLE.XOFFSET + poiData.x, // Plus poi position to set the sign's position relative to it's poi
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
                0, // In line on x-axis with title
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
    //#endregion



    //#region Asteroids
    createAsteroids() {
        for (let i = 0; i < asteroidConfig.ASTEROIDS.COUNT; i++) {

            // Find position
            const x = this.getRandomNumber(asteroidConfig.ASTEROIDS.POSITION.MIN_X, asteroidConfig.ASTEROIDS.POSITION.MAX_X);
            const y = this.getRandomNumber(asteroidConfig.ASTEROIDS.POSITION.MIN_Y, asteroidConfig.ASTEROIDS.POSITION.MAX_Y);
            
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
    //#endregion



    //#region Helper functions
    getRandomNumber(min, max) {
        // Make sure min is actually less than max
        if (min > max) {
            [min, max] = [max, min]; // Swap values if needed
        }
        
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    //#endregion



    update(deltaTime) {
        this.pointsOfInterest.forEach(poi => {
            poi.currentPoi.update(deltaTime);
        });

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