import GradientBackground from '../shaders/gradient-background.js';
import config from '../config/index.js';

const { 
    world: worldConfig,
    theme: themeConfig
 } = config;

export default class BackgroundManager {
    constructor(app) {
        this.app = app;
        this.isDarkMode = false;
        this.gradientBackground = null;
    }
    
    init() {
        this.registerWithInputManager();

        this.gradientBackground = new GradientBackground(this.app, {
            topColor: themeConfig.MAIN.LIGHT.PRIMARY,
            bottomColor: themeConfig.MAIN.LIGHT.SECONDARY,
            angleInDegrees: worldConfig.BACKGROUND.ANGLE
        });
        
        return this.gradientBackground.create();
    }

    registerWithInputManager() {
        // Listen for the dark mode toggle event
        document.addEventListener('game:darkModeToggle', () => {
            this.toggleDarkMode();
        });
    }
    
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        
        if (this.isDarkMode) {
            this.gradientBackground.updateColors(
                themeConfig.MAIN.DARK.PRIMARY,
                themeConfig.MAIN.DARK.SECONDARY
            );
        } else {
            this.gradientBackground.updateColors(
                themeConfig.MAIN.LIGHT.PRIMARY,
                themeConfig.MAIN.LIGHT.SECONDARY
            );
        }
    }
}