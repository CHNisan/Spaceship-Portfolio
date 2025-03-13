// Intro screen for the spaceship game
import config from '../config/index.js';

const { ui: uiConfig } = config;

export default class IntroScreen {
    constructor(app, onStartCallback) {
        this.app = app;
        this.onStartCallback = onStartCallback;
        this.container = new PIXI.Container();
        this.backgroundOverlay = null;
        this.titleText = null;
        this.subtitleText = null;
        this.startButton = null;
        
        // Animation properties
        this.buttonBorder = null;
        this.targetBorderAlpha = 0;
        this.fadeSpeed = uiConfig.INTRO.BUTTON.ANIMATION.FADE_SPEED;
        
        // Fade-out animation
        this.isFadingOut = false;
        this.fadeOutSpeed = uiConfig.INTRO.ANIMATION.FADE_OUT_SPEED;
    }
    
    init() {
        // Create an invisable overlay to give the container a width and height (otherwise the other elements won't show)
        this.backgroundOverlay = new PIXI.Graphics();
        this.backgroundOverlay.beginFill(0x000000, 0.0001); 
        this.backgroundOverlay.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        this.backgroundOverlay.endFill();
        this.container.addChild(this.backgroundOverlay);
        
        // Create title text
        this.titleText = new PIXI.Text(uiConfig.INTRO.TITLE.TEXT, {
            fontFamily: uiConfig.INTRO.TITLE.FONT_FAMILY,
            fontSize: uiConfig.INTRO.TITLE.FONT_SIZE,
            fontWeight: 'bold',
            fill: uiConfig.INTRO.TITLE.COLOR,
            align: 'center'
        });
        this.titleText.anchor.set(0.5);
        this.titleText.position.set(
            this.app.screen.width * uiConfig.INTRO.TITLE.POSITION.X_PERCENT, 
            this.app.screen.height * uiConfig.INTRO.TITLE.POSITION.Y_PERCENT
        );
        this.container.addChild(this.titleText);
        
        // Create subtitle text
        this.subtitleText = new PIXI.Text(uiConfig.INTRO.SUBTITLE.TEXT, {
            fontFamily: uiConfig.INTRO.SUBTITLE.FONT_FAMILY,
            fontSize: uiConfig.INTRO.SUBTITLE.FONT_SIZE,
            fontWeight: 'bold',
            fill: uiConfig.INTRO.SUBTITLE.COLOR,
            align: 'center'
        });
        this.subtitleText.anchor.set(0.5);
        this.subtitleText.position.set(
            this.app.screen.width * uiConfig.INTRO.SUBTITLE.POSITION.X_PERCENT, 
            this.titleText.position.y + uiConfig.INTRO.SUBTITLE.POSITION.Y_OFFSET
        );
        this.container.addChild(this.subtitleText);
        
        // Create START button
        this.startButton = new PIXI.Container();
        this.startButton.position.set(
            this.app.screen.width * uiConfig.INTRO.BUTTON.POSITION.X_PERCENT, 
            this.app.screen.height * uiConfig.INTRO.BUTTON.POSITION.Y_PERCENT
        );
        
        // Create button border (invisible initially)
        this.buttonBorder = new PIXI.Graphics();
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
        this.buttonBorder.alpha = 0; // Initially invisible
        
        // Create button text (grey text like the title)
        const buttonText = new PIXI.Text(uiConfig.INTRO.BUTTON.TEXT, {
            fontFamily: uiConfig.INTRO.BUTTON.FONT_FAMILY,
            fontSize: uiConfig.INTRO.BUTTON.FONT_SIZE,
            fontWeight: 'bold',
            fill: uiConfig.INTRO.BUTTON.COLOR
        });
        buttonText.anchor.set(0.5);
        
        this.startButton.addChild(this.buttonBorder);
        this.startButton.addChild(buttonText);
        this.container.addChild(this.startButton);
        
        // Set up animation ticker
        this.app.ticker.add(this.updateAnimation, this);
        
        // Make button interactive
        this.startButton.eventMode = 'static';
        this.startButton.cursor = 'pointer';
        
        // Add hover effect
        this.startButton.on('pointerover', () => {
            this.targetBorderAlpha = 1; // Target full opacity
            this.startButton.scale.set(uiConfig.INTRO.BUTTON.ANIMATION.SCALE); // Scaled size
        });
        
        this.startButton.on('pointerout', () => {
            this.targetBorderAlpha = 0; // Target invisible
            this.startButton.scale.set(1); // Back to original size
        });
        
        // Add click handler
        this.startButton.on('pointerdown', (event) => {
            // Stop propagation to prevent the event from triggering ship thrust
            event.stopPropagation();
            
            // Start the fade-out animation
            this.startFadeOut();
        });
        
        // Make sure container is positioned correctly
        this.container.position.set(0, 0);
        this.container.width = this.app.screen.width;
        this.container.height = this.app.screen.height;
        
        return this.container;
    }
    
    show() {
        this.app.stage.addChild(this.container);
        this.handleResize(); // Ensure proper sizing
    }
    
    updateAnimation() {
        // Animate border alpha
        if (this.buttonBorder) {
            const currentAlpha = this.buttonBorder.alpha;
            
            if (currentAlpha !== this.targetBorderAlpha) {
                if (currentAlpha < this.targetBorderAlpha) {
                    // Fade in
                    this.buttonBorder.alpha = Math.min(currentAlpha + this.fadeSpeed, this.targetBorderAlpha);
                } else {
                    // Fade out
                    this.buttonBorder.alpha = Math.max(currentAlpha - this.fadeSpeed, this.targetBorderAlpha);
                }
            }
        }
        
        // Handle screen fade-out animation
        if (this.isFadingOut) {
            if (this.container.alpha > 0) {
                this.container.alpha -= this.fadeOutSpeed;
                
                if (this.container.alpha <= 0) {
                    // Animation complete
                    this.container.alpha = 0;
                    this.isFadingOut = false;
                    this.hide();
                }
            }
        }
    }
    
    startFadeOut() {
        // Start the fade-out animation
        this.isFadingOut = true;
        
        // Disable button interaction during fade-out
        this.startButton.eventMode = 'none';
    }
    
    hide() {
        // Remove from stage after fade completes
        if (this.container.parent) {
            this.container.parent.removeChild(this.container);
        }
        
        // Call the callback
        if (this.onStartCallback) {
            this.onStartCallback();
        }
        
        // Clean up ticker
        this.app.ticker.remove(this.updateAnimation, this);
    }
}