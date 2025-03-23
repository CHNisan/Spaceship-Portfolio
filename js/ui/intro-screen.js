// Intro screen for the spaceship game
import config from '../config/index.js';

const { ui: uiConfig } = config;

export default class IntroScreen {
    constructor(app, onStartCallback) {
        // Core properties
        this.app = app;
        this.onStartCallback = onStartCallback; // Callback function for when start is clicked
        this.container = new PIXI.Container();
        
        // UI elements
        this.backgroundOverlay = null;
        this.titleText = null;
        this.subtitleText = null;
        this.startButton = null;
        this.buttonBorder = null;
        
        // Animation properties
        this.targetBorderAlpha = 0; // Target alpha to lerp to in animaiton
        this.fadeSpeed = uiConfig.INTRO.BUTTON.ANIMATION.FADE_SPEED;
        this.fadeOutSpeed = uiConfig.INTRO.ANIMATION.FADE_OUT_SPEED;
        this.isFadingOut = false;
    }
    
    //#region Setup
    init() {
        this.createBackgroundOverlay();
        this.createTitleElements();
        this.createStartButton();
        this.setupEventHandlers();
        this.setupAnimationTicker();
        this.positionContainer();
        
        window.addEventListener('resize', this.handleResize);
        
        return this.container;
    }
    
    // Adds an invisible background overlay to add width and height to the container (the contain will have a width and height of zero without it)
    createBackgroundOverlay() {
        this.backgroundOverlay = new PIXI.Graphics();
        this.backgroundOverlay.beginFill(0x000000, 0.0001); 
        this.backgroundOverlay.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        this.backgroundOverlay.endFill();
        this.container.addChild(this.backgroundOverlay);
    }
    //#endregion
    


    //#region Titles
    createTitleElements() {
        // Create title text
        this.titleText = this.createText(
            uiConfig.INTRO.TITLE.TEXT, 
            {
                fontFamily: uiConfig.INTRO.TITLE.FONT_FAMILY,
                fontSize: uiConfig.INTRO.TITLE.FONT_SIZE,
                fontWeight: 'bold',
                fill: uiConfig.INTRO.TITLE.COLOR,
                align: 'center'
            }
        );
        
        this.titleText.position.set(
            this.app.screen.width * uiConfig.INTRO.TITLE.POSITION.X_PERCENT, 
            this.app.screen.height * uiConfig.INTRO.TITLE.POSITION.Y_PERCENT
        );
        this.container.addChild(this.titleText);
        

        // Create subtitle text
        this.subtitleText = this.createText(
            uiConfig.INTRO.SUBTITLE.TEXT, 
            {
                fontFamily: uiConfig.INTRO.SUBTITLE.FONT_FAMILY,
                fontSize: uiConfig.INTRO.SUBTITLE.FONT_SIZE,
                fontWeight: 'bold',
                fill: uiConfig.INTRO.SUBTITLE.COLOR,
                align: 'center'
            }
        );
        
        this.subtitleText.position.set(
            this.app.screen.width * uiConfig.INTRO.SUBTITLE.POSITION.X_PERCENT, 
            this.titleText.position.y + uiConfig.INTRO.SUBTITLE.POSITION.Y_OFFSET // y offest from the title text
        );
        this.container.addChild(this.subtitleText);
    }
    
    createText(content, style) {
        const text = new PIXI.Text(content, style);
        text.anchor.set(0.5);
        return text;
    }
    //#endregion


    
    //#region Button creation
    createStartButton() {
        this.startButton = new PIXI.Container();
        this.startButton.position.set(
            this.app.screen.width * uiConfig.INTRO.BUTTON.POSITION.X_PERCENT, 
            this.app.screen.height * uiConfig.INTRO.BUTTON.POSITION.Y_PERCENT
        );
        
        // Create button border (invisible initially)
        this.buttonBorder = new PIXI.Graphics();
        this.updateButtonBorder();
        this.buttonBorder.alpha = 0; 
        
        // Create button text
        const buttonText = this.createText(
            uiConfig.INTRO.BUTTON.TEXT, 
            {
                fontFamily: uiConfig.INTRO.BUTTON.FONT_FAMILY,
                fontSize: uiConfig.INTRO.BUTTON.FONT_SIZE,
                fontWeight: 'bold',
                fill: uiConfig.INTRO.BUTTON.COLOR
            }
        );
        
        this.startButton.addChild(this.buttonBorder);
        this.startButton.addChild(buttonText);
        this.container.addChild(this.startButton);
    }
    
    // Draw or redraw the button border
    updateButtonBorder() {
        this.buttonBorder.clear();
        this.buttonBorder.lineStyle(
            uiConfig.INTRO.BUTTON.BORDER.WIDTH, 
            uiConfig.INTRO.BUTTON.BORDER.COLOR
        );
        this.buttonBorder.drawRoundedRect(
            -uiConfig.INTRO.BUTTON.BORDER.BOX_WIDTH/2, 
            -uiConfig.INTRO.BUTTON.BORDER.BOX_HEIGHT/2, 
            uiConfig.INTRO.BUTTON.BORDER.BOX_WIDTH, 
            uiConfig.INTRO.BUTTON.BORDER.BOX_HEIGHT, 
            uiConfig.INTRO.BUTTON.BORDER.RADIUS
        );
    }
    //#endregion


    
    //#region Even handling
    setupEventHandlers() {
        // Make button interactive
        this.startButton.eventMode = 'static';
        this.startButton.cursor = 'pointer';
        
        // Add hover effect
        this.startButton.on('pointerover', this.handleButtonHoverIn);
        this.startButton.on('pointerout', this.handleButtonHoverOut);
        
        // Add click handler
        this.startButton.on('pointerdown', this.handleButtonClick);
    }
    
    handleButtonHoverIn = () => {
        this.targetBorderAlpha = 1;
        this.startButton.scale.set(uiConfig.INTRO.BUTTON.ANIMATION.SCALE);
    }
    
    handleButtonHoverOut = () => {
        this.targetBorderAlpha = 0; 
        this.startButton.scale.set(1); 
    }
    
    handleButtonClick = (event) => {
        // Stop propagation to prevent the event from triggering ship thrust
        event.stopPropagation();
        
        this.startFadeOut();
    }
    //#endregion
    


    //#region Animation
    setupAnimationTicker() {
        this.app.ticker.add(this.updateAnimation);
    }

    updateAnimation = () => {
        this.updateButtonAnimation();
        this.updateFadeOutAnimation();
    }
    
    updateButtonAnimation() {
        if (this.buttonBorder) {
            const currentAlpha = this.buttonBorder.alpha;
            
            if (currentAlpha !== this.targetBorderAlpha) {
                // Lerp to new target alpha follwing fade speed
                if (currentAlpha < this.targetBorderAlpha) {
                    // Fade in
                    this.buttonBorder.alpha = Math.min(currentAlpha + this.fadeSpeed, this.targetBorderAlpha); // Math.min to set the border alpha back to the target alpha if the fadeSpeed step is too large and casuses it to go over
                } else {
                    // Fade out
                    this.buttonBorder.alpha = Math.max(currentAlpha - this.fadeSpeed, this.targetBorderAlpha); // Math.max to set the border alpha back to the target alpha if the fadeSpeed step is too large and casuses it to go under
                }
            }
        }
    }
    
    updateFadeOutAnimation() {
    // Fade out animation of the whole screeen
        if (this.isFadingOut && this.container.alpha > 0) {
            this.container.alpha -= this.fadeOutSpeed;
            
            if (this.container.alpha <= 0) {
                // Animation complete
                this.container.alpha = 0;
                this.isFadingOut = false;
                this.hide();
            }
        }
    }
    
    startFadeOut() {
        this.isFadingOut = true;
        
        // Disable button interaction during fade-out
        this.startButton.eventMode = 'none';
    }
    //#endregion


    
    //#region Display handlers
    positionContainer() {
        this.container.position.set(0, 0);
        this.container.width = this.app.screen.width;
        this.container.height = this.app.screen.height;
    }
    
    // Handle window resize events
    handleResize = () => {
        // Update background overlay size
        this.backgroundOverlay.clear();
        this.backgroundOverlay.beginFill(0x000000, 0.0001);
        this.backgroundOverlay.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        this.backgroundOverlay.endFill();
        
        // Update positions of elements
        this.titleText.position.set(
            this.app.screen.width * uiConfig.INTRO.TITLE.POSITION.X_PERCENT, 
            this.app.screen.height * uiConfig.INTRO.TITLE.POSITION.Y_PERCENT
        );
        
        this.subtitleText.position.set(
            this.app.screen.width * uiConfig.INTRO.SUBTITLE.POSITION.X_PERCENT, 
            this.titleText.position.y + uiConfig.INTRO.SUBTITLE.POSITION.Y_OFFSET // y offest from the title text
        );
        
        this.startButton.position.set(
            this.app.screen.width * uiConfig.INTRO.BUTTON.POSITION.X_PERCENT, 
            this.app.screen.height * uiConfig.INTRO.BUTTON.POSITION.Y_PERCENT
        );
        
        // Update container dimensions
        this.container.width = this.app.screen.width;
        this.container.height = this.app.screen.height;
    }
    
    show() {
        this.app.stage.addChild(this.container);
        this.handleResize();
    }
    
    hide() {
        // Remove from stage after fade completes
        if (this.container.parent) {
            this.container.parent.removeChild(this.container);
        }
        
        // Clean up event listeners
        window.removeEventListener('resize', this.handleResize);
        this.app.ticker.remove(this.updateAnimation);
        
        // Call the callback
        if (this.onStartCallback) {
            this.onStartCallback();
        }
    }
    
    // Clean up resources when intro screen is no longer needed
    destroy() {
        window.removeEventListener('resize', this.handleResize);
        this.app.ticker.remove(this.updateAnimation);
        
        if (this.container.parent) {
            this.container.parent.removeChild(this.container);
        }

        if (this.startButton) {
            this.startButton.removeAllListeners();
        }

        this.container.destroy({ children: true });
    }
    //#endregion
}