import Entity from '../entity.js';
import config from '../../config/index.js';

const { 
    sign: signConfig,
    theme: themeConfig 
} = config;

export default class Sign extends Entity {
    constructor(container, x, y, size, wrapWidth, text, darkColor = themeConfig.MAIN.DARK.PRIMARY, lightColor = themeConfig.MAIN.LIGHT.PRIMARY) {
        super(container);
        this.x = x;
        this.y = y;
        this.size = size;
        this.wrapWidth = wrapWidth;
        this.text = text;
        this.lightColor = lightColor;
        this.darkColor = darkColor;

        this.isDarkMode = false;

        this.registerWithInputManager()
    }
    
    createGraphic() {
        this.graphic = new PIXI.Text(this.text, {
            fontFamily: signConfig.FONT.FAMILY,
            fontSize: this.size,
            fill: this.darkColor,
            align: signConfig.FONT.ALIGN,
            wordWrap: true,
            worldWrapWidth: this.worldWrapWidth
        });

        this.graphic.anchor.set(0.5);
        this.graphic.resolution = signConfig.FONT.RESOLUTION;
        this.graphic.position.x = this.x;
        this.graphic.position.y = this.y;
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
            this.graphic.style.fill = this.lightColor;
        }
        else{
            this.graphic.style.fill = this.darkColor;
        }
    }
}