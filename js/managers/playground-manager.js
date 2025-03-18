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
    
    init(container, physics) {
        this.container = container;
        this.physics = physics;
        
        this.createContainers();

        this.createBowling(-1400, 580, 1000, 10, 400, 75, 15, 75, themeConfig.COLORS.BLUE, themeConfig.COLORS.RED);
    }
    
    createContainers() {
        this.wallsContainer = new PIXI.Container();
        this.ballsContainer = new PIXI.Container();

        this.container.addChild(this.wallsContainer);
        this.container.addChild(this.ballsContainer);
    }
    


    createBowling(x, y, width, height, areaGap, ballRadius, pinRadius, pinGap, wallColor, ballColor) {
        // Paramenters so the bowling area can be moved/resized as one while maintaining its layout

        // Create bowling area
        this.createWall(x, y, width, height, wallColor);
        this.createWall(x, y + areaGap + 2*height, width, height, wallColor);

        // Create bowling ball
        this.createBall(x + width/2 - ballRadius, y + areaGap/2, ballRadius, ballColor, ballConfig.BOWLING);

        // Create pins
        let xGap = pinGap
        for (let i = 6; i > 0; i--) {
            for (let j = 1; j <= i; j++){
                this.createBall(x - width/2 + xGap + pinRadius, y + (j * areaGap)/(i+1), pinRadius, ballColor, ballConfig.PIN);
            }
            xGap += pinGap
          }
    }

    createBallInHole(){

    }

    createRacetrack(){

    }



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