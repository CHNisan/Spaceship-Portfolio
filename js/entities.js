// Game entities (player ship, asteroids, stars)
const Entities = {
    container: null,
    ship: null,
    asteroids: null,
    stars: null,
    
    init(container) {
        this.container = container;
        this.createStars();
        this.createAsteroids();
        this.createSpaceship();
        this.createBoundaryVisual();
    },
    
    createStars() {
        this.stars = new PIXI.Container();
        this.container.addChild(this.stars);
        
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * Physics.WORLD_SIZE - Physics.WORLD_SIZE / 2;
            const y = Math.random() * Physics.WORLD_SIZE - Physics.WORLD_SIZE / 2;
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
            let x, y;
            do {
                x = Math.random() * Physics.WORLD_SIZE - Physics.WORLD_SIZE / 2;
                y = Math.random() * Physics.WORLD_SIZE - Physics.WORLD_SIZE / 2;
            } while (Math.sqrt(x*x + y*y) < 300);
            
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
            const asteroidBody = Physics.Bodies.fromVertices(x, y, [physicsPoints], {
                restitution: 0.6,
                friction: 0.01,
                density: 0.001
            });
            
            if (asteroidBody) {
                Physics.World.add(Physics.world, asteroidBody);
                
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
        const shipBody = Physics.Bodies.polygon(0, 0, 3, 15, {
            density: 0.001,
            frictionAir: 0.05,
            restitution: 0.3,
            friction: 0.01
        });
        
        Physics.World.add(Physics.world, shipBody);
        
        // Link graphic to physics body (for our own tracking)
        this.ship.physicsBody = shipBody;
    },
    
    createBoundaryVisual() {
        const boundary = new PIXI.Graphics();
        boundary.lineStyle(2, 0xFF0000);
        boundary.drawRect(
            Physics.WORLD_BOUNDS.min.x, 
            Physics.WORLD_BOUNDS.min.y, 
            Physics.WORLD_SIZE, 
            Physics.WORLD_SIZE
        );
        this.container.addChild(boundary);
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
    },
    
    setEngineGlow(isVisible) {
        this.ship.engineGlow.visible = isVisible;
    }
};