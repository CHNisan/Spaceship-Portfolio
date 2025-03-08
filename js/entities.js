// Game entities (player ship, asteroids, stars, points of interest)
import config from './config/index.js';

// Import the specific configs we need
const { 
    world: worldConfig, 
    entities: entitiesConfig, 
    ship: shipConfig, 
    poi: poiConfig,
    ui: uiConfig
} = config;

const Entities = {
    container: null,
    ship: null,
    asteroids: null,
    stars: null,
    pointsOfInterest: null,
    physics: null,
    camera: null,
    
    // Use POI data from config
    poiData: poiConfig.ITEMS,
    
    // Points of interest animation parameters from config
    poiAnimationParams: poiConfig.ANIMATION,
    
    init(container, physics, camera) {
        this.container = container;
        this.physics = physics;
        this.camera = camera;
        
        this.createStars();
        this.createAsteroids();
        this.createSpaceship();
        this.createBoundaryVisual();
        this.createBackgroundClickArea();
        this.createPointsOfInterest();
        this.createPopupSystem();
    },
    
    // Set camera reference if not provided during init
    setCamera(camera) {
        this.camera = camera;
    },
    
    createStars() {
        this.stars = new PIXI.Container();
        this.container.addChild(this.stars);
        
        // Use star count and properties from config
        for (let i = 0; i < worldConfig.BACKGROUND.STARS.COUNT; i++) {
            const x = Math.random() * worldConfig.SIZE - worldConfig.SIZE / 2;
            const y = Math.random() * worldConfig.SIZE - worldConfig.SIZE / 2;
            
            // Use min/max size from config
            const size = Math.random() * 
                (worldConfig.BACKGROUND.STARS.MAX_SIZE - worldConfig.BACKGROUND.STARS.MIN_SIZE) + 
                worldConfig.BACKGROUND.STARS.MIN_SIZE;
            
            // Use min/max opacity from config
            const brightness = Math.random() * 
                (worldConfig.BACKGROUND.STARS.MAX_OPACITY - worldConfig.BACKGROUND.STARS.MIN_OPACITY) + 
                worldConfig.BACKGROUND.STARS.MIN_OPACITY;
            
            const star = new PIXI.Graphics();
            star.beginFill(0xFFFFFF, brightness);
            star.drawCircle(0, 0, size);
            star.endFill();
            star.position.set(x, y);
            
            this.stars.addChild(star);
        }
    },
    
    createAsteroids() {
        this.asteroids = new PIXI.Container();
        this.container.addChild(this.asteroids);
        
        // Use asteroid count from config
        for (let i = 0; i < entitiesConfig.ASTEROIDS.COUNT; i++) {
            // Ensure asteroids are not too close to the center where the ship spawns
            // and not inside any point of interest
            let x, y, isValidPosition;
            do {
                x = Math.random() * worldConfig.SIZE - worldConfig.SIZE / 2;
                y = Math.random() * worldConfig.SIZE - worldConfig.SIZE / 2;
                
                // Check if too close to ship spawn using safe radius from config
                isValidPosition = Math.sqrt(x*x + y*y) >= entitiesConfig.ASTEROIDS.SAFE_RADIUS;
                
                // Check if inside any POI (with buffer zone)
                if (isValidPosition) {
                    for (const poi of this.poiData) {
                        // Add buffer around POI for asteroid avoidance
                        const bufferX = poi.width * entitiesConfig.POI_BUFFER.X_MULTIPLIER;
                        const bufferY = poi.height * entitiesConfig.POI_BUFFER.Y_MULTIPLIER;
                        
                        if (x > poi.x - (poi.width/2 + bufferX) && 
                            x < poi.x + (poi.width/2 + bufferX) && 
                            y > poi.y - (poi.height/2 + bufferY) && 
                            y < poi.y + (poi.height/2 + bufferY)) {
                            isValidPosition = false;
                            break;
                        }
                    }
                }
            } while (!isValidPosition);
            
            // Use size range from config
            const size = Math.random() * 
                (entitiesConfig.ASTEROIDS.MAX_SIZE - entitiesConfig.ASTEROIDS.MIN_SIZE) + 
                entitiesConfig.ASTEROIDS.MIN_SIZE;
            
            // Use segment range from config
            const segments = Math.floor(Math.random() * 
                (entitiesConfig.ASTEROIDS.MAX_SEGMENTS - entitiesConfig.ASTEROIDS.MIN_SEGMENTS) + 
                entitiesConfig.ASTEROIDS.MIN_SEGMENTS);
            
            // Create jagged asteroid shape
            const asteroid = new PIXI.Graphics();
            asteroid.beginFill(entitiesConfig.ASTEROIDS.COLOR);
            
            const points = [];
            for (let j = 0; j < segments; j++) {
                const angle = (j / segments) * Math.PI * 2;
                const radius = size * (0.7 + Math.random() * 0.3);
                const px = Math.cos(angle) * radius;
                const py = Math.sin(angle) * radius;
                points.push({ x: px, y: py });
            }
            
            asteroid.moveTo(points[0].x, points[0].y);
            for (let j = 1; j < segments; j++) {
                asteroid.lineTo(points[j].x, points[j].y);
            }
            asteroid.lineTo(points[0].x, points[0].y);
            
            asteroid.endFill();
            asteroid.position.set(x, y);
            this.asteroids.addChild(asteroid);
            
            // Add physics body for asteroid
            const physicsPoints = points.map(p => ({ x: p.x, y: p.y }));
            const asteroidBody = this.physics.Bodies.fromVertices(x, y, [physicsPoints], {
                restitution: entitiesConfig.ASTEROIDS.PHYSICS.RESTITUTION,
                friction: entitiesConfig.ASTEROIDS.PHYSICS.FRICTION,
                density: entitiesConfig.ASTEROIDS.PHYSICS.DENSITY
            });
            
            if (asteroidBody) {
                this.physics.World.add(this.physics.world, asteroidBody);
                
                // Link graphic to physics body (for our own tracking)
                asteroid.physicsBody = asteroidBody;
            }
        }
    },
    
    createSpaceship() {
        // Create spaceship graphics
        this.ship = new PIXI.Container();
        this.container.addChild(this.ship);
        
        // Ship body with colors from config
        const shipGraphics = new PIXI.Graphics();
        shipGraphics.beginFill(shipConfig.VISUAL.BODY_COLOR);
        shipGraphics.moveTo(20, 0);
        shipGraphics.lineTo(-10, -10);
        shipGraphics.lineTo(-5, 0);
        shipGraphics.lineTo(-10, 10);
        shipGraphics.lineTo(20, 0);
        shipGraphics.endFill();
        this.ship.addChild(shipGraphics);
        
        // Ship engine glow using config colors and size
        const engineGlow = new PIXI.Graphics();
        engineGlow.beginFill(shipConfig.VISUAL.ENGINE_GLOW_COLOR);
        engineGlow.drawCircle(-7, 0, shipConfig.VISUAL.ENGINE_GLOW_SIZE);
        engineGlow.endFill();
        this.ship.addChild(engineGlow);
        this.ship.engineGlow = engineGlow;
        engineGlow.visible = false;
        
        // Create physics body for ship using config properties
        const shipBody = this.physics.Bodies.polygon(
            shipConfig.SPAWN.X, 
            shipConfig.SPAWN.Y, 
            3, 15, {
                density: shipConfig.PHYSICS.DENSITY,
                frictionAir: shipConfig.PHYSICS.FRICTION_AIR,
                restitution: shipConfig.PHYSICS.RESTITUTION,
                friction: shipConfig.PHYSICS.FRICTION
            }
        );
        
        this.physics.World.add(this.physics.world, shipBody);
        
        // Link graphic to physics body (for our own tracking)
        this.ship.physicsBody = shipBody;
        
        // Add engine glow setter method to ship
        this.ship.setEngineGlow = (isVisible) => {
            this.setEngineGlow(isVisible);
        };
    },
    
    createBoundaryVisual() {
        const boundary = new PIXI.Graphics();
        boundary.lineStyle(worldConfig.BOUNDARY.LINE_WIDTH, worldConfig.BOUNDARY.COLOR);
        boundary.drawRect(
            worldConfig.BOUNDS.MIN_X, 
            worldConfig.BOUNDS.MIN_Y, 
            worldConfig.SIZE, 
            worldConfig.SIZE
        );
        this.container.addChild(boundary);
    },

    createBackgroundClickArea() {
        // Add a background click detector
        const bgClickArea = new PIXI.Graphics();
        bgClickArea.beginFill(0xFFFFFF, 0.01); // Almost invisible
        bgClickArea.drawRect(
            worldConfig.BOUNDS.MIN_X, 
            worldConfig.BOUNDS.MIN_Y, 
            worldConfig.SIZE, 
            worldConfig.SIZE
        );
        bgClickArea.endFill();
        
        // Make it interactive
        bgClickArea.eventMode = 'static';
        bgClickArea.on('pointerdown', () => {
            // Reset camera focus with direct reference
            if (this.camera) {
                this.camera.resetFocus();
            }
            
            this.hidePopup();
        });
        
        // Add it to the container (above asteroids)
        this.container.addChild(bgClickArea);
    },
    
    createPointsOfInterest() {
        // Create a container for points of interest
        this.pointsOfInterest = new PIXI.Container();
        this.container.addChild(this.pointsOfInterest);
        
        // Create each point of interest using POI data from config
        this.poiData.forEach((poi, index) => {
            const poiGraphic = new PIXI.Graphics();
            poiGraphic.beginFill(poi.color, 0.7);
            poiGraphic.lineStyle(2, 0xFFFFFF, 0.8);
            poiGraphic.drawRect(-poi.width/2, -poi.height/2, poi.width, poi.height);
            poiGraphic.endFill();
            
            // Add a label with text settings from config
            const label = new PIXI.Text(`POI ${index + 1}`, {
                fontFamily: poiConfig.FONT.FAMILY,
                fontSize: poiConfig.FONT.SIZE,
                fill: poiConfig.FONT.COLOR,
                align: poiConfig.FONT.ALIGN
            });
            label.anchor.set(0.5);
            // Add resolution setting for sharp text
            label.resolution = poiConfig.FONT.RESOLUTION;
            poiGraphic.addChild(label);
            
            // Position the POI
            poiGraphic.position.set(poi.x, poi.y);
            
            // Add to container
            this.pointsOfInterest.addChild(poiGraphic);
            
            // Create a static physics body for the POI
            const poiBody = this.physics.Bodies.rectangle(
                poi.x, 
                poi.y, 
                poi.width, 
                poi.height, 
                { 
                    isStatic: true,
                    render: { fillStyle: poi.color }
                }
            );
            
            // Add to physics world
            this.physics.World.add(this.physics.world, poiBody);
            
            // Link graphic to physics body
            poiGraphic.physicsBody = poiBody;
            
            // Add a data field to identify this as a POI
            poiGraphic.isPOI = true;
            poiGraphic.poiId = index + 1;
            
            // Set interactive properties for hover and click
            poiGraphic.eventMode = 'static';
            poiGraphic.cursor = 'pointer';
            
            // Store original scale for animation
            poiGraphic.originalScale = { x: 1, y: 1 };
            poiGraphic.isHovered = false;
            
            // Add events for hover animation
            poiGraphic.on('pointerover', () => {
                poiGraphic.isHovered = true;
            });
            poiGraphic.on('pointerout', () => {
                poiGraphic.isHovered = false;
            });
            
            // Add click handler for camera focus
            poiGraphic.on('pointerdown', () => {
                // Check if this POI is already focused
                const isAlreadyFocused = this.camera?.focusObject === poiGraphic;
                
                // Get the POI data
                const poiIndex = poiGraphic.poiId - 1;
                const poiData = this.poiData[poiIndex];
                
                if (isAlreadyFocused) {
                    // If already focused, open the web address in a new tab
                    if (poiData.webAddress) {
                        window.open(poiData.webAddress, '_blank');
                    }
                } else {
                    // If not already focused, set camera focus to this POI
                    if (this.camera) {
                        this.camera.setFocus(poiGraphic);
                    }
                    
                    // Show popup
                    this.showPopupForPOI(poiData);
                }
            });
        });
    },
    
    createPopupSystem() {
        // Container for all popups
        this.popupContainer = new PIXI.Container();
        this.container.addChild(this.popupContainer);
        
        // Create placeholder sprites for our POI images
        this.poiImages = {};
        
        // Create placeholder sprites for each POI
        this.poiData.forEach(poi => {
            // Create a sprite using a simple colored rectangle
            const sprite = new PIXI.Graphics();
            sprite.beginFill(poi.color, 0.9);
            sprite.lineStyle(2, 0xFFFFFF);
            sprite.drawRect(0, 0, 220, 80);
            sprite.endFill();
            
            // Add a label to identify the sprite with text settings from config
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
        
        // Current active popup (or null)
        this.activePopup = null;
        
        // Animation properties from config
        this.popupAnimationSpeed = uiConfig.POPUP.ANIMATION_SPEED;
        this.fadeInProgress = false;
        this.fadeOutProgress = false;
    },

    showPopupForPOI(poiData) {
        // If we're fading out a popup, cancel that animation and remove it
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
        
        // Position popup next to the POI using offset from config
        const offsetX = poiData.width / 2 + uiConfig.POPUP.POSITION.OFFSET_X;
        const offsetY = -poiData.height / 2 + uiConfig.POPUP.POSITION.OFFSET_Y;
        popup.position.set(poiData.x + offsetX, poiData.y + offsetY);
        
        // Create popup background with settings from config
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
        
        // Add title with settings from config
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
        
        // Add description text with settings from config
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
        
        // Add image with scale and position from config
        const image = this.poiImages[poiData.imageKey].clone();
        image.scale.set(uiConfig.IMAGE.SCALE, uiConfig.IMAGE.SCALE);
        image.position.set(
            uiConfig.IMAGE.POSITION.X, 
            popupHeight - uiConfig.IMAGE.POSITION.Y
        );
        popup.addChild(image);
    },

    hidePopup() {
        if (this.activePopup) {
            // Start fade-out animation instead of immediately removing
            this.fadeOutProgress = true;
            this.fadeInProgress = false;
        }
    },

    update() {
        // Update spaceship graphics from physics
        if (this.ship && this.ship.physicsBody) {
            this.ship.position.set(
                this.ship.physicsBody.position.x, 
                this.ship.physicsBody.position.y
            );
            this.ship.rotation = this.ship.physicsBody.angle;
        }
        
        // Update asteroids graphics from physics
        if (this.asteroids) {
            for (let i = 0; i < this.asteroids.children.length; i++) {
                const asteroid = this.asteroids.children[i];
                if (asteroid.physicsBody) {
                    asteroid.position.set(
                        asteroid.physicsBody.position.x,
                        asteroid.physicsBody.position.y
                    );
                    asteroid.rotation = asteroid.physicsBody.angle;
                }
            }
        }
        
        // Update points of interest hover animations
        if (this.pointsOfInterest) {
            for (let i = 0; i < this.pointsOfInterest.children.length; i++) {
                const poi = this.pointsOfInterest.children[i];
                this.animatePointOfInterest(poi);
            }
        }

        this.updatePopupAnimations();
    },
    
    // Function to handle POI animations
    animatePointOfInterest(poi) {
        const isActive = poi.isHovered || (this.camera && this.camera.focusObject === poi);

        if (isActive) {
            // Scale up to maxScale when hovered (with smooth animation)
            poi.scale.x = Math.min(
                poi.scale.x + this.poiAnimationParams.SCALE_SPEED, 
                this.poiAnimationParams.MAX_SCALE
            );
            poi.scale.y = Math.min(
                poi.scale.y + this.poiAnimationParams.SCALE_SPEED, 
                this.poiAnimationParams.MAX_SCALE
            );
        } else {
            // Scale back down to original scale when not hovered
            poi.scale.x = Math.max(
                poi.scale.x - this.poiAnimationParams.SCALE_SPEED, 
                this.poiAnimationParams.MIN_SCALE
            );
            poi.scale.y = Math.max(
                poi.scale.y - this.poiAnimationParams.SCALE_SPEED, 
                this.poiAnimationParams.MIN_SCALE
            );
        }
    },

    // New method to update popup animations
    updatePopupAnimations() {
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
    },
    
    setEngineGlow(isVisible) {
        if (this.ship && this.ship.engineGlow) {
            this.ship.engineGlow.visible = isVisible;
        }
    }
};

export default Entities;