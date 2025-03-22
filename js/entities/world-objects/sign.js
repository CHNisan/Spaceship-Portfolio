import Entity from '../main/entity.js';
import config from '../../config/index.js';

const { 
    sign: signConfig,
    theme: themeConfig 
} = config;

export default class Sign extends Entity {
    constructor(container, x, y, size, wrapWidth, text, fontWeight = "normal", align = signConfig.FONT.ALIGN, fontFamily = signConfig.FONT.FAMILY, darkColor = themeConfig.MAIN.DARK.PRIMARY, lightColor = themeConfig.MAIN.LIGHT.PRIMARY) {
        super(container); // Constructs graphics, position and rotation
        this.x = x;
        this.y = y;
        this.size = size;
        this.wrapWidth = wrapWidth;
        this.text = text;
        this.fontWeight = fontWeight;
        this.align = align;
        this.fontFamily = fontFamily;
        this.lightColor = lightColor; // Light mode color
        this.darkColor = darkColor; // Dark mode color

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