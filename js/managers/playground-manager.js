import Wall from '../entities/world-objects/wall.js';
import Ball from '../entities/playground-objects/ball.js';
import config from '../config/index.js';

const { 
    theme: themeConfig,
    ball: ballConfig
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

        this.createBowling(
            -1400, 580, 1000, 10, 400, themeConfig.COLORS.BLUE, // Walls
            75, themeConfig.COLORS.RED, // Ball
            15, 6, 75, themeConfig.COLORS.RED // Pins
        );
    }
    
    createContainers() {
        this.wallsContainer = new PIXI.Container();
        this.ballsContainer = new PIXI.Container();

        this.container.addChild(this.wallsContainer);
        this.container.addChild(this.ballsContainer);
    }
    //#endregion
    


    // #region Bowling
    createBowling(x, y, wallWidth, wallHeight, laneWidth, wallColor, ballRadius, ballColor, pinRadius, pinRows, pinSpacing, pinColor) {
        // Create a bowling lane with walls, ball, and pins that maintains its layout when moved or resized
        
        // Create the lane boundaries (top and bottom walls)
        const topWallY = y;
        const bottomWallY = y + laneWidth + 2 * wallHeight;
        this.createWall(x, topWallY, wallWidth, wallHeight, wallColor);    // Top wall
        this.createWall(x, bottomWallY, wallWidth, wallHeight, wallColor); // Bottom wall
        

        // Create the bowling ball (positioned in the middle of the lane, at the right end of the walls)
        const ballX = x + wallWidth/2 - ballRadius;
        const ballY = y + laneWidth/2;
        this.createBall(ballX, ballY, ballRadius, ballColor, ballConfig.BOWLING);
        

        // Create pins (positioned in the middle of the lane, at the left end of the walls)
        this.createPins(x, y, wallWidth, laneWidth, pinRadius, pinRows, pinSpacing, pinColor);
    }

    createPins(x, y, wallWidth, laneWidth, radius, rows, spacing, color){
        for (let row = rows; row > 0; row--) {
            // Calculate horizontal position for this row
            const rowXOffset = (rows - row) * spacing;
            
            // Create pins in current row
            for (let pin = 1; pin <= row; pin++) {
                // Calculate vertical spacing for pins in this row
                const pinYPosition = y + (pin * laneWidth) / (row + 1);
                
                // Calculate x position with proper centering
                const pinXPosition = x - wallWidth/2 + rowXOffset + radius;
                
                this.createBall(
                    pinXPosition, pinYPosition, radius, color, ballConfig.PIN
                );
            }
        }
    }
    //#endregion


    
    createBallInHole(){

    }

    createRacetrack(){

    }

    

    //#region Help functions
    createWall(x, y, width, height, color){
        const wall = new Wall(this.wallsContainer, this.physics, x, y, width, height, color);
        wall.init();
        this.walls.push(wall);
    }

    createBall(x, y, radius, color, settings){
        const ball = new Ball(this.ballsContainer, this.physics, x, y, radius, color, settings);
        ball.init();
        this.balls.push(ball);
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