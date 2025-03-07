// Game entities (player ship, asteroids, stars, points of interest)
SpaceGame.Entities = {
    container: null,
    ship: null,
    asteroids: null,
    stars: null,
    pointsOfInterest: null,
    
    // Define POI locations in a single place for reuse
    poiLocations: [
        { x: 1000, y: 1000, width: 100, height: 100, color: 0x00FFFF },
        { x: -1200, y: 800, width: 150, height: 80, color: 0xFFAA00 },
        { x: 500, y: -1500, width: 120, height: 120, color: 0x00FF00 },
        { x: -800, y: -900, width: 80, height: 160, color: 0xFF00FF }
    ],
    
    // Points of interest animation parameters
    poiAnimationParams: {
        scaleSpeed: 0.04,    // How fast the scaling animation happens
        maxScale: 1.2,       // Maximum scale when hovered
        minScale: 1.0        // Minimum scale (normal size)
    },
    
    init(container) {
        this.container = container;
        this.createStars();
        this.createAsteroids();
        this.createSpaceship();
        this.createBoundaryVisual();
        this.createPointsOfInterest();
    },



    
    createStars() {
        this.stars = new PIXI.Container();
        this.container.addChild(this.stars);
        
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * SpaceGame.Physics.WORLD_SIZE - SpaceGame.Physics.WORLD_SIZE / 2;
            const y = Math.random() * SpaceGame.Physics.WORLD_SIZE - SpaceGame.Physics.WORLD_SIZE / 2;
            const size = Math.random() * 2 + 1;
            const brightness = Math.random() * 0.5 + 0.5;
            
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
        
        for (let i = 0; i < 30; i++) {
            // Ensure asteroids are not too close to the center where the ship spawns
            // and not inside any point of interest
            let x, y, isValidPosition;
            do {
                x = Math.random() * SpaceGame.Physics.WORLD_SIZE - SpaceGame.Physics.WORLD_SIZE / 2;
                y = Math.random() * SpaceGame.Physics.WORLD_SIZE - SpaceGame.Physics.WORLD_SIZE / 2;
                
                // Check if too close to ship spawn
                isValidPosition = Math.sqrt(x*x + y*y) >= 300;
                
                // Check if inside any POI (with buffer zone)
                if (isValidPosition) {
                    for (const poi of this.poiLocations) {
                        // Add buffer around POI for asteroid avoidance
                        const bufferX = poi.width * 0.5;  // 50% buffer on each side
                        const bufferY = poi.height * 0.5;
                        
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
            
            const size = Math.random() * 50 + 20;
            const segments = Math.floor(Math.random() * 5) + 5;
            
            // Create jagged asteroid shape
            const asteroid = new PIXI.Graphics();
            asteroid.beginFill(0x888888);
            
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
            const asteroidBody = SpaceGame.Physics.Bodies.fromVertices(x, y, [physicsPoints], {
                restitution: 0.6,
                friction: 0.01,
                density: 0.001
            });
            
            if (asteroidBody) {
                SpaceGame.Physics.World.add(SpaceGame.Physics.world, asteroidBody);
                
                // Link graphic to physics body (for our own tracking)
                asteroid.physicsBody = asteroidBody;
            }
        }
    },
    
    createSpaceship() {
        // Create spaceship graphics
        this.ship = new PIXI.Container();
        this.container.addChild(this.ship);
        
        // Ship body
        const shipGraphics = new PIXI.Graphics();
        shipGraphics.beginFill(0x3498db);
        shipGraphics.moveTo(20, 0);
        shipGraphics.lineTo(-10, -10);
        shipGraphics.lineTo(-5, 0);
        shipGraphics.lineTo(-10, 10);
        shipGraphics.lineTo(20, 0);
        shipGraphics.endFill();
        this.ship.addChild(shipGraphics);
        
        // Ship engine glow
        const engineGlow = new PIXI.Graphics();
        engineGlow.beginFill(0xff3300);
        engineGlow.drawCircle(-7, 0, 3);
        engineGlow.endFill();
        this.ship.addChild(engineGlow);
        this.ship.engineGlow = engineGlow;
        engineGlow.visible = false;
        
        // Create physics body for ship
        const shipBody = SpaceGame.Physics.Bodies.polygon(0, 0, 3, 15, {
            density: 0.001,
            frictionAir: 0.03,
            restitution: 0.3,
            friction: 0.01
        });
        
        SpaceGame.Physics.World.add(SpaceGame.Physics.world, shipBody);
        
        // Link graphic to physics body (for our own tracking)
        this.ship.physicsBody = shipBody;
    },
    
    createBoundaryVisual() {
        const boundary = new PIXI.Graphics();
        boundary.lineStyle(2, 0xFF0000);
        boundary.drawRect(
            SpaceGame.Physics.WORLD_BOUNDS.min.x, 
            SpaceGame.Physics.WORLD_BOUNDS.min.y, 
            SpaceGame.Physics.WORLD_SIZE, 
            SpaceGame.Physics.WORLD_SIZE
        );
        this.container.addChild(boundary);
    },
    
    createPointsOfInterest() {
        // Create a container for points of interest
        this.pointsOfInterest = new PIXI.Container();
        this.container.addChild(this.pointsOfInterest);
        
        // Create each point of interest
        this.poiLocations.forEach((poi, index) => {
            const poiGraphic = new PIXI.Graphics();
            poiGraphic.beginFill(poi.color, 0.7);
            poiGraphic.lineStyle(2, 0xFFFFFF, 0.8);
            poiGraphic.drawRect(-poi.width/2, -poi.height/2, poi.width, poi.height);
            poiGraphic.endFill();
            
            // Add a label
            const label = new PIXI.Text(`POI ${index + 1}`, {
                fontFamily: 'Arial',
                fontSize: 14,
                fill: 0xFFFFFF,
                align: 'center'
            });
            label.anchor.set(0.5);
            poiGraphic.addChild(label);
            
            // Position the POI
            poiGraphic.position.set(poi.x, poi.y);
            
            // Add to container
            this.pointsOfInterest.addChild(poiGraphic);
            
            // Create a static physics body for the POI
            const poiBody = SpaceGame.Physics.Bodies.rectangle(
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
            SpaceGame.Physics.World.add(SpaceGame.Physics.world, poiBody);
            
            // Link graphic to physics body
            poiGraphic.physicsBody = poiBody;
            
            // Add a data field to identify this as a POI
            poiGraphic.isPOI = true;
            poiGraphic.poiId = index + 1;
            
            // Set interactive properties for hover effects
            poiGraphic.interactive = true;
            poiGraphic.buttonMode = true;
            poiGraphic.cursor = 'pointer'; // Explicitly set cursor style
            
            // Store original scale for animation
            poiGraphic.originalScale = { x: 1, y: 1 };
            poiGraphic.isHovered = false;
            
            // Add events for hover animation
            poiGraphic.on('mouseover', () => {
                poiGraphic.isHovered = true;
            });
            
            poiGraphic.on('mouseout', () => {
                poiGraphic.isHovered = false;
            });
        });
    },
    



    update() {
        // Update spaceship graphics from physics
        this.ship.position.set(
            this.ship.physicsBody.position.x, 
            this.ship.physicsBody.position.y
        );
        this.ship.rotation = this.ship.physicsBody.angle;
        
        // Update asteroids graphics from physics
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
        
        // Update points of interest hover animations
        for (let i = 0; i < this.pointsOfInterest.children.length; i++) {
            const poi = this.pointsOfInterest.children[i];
            this.animatePointOfInterest(poi);
        }
    },
    



    // Function to handle POI animations
    animatePointOfInterest(poi, deltaTime) {
        if (poi.isHovered) {
            // Scale up to maxScale when hovered (with smooth animation)
            poi.scale.x = Math.min(poi.scale.x + this.poiAnimationParams.scaleSpeed, this.poiAnimationParams.maxScale);
            poi.scale.y = Math.min(poi.scale.y + this.poiAnimationParams.scaleSpeed, this.poiAnimationParams.maxScale);
        } else {
            // Scale back down to original scale when not hovered
            poi.scale.x = Math.max(poi.scale.x - this.poiAnimationParams.scaleSpeed, this.poiAnimationParams.minScale);
            poi.scale.y = Math.max(poi.scale.y - this.poiAnimationParams.scaleSpeed, this.poiAnimationParams.minScale);
        }
        
        // Return true if animation is still in progress (maybe usefull in future animations)
        // return poi.scale.x !== (poi.isHovered ? this.poiAnimationParams.maxScale : this.poiAnimationParams.minScale);
    },
    



    setEngineGlow(isVisible) {
        this.ship.engineGlow.visible = isVisible;
    }
};