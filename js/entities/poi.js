import PhysicsEntity from './physics-entity.js';
import config from '../config/index.js';

const { poi: poiConfig } = config;

export default class PointOfInterest extends PhysicsEntity {
    constructor(container, physics, data, id, camera) {
        super(container, physics);
        this.data = data;
        this.id = id;
        this.camera = camera;
        this.isHovered = false;
        this.position.x = data.x;
        this.position.y = data.y;
    }
    
    createGraphic() {
        this.graphic = new PIXI.Graphics();
        this.graphic.beginFill(this.data.color, 0.7);
        this.graphic.lineStyle(2, 0xFFFFFF, 0.8);
        this.graphic.drawRect(
            -this.data.width/2, 
            -this.data.height/2, 
            this.data.width, 
            this.data.height
        );
        this.graphic.endFill();
        
        // Set interactive properties
        this.graphic.eventMode = 'dynamic';
        this.graphic.cursor = 'pointer';
        
        // Store properties on the graphic for camera focus
        this.graphic.isPOI = true;
        this.graphic.poiId = this.id;
        
        // Set up event handlers
        this.setupEventHandlers();
    }
    
    createPhysicsBody() {
        this.physicsBody = this.physics.Bodies.rectangle(
            this.data.x, 
            this.data.y, 
            this.data.width, 
            this.data.height, 
            { 
                isStatic: true,
            }
        );
    }
    
    setupEventHandlers() {
        this.graphic.on('pointerover', () => {
            this.isHovered = true;
        });
        
        this.graphic.on('pointerout', () => {
            this.isHovered = false;
        });
        
        this.graphic.on('pointerdown', () => {
            // Immediately open the web address on click
            if (this.data.webAddress) {
                window.open(this.data.webAddress, '_blank');
            }
        });
    }
    
    setCamera(camera) {
        this.camera = camera;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // Handle hover animation
        const params = poiConfig.ANIMATION;
        
        if (this.isHovered) {
            // Scale up when active
            this.graphic.scale.x = Math.min(
                this.graphic.scale.x + params.SCALE_SPEED, 
                params.MAX_SCALE
            );
            this.graphic.scale.y = Math.min(
                this.graphic.scale.y + params.SCALE_SPEED, 
                params.MAX_SCALE
            );
        } else {
            // Scale down when inactive
            this.graphic.scale.x = Math.max(
                this.graphic.scale.x - params.SCALE_SPEED, 
                params.MIN_SCALE
            );
            this.graphic.scale.y = Math.max(
                this.graphic.scale.y - params.SCALE_SPEED, 
                params.MIN_SCALE
            );
        }
    }
}