import config from '../config/index.js';

const { ui: uiConfig, poi: poiConfig } = config;

export default class PopupManager {
    constructor(container) {
        this.container = container;
        this.popupContainer = new PIXI.Container();
        this.container.addChild(this.popupContainer);
        
        this.activePopup = null;
        this.poiImages = {};
        
        this.popupAnimationSpeed = uiConfig.POPUP.ANIMATION_SPEED;
        this.fadeInProgress = false;
        this.fadeOutProgress = false;
    }
    
    init(poiData) {
        this.createPlaceholderImages(poiData);
    }
    
    createPlaceholderImages(poiData) {
        // Create placeholder sprites for each POI
        poiData.forEach(poi => {
            // Create a sprite using a simple colored rectangle
            const sprite = new PIXI.Graphics();
            sprite.beginFill(poi.color, 0.9);
            sprite.lineStyle(2, 0xFFFFFF);
            sprite.drawRect(0, 0, 220, 80);
            sprite.endFill();
            
            // Add a label
            const label = new PIXI.Text(poi.title, {
                fontFamily: uiConfig.TEXT.TITLE.FONT_FAMILY,
                fontSize: uiConfig.TEXT.TITLE.FONT_SIZE,
                fontWeight: uiConfig.TEXT.TITLE.FONT_WEIGHT,
                fill: uiConfig.TEXT.TITLE.COLOR,
                align: 'center'
            });
            label.resolution = poiConfig.FONT.RESOLUTION;
            label.anchor.set(0.5);
            label.position.set(110, 40);
            sprite.addChild(label);
            
            this.poiImages[poi.imageKey] = sprite;
        });
    }
    
    showPopupForPOI(poiData) {
        // If fading out, cancel that animation
        if (this.fadeOutProgress && this.activePopup) {
            this.popupContainer.removeChild(this.activePopup);
            this.activePopup = null;
            this.fadeOutProgress = false;
        }
        
        // Create popup container
        const popup = new PIXI.Container();
        this.popupContainer.addChild(popup);
        this.activePopup = popup;
        
        // Set initial alpha to 0 for fade-in effect
        popup.alpha = 0;
        this.fadeInProgress = true;
        
        // Position popup next to the POI
        const offsetX = poiData.width / 2 + uiConfig.POPUP.POSITION.OFFSET_X;
        const offsetY = -poiData.height / 2 + uiConfig.POPUP.POSITION.OFFSET_Y;
        popup.position.set(poiData.x + offsetX, poiData.y + offsetY);
        
        // Create popup background
        const popupWidth = uiConfig.POPUP.WIDTH;
        const popupHeight = uiConfig.POPUP.HEIGHT;
        const background = new PIXI.Graphics();
        background.beginFill(
            uiConfig.POPUP.BACKGROUND.COLOR, 
            uiConfig.POPUP.BACKGROUND.ALPHA
        );
        background.lineStyle(
            uiConfig.POPUP.BORDER.WIDTH, 
            uiConfig.POPUP.BORDER.COLOR
        );
        background.drawRoundedRect(
            0, 
            0, 
            popupWidth, 
            popupHeight, 
            uiConfig.POPUP.CORNER_RADIUS
        );
        background.endFill();
        popup.addChild(background);
        
        // Add title
        const title = new PIXI.Text(poiData.title, {
            fontFamily: uiConfig.TEXT.TITLE.FONT_FAMILY,
            fontSize: uiConfig.TEXT.TITLE.FONT_SIZE,
            fontWeight: uiConfig.TEXT.TITLE.FONT_WEIGHT,
            fill: uiConfig.TEXT.TITLE.COLOR,
            align: 'center',
            wordWrap: true,
            wordWrapWidth: popupWidth - 20
        });
        title.resolution = poiConfig.FONT.RESOLUTION;
        title.position.set(
            uiConfig.TEXT.TITLE.POSITION.X, 
            uiConfig.TEXT.TITLE.POSITION.Y
        );
        popup.addChild(title);
        
        // Add description text
        const description = new PIXI.Text(poiData.description, {
            fontFamily: uiConfig.TEXT.DESCRIPTION.FONT_FAMILY,
            fontSize: uiConfig.TEXT.DESCRIPTION.FONT_SIZE,
            fill: uiConfig.TEXT.DESCRIPTION.COLOR,
            align: 'left',
            wordWrap: true,
            wordWrapWidth: popupWidth - 20
        });
        description.resolution = poiConfig.FONT.RESOLUTION;
        description.position.set(
            uiConfig.TEXT.DESCRIPTION.POSITION.X, 
            uiConfig.TEXT.DESCRIPTION.POSITION.Y
        );
        popup.addChild(description);
        
        // Add image
        const image = this.poiImages[poiData.imageKey].clone();
        image.scale.set(uiConfig.IMAGE.SCALE, uiConfig.IMAGE.SCALE);
        image.position.set(
            uiConfig.IMAGE.POSITION.X, 
            popupHeight - uiConfig.IMAGE.POSITION.Y
        );
        popup.addChild(image);
    }
    
    hidePopup() {
        if (this.activePopup) {
            // Start fade-out animation
            this.fadeOutProgress = true;
            this.fadeInProgress = false;
        }
    }
    
    update() {
        if (!this.activePopup) return;
        
        if (this.fadeInProgress) {
            // Fade in animation
            this.activePopup.alpha += this.popupAnimationSpeed;
            
            // Check if fade-in is complete
            if (this.activePopup.alpha >= 1) {
                this.activePopup.alpha = 1;
                this.fadeInProgress = false;
            }
        } 
        else if (this.fadeOutProgress) {
            // Fade out animation
            this.activePopup.alpha -= this.popupAnimationSpeed;
            
            // Check if fade-out is complete
            if (this.activePopup.alpha <= 0) {
                // Remove popup when fully transparent
                this.popupContainer.removeChild(this.activePopup);
                this.activePopup = null;
                this.fadeOutProgress = false;
            }
        }
    }
}