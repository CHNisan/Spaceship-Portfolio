// Import namespace first to initialize global SpaceGame object
import './namespace.js';

// Now import game modules
// These will also add themselves to window.SpaceGame for backward compatibility
import './physics.js';
import './camera.js'; 
import './entities.js';
import './input.js';
import Game from './game.js';

// Entry point for the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game
    Game.init();
});