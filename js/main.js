// Entry point for the application
import Game from './game.js';

// Entry point for the application
document.addEventListener('DOMContentLoaded', () => {
    // Create game instance
    const game = new Game();
    
    // Initialize game
    game.init();

    // PIXI.js devtools
    window.__PIXI_DEVTOOLS__ = {
      app: game.app,
      renderer: game.myRenderer,
      stage: game.myStage,
    };
});