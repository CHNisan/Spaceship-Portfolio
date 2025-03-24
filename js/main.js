import Game from './game.js';

// Entry point for the application
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    
    game.init();

    // PIXI.js devtools
    window.__PIXI_DEVTOOLS__ = {
      app: game.app,
      renderer: game.myRenderer,
      stage: game.myStage,
    };
});