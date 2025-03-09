// Entry point for the application
import Game from './game.js';

// Entry point for the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game
    Game.init();

    // PIXI.js devtools
    window.__PIXI_DEVTOOLS__ = {
        app: Game.app,
        renderer: Game.myRenderer,
        stage: Game.myStage,
      };
});