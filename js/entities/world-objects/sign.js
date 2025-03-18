import Entity from '../entity.js';
import config from '../../config/index.js';

const { 
    sign: signConfig,
    theme: themeConfig 
} = config;

export default class Sign extends Entity {
    constructor(container, x, y, size, wrapWidth, text, fontWeight = "normal", align = signConfig.FONT.ALIGN, fontFamily = signConfig.FONT.FAMILY, darkColor = themeConfig.MAIN.DARK.PRIMARY, lightColor = themeConfig.MAIN.LIGHT.PRIMARY) {
        super(container);
        this.x = x;
        this.y = y;
        this.size = size;
        this.wrapWidth = wrapWidth;
        this.text = text;
        this.fontWeight = fontWeight;
        this.align = align;
        this.fontFamily = fontFamily;
        this.lightColor = lightColor;
        this.darkColor = darkColor;

        // Keeps track of whether dark mode is active to change the color of the text acordingly
        this.isDarkMode = false;

        this.registerWithInputManager()
    }
    
    createGraphic() {
        this.graphic = new PIXI.Text(this.text, {
            fontFamily: this.fontFamily,
            fontSize: this.size,
            fill: this.darkColor,
            fontWeight: this.fontWeight,
            align: this.align,
            wordWrap: true,
            wordWrapWidth: this.wrapWidth
        });

        this.graphic.anchor.set(0.5);
        this.graphic.resolution = signConfig.FONT.RESOLUTION;
        this.graphic.position.set(this.x, this.y);
    }

    registerWithInputManager() {
        // Listen for the dark mode toggle event
        document.addEventListener('game:darkModeToggle', () => {
            this.toggleDarkMode();
        });
    }
    
    toggleDarkMode() {
        // Flip color to the light and dark mode versions depending on whether dark mode is active
        this.isDarkMode = !this.isDarkMode;

        if(this.isDarkMode){
            this.graphic.style.fill = this.lightColor;
        }
        else{
            this.graphic.style.fill = this.darkColor;
        }
    }
}