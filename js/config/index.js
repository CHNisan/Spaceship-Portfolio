// Main config file that exports all configuration modules

import world from './world.js';
import physics from './physics.js';
import ship from './ship.js';
import camera from './camera.js';
import entities from './entities.js';
import poi from './poi.js';
import ui from './ui.js';
import theme from './theme.js'
import sign from './sign.js'
import ball from './ball.js'

// Export all configurations
export default {
    world,
    physics,
    ship,
    camera,
    entities,
    poi,
    ui,
    theme,
    sign,
    ball
};

// Also export individual configs for direct imports
export {
    world,
    physics,
    ship,
    camera,
    entities,
    poi,
    ui,
    theme,
    sign,
    ball
};