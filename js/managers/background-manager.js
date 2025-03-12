import GradientBackground from '../shaders/gradient-background.js';
import config from '../config/index.js';

const { world: worldConfig } = config;

export default class BackgroundManager {
    constructor(app) {
        this.app = app;
        this.isDarkMode = false;
        this.gradientBackground = null;
    }
    
    init() {
        this.gradientBackground = new GradientBackground(this.app, {
            topColor: worldConfig.BACKGROUND.TOP_COLOR,
            bottomColor: worldConfig.BACKGROUND.BOTTOM_COLOR,
            angleInDegrees: worldConfig.BACKGROUND.ANGLE
        });

        this.setupKeyboardHandlers();
        
        return this.gradientBackground.create();
    }

    setupKeyboardHandlers() {
        // Add keyboard event listener for key presses
        window.addEventListener('keydown', (event) => {
            // Toggle dark mode when 'd' key is pressed
            if (event.key === 'd' || event.key === 'D') {
                this.toggleDarkMode();
            }
        });
    }
    
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        
        if (this.isDarkMode) {
            this.gradientBackground.updateColors(
                worldConfig.BACKGROUND.DARK_TOP_COLOR,
                worldConfig.BACKGROUND.DARK_BOTTOM_COLOR
            );
        } else {
            this.gradientBackground.updateColors(
                worldConfig.BACKGROUND.TOP_COLOR,
                worldConfig.BACKGROUND.BOTTOM_COLOR
            );
        }
    }
}