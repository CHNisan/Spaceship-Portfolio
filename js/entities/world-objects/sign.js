import Entity from '../entity.js';
import config from '../../config/index.js';

const { 
    sign: signConfig,
    theme: themeConfig 
} = config;

export default class Sign extends Entity {
    constructor(container, x, y, size, wrapWidth, text) {
        super(container);
        this.x = x;
        this.y = y;
        this.size = size;
        this.wrapWidth = wrapWidth;
        this.text = text;
        this.isDarkMode = false;

        this.registerWithInputManager()
    }
    
    createGraphic() {
        this.graphic = new PIXI.Text(this.text, {
            fontFamily: signConfig.FONT.FAMILY,
            fontSize: this.size,
            fill: themeConfig.MAIN.DARK.PRIMARY,
            align: signConfig.FONT.ALIGN,
            wordWrap: true,
            worldWrapWidth: this.worldWrapWidth
        });

        this.graphic.anchor.set(0.5);
        this.graphic.resolution = signConfig.FONT.RESOLUTION;
    }

    registerWithInputManager() {
        // Listen for the dark mode toggle event
        document.addEventListener('game:darkModeToggle', () => {
            this.toggleDarkMode();
        });
    }
    
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;

        if(this.isDarkMode){
            this.graphic.style.fill = themeConfig.MAIN.LIGHT.PRIMARY;
        }
        else{
            this.graphic.style.fill = themeConfig.MAIN.DARK.PRIMARY;
        }
    }
}