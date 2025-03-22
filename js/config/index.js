// Main config file that exports all configuration modules

import camera from './core/camera.js';
import physics from './core/physics.js';
import theme from './core/theme.js';
import world from './core/world.js';

import ship from './entities/ship.js';

import ball from './entities/playground-objects/ball.js';
import playground from './entities/playground-objects/playground.js';

import asteroid from './entities/world-objects/asteroid.js';
import poi from './entities/world-objects/poi.js';
import sign from './entities/world-objects/sign.js';
import socialMediaButton from './entities/world-objects/socialMediaButton.js'

import ui from './ui/ui.js';


export default {
    camera,
    physics,
    theme,
    world,

    ship,

    ball,
    playground,

    asteroid,
    poi,
    sign,
    socialMediaButton,

    ui
};

export {
    camera,
    physics,
    theme,
    world,

    ship,

    ball,
    playground,

    asteroid,
    poi,
    sign,
    socialMediaButton,
    
    ui
};