import Wall from '../entities/world-objects/wall.js';
import Ball from '../entities/playground-objects/ball.js';
import config from '../config/index.js';

const { 
    theme: themeConfig,
    ball: ballConfig,
    playground: playgroundConfig
} = config;

class PlaygroundManager {
    constructor() {
        // Main gameworld data
        this.container = null;
        this.physics = null;
        
        // Entity collections
        this.walls = [];
        this.balls = []
        
        // Containers
        this.wallsContainer = null;
        this.ballsContainer = null;
    }
    
    //#region Setup
    init(container, physics) {
        this.container = container;
        this.physics = physics;
        
        this.createContainers();

        this.createBowling();
        this.createBallInHole();
    }
    
    createContainers() {
        this.wallsContainer = new PIXI.Container();
        this.ballsContainer = new PIXI.Container();

        this.container.addChild(this.wallsContainer);
        this.container.addChild(this.ballsContainer);
    }
    //#endregion
    

    //#region Section creation
    createBowling() {
        // Create a retangle area with an open left and right side to contain a bowling ball and pins

        const position = playgroundConfig.BOWLING.POSITION;
        const dimensions = playgroundConfig.BOWLING.DIMENSIONS;
        const pins = playgroundConfig.BOWLING.PINS;
        const color = playgroundConfig.BOWLING.WALL_COLOR;

        // Create the lane boundaries (top and bottom walls)
        const topWallY = position.Y;
        const bottomWallY = position.Y + dimensions.LANE_WIDTH;
        this.createWall(position.X, topWallY, dimensions.WALL_WIDTH, dimensions.WALL_HEIGHT, color);    // Top wall
        this.createWall(position.X, bottomWallY, dimensions.WALL_WIDTH, dimensions.WALL_HEIGHT, color); // Bottom wall


        // Create the bowling ball (positioned in the middle of the lane, at the right end of the walls)
        const ballX = position.X + dimensions.WALL_WIDTH/2 - ballConfig.BOWLING.RADIUS;
        const ballY = position.Y + dimensions.LANE_WIDTH/2;
        this.createBall(ballX, ballY, ballConfig.BOWLING);


        // Create pins (positioned in the middle of the lane, at the left end of the walls)
        this.createPins(position.X, position.Y, dimensions.WALL_WIDTH, dimensions.LANE_WIDTH, pins.ROWS, pins.SPACING, pins.BALL_TYPE)
    }



    
    createBallInHole(){
        // Create a retangle area with an open left side to contain a goal, obstacles and ball

        const position = playgroundConfig.BALL_IN_HOLE.POSITION;
        const dimensions = playgroundConfig.BALL_IN_HOLE.DIMENSIONS;
        const obstacle = playgroundConfig.BALL_IN_HOLE.OBSTACLE;
        const color = playgroundConfig.BALL_IN_HOLE.WALL_COLOR;


        // Create the lane boundaries (top, bottom and left walls)
        this.createWall(position.X, position.Y, dimensions.WALL_WIDTH, dimensions.WALL_HEIGHT, color);    // Top wall

        const bottomWallY = position.Y + dimensions.LANE_WIDTH;
        this.createWall(position.X, bottomWallY, dimensions.WALL_WIDTH, dimensions.WALL_HEIGHT, color); // Bottom wall

        const leftWallX = position.X - dimensions.WALL_WIDTH/2;
        const leftWallY = position.Y + dimensions.LANE_WIDTH/2;
        const leftWallHeight = dimensions.WALL_HEIGHT + dimensions.LANE_WIDTH;
        this.createWall(leftWallX, leftWallY, dimensions.WALL_HEIGHT, leftWallHeight, color);    // Left wall


        // Create the goal (open square to get the ball into, positioned in the left center of the lane)
        const horizontalGoalX = position.X - dimensions.WALL_WIDTH/3;
        const horizontalGoalWidth = dimensions.WALL_WIDTH/10;

        const topGoalY = position.Y + (2 * dimensions.LANE_WIDTH)/3;
        this.createWall(horizontalGoalX, topGoalY, horizontalGoalWidth, dimensions.WALL_HEIGHT, color); // Top wall

        const bottomGoalY = position.Y + dimensions.LANE_WIDTH/3;
        this.createWall(horizontalGoalX, bottomGoalY, horizontalGoalWidth, dimensions.WALL_HEIGHT, color); // Bottom wall

        const leftGoalX = position.X - dimensions.WALL_WIDTH/3 - horizontalGoalWidth/2;
        const leftGoalY = position.Y + dimensions.LANE_WIDTH/2;
        const leftGoalHeight = dimensions.WALL_HEIGHT + dimensions.LANE_WIDTH/3;
        this.createWall(leftGoalX, leftGoalY, dimensions.WALL_HEIGHT, leftGoalHeight, color);    // Left wall


        // Create the lane obsticales (balls scattered across the inside)
        const adjustedWallWidth = dimensions.WALL_WIDTH/3 // Diving by three to make the pins spawn 1/3 into the area rather than right at the start
        this.createPins(position.X, position.Y, adjustedWallWidth, dimensions.LANE_WIDTH, obstacle.ROWS, obstacle.SPACING, obstacle.BALL_TYPE)
        

        // Create the ball (positioned in the middle of the lane, at the right end of the walls)
        const ballX = position.X + dimensions.WALL_WIDTH/2 - obstacle.BALL_TYPE.RADIUS;
        const ballY = position.Y + dimensions.LANE_WIDTH/2;
        this.createBall(ballX, ballY, ballConfig.DEFAULT);
    }
    //#endregion




    //#region Help functions
    createWall(x, y, width, height, color){
        const wall = new Wall(this.wallsContainer, this.physics, x, y, width, height, color);
        wall.init();
        this.walls.push(wall);
    }

    createBall(x, y, settings){
        const ball = new Ball(this.ballsContainer, this.physics, x, y, settings.RADIUS, settings.COLOR, settings.PHYSICS);
        ball.init();
        this.balls.push(ball);
    }

    createPins(x, y, wallWidth, laneWidth, pinRows, pinSpacing, pinType){
        for (let row = pinRows; row > 0; row--) {
            // Calculate horizontal position for this row
            const rowXOffset = (pinRows - row) * pinSpacing;
            
            // Create pins in current row
            for (let pin = 1; pin <= row; pin++) {
                // Calculate vertical spacing for pins in this row
                const pinYPosition = y + (pin * laneWidth) / (row + 1);
                
                // Calculate x position with proper centering
                const pinXPosition = x - wallWidth/2 + rowXOffset + pinType.RADIUS;
                
                this.createBall(pinXPosition, pinYPosition, pinType);
            }
        }
    }
    //#endregion
    


    update(deltaTime) {
        // Update balls
        this.balls.forEach(ball => {
            ball.update(deltaTime);
        });
        
    }
}

// Export as a singleton
const Playground = new PlaygroundManager();
export default Playground;