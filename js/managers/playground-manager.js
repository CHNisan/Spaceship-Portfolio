import Wall from '../entities/world-objects/wall.js';
import Ball from '../entities/playground-objects/ball.js';
import config from '../config/index.js';

const { theme: themeConfig } = config;

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

        this.createBowling();
    }
    
    createContainers() {
        this.wallsContainer = new PIXI.Container();
        this.ballsContainer = new PIXI.Container();

        this.container.addChild(this.wallsContainer);
        this.container.addChild(this.ballsContainer);
    }
    


    createBowling() {
        // Create bowling area
        this.createWall(-1400, 580, 1000, 10, themeConfig.COLORS.BLUE);
        this.createWall(-1400, 1000, 1000, 10, themeConfig.COLORS.BLUE);

        const ball = new Ball(this.ballsContainer, this.physics, 400, 400, 100, themeConfig.COLORS.RED);
        ball.init();
        this.balls.push(ball);
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