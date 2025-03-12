/**
 * Gradient Background Shader
 * Creates an angled linear gradient across the screen
 */

export default class GradientBackground {
    /**
     * Create a new gradient background
     * @param {PIXI.Application} app - The PIXI application
     * @param {Object} options - Configuration options
     * @param {number} options.topColor - The color at the top (hex format)
     * @param {number} options.bottomColor - The color at the bottom (hex format)
     * @param {number} options.angleInDegrees - The angle of the gradient in degrees
     */
    constructor(app, options) {
        this.app = app;
        this.options = options;
        this.container = new PIXI.Container();
        this.mesh = null;
        this.currentWidth = 0;
        this.currentHeight = 0;
        this.shader = null;
        
        // Bind the resize handler to keep 'this' context
        this.handleResize = this.handleResize.bind(this);
    }

    /**
     * Initialize and create the gradient background
     * @returns {PIXI.Container} The container with the gradient background
     */
    create() {
        try {
            const {topColor, bottomColor, angleInDegrees = 15} = this.options;
            
            // Convert angle to radians
            const angleInRadians = (angleInDegrees * Math.PI) / 180;
            
            // Store initial dimensions
            this.currentWidth = this.app.screen.width * 1.5;
            this.currentHeight = this.app.screen.height * 1.5;
            
            // Convert hex colors to normalized RGB
            const topRGB = this.hexToRgb(topColor);
            const bottomRGB = this.hexToRgb(bottomColor);
            
            // Create the shader
            this.shader = this.createShader(topRGB, bottomRGB, angleInRadians);
            
            // Create a mesh with the shader
            const geometry = this.createGeometry(this.currentWidth, this.currentHeight);
            
            this.mesh = new PIXI.Mesh(geometry, this.shader);
            this.mesh.position.set(-this.currentWidth / 2, -this.currentHeight / 2);
            
            // Add to container
            this.container.addChild(this.mesh);
            
            // Set up resize handling - both window resize and app resize
            window.addEventListener('resize', this.handleResize);
            this.app.renderer.on('resize', this.handleResize);
            
            // Initial positioning
            this.updateContainerPosition();
            
            return this.container;
        } catch (error) {
            console.error('Error creating gradient background:', error);
            
            // Fallback to a solid color background if shader fails
            const fallbackBg = new PIXI.Graphics();
            fallbackBg.beginFill(this.options.topColor);
            fallbackBg.drawRect(-5000, -5000, 10000, 10000);
            fallbackBg.endFill();
            this.container.addChild(fallbackBg);
            
            return this.container;
        }
    }
    
    /**
     * Update the gradient colors
     * @param {number} topColor - New top color (hex)
     * @param {number} bottomColor - New bottom color (hex)
     */
    updateColors(topColor, bottomColor) {
        try {
            if (!this.shader) return;
            
            // Convert hex colors to normalized RGB
            const topRGB = this.hexToRgb(topColor);
            const bottomRGB = this.hexToRgb(bottomColor);
            
            // Update the shader uniforms
            this.shader.uniforms.topColor = [topRGB.r, topRGB.g, topRGB.b];
            this.shader.uniforms.bottomColor = [bottomRGB.r, bottomRGB.g, bottomRGB.b];
            
            // Store the new colors in options for potential recreations
            this.options.topColor = topColor;
            this.options.bottomColor = bottomColor;
        } catch (error) {
            console.error('Error updating gradient colors:', error);
        }
    }
    
    /**
     * Convert hex color to RGB components (normalized 0-1)
     * @param {number} hex - Hex color value
     * @returns {Object} RGB components as {r, g, b}
     */
    hexToRgb(hex) {
        return {
            r: ((hex >> 16) & 0xFF) / 255,
            g: ((hex >> 8) & 0xFF) / 255,
            b: (hex & 0xFF) / 255
        };
    }
    
    /**
     * Create the shader for the gradient
     * @param {Object} topRGB - Top color {r, g, b} values
     * @param {Object} bottomRGB - Bottom color {r, g, b} values
     * @param {number} angle - Angle in radians
     * @returns {PIXI.Shader} The created shader
     */
    createShader(topRGB, bottomRGB, angle) {
        const vertexSrc = `
            precision mediump float;
            attribute vec2 aVertexPosition;
            attribute vec2 aTextureCoord;
            uniform mat3 translationMatrix;
            uniform mat3 projectionMatrix;
            varying vec2 vTextureCoord;
            
            void main() {
                gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
                vTextureCoord = aTextureCoord;
            }
        `;
        
        const fragmentSrc = `
            precision mediump float;
            varying vec2 vTextureCoord;
            
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float angle;
            
            void main() {
                // Apply rotation to create the angle
                float s = sin(angle);
                float c = cos(angle);
                vec2 rotatedCoord = vec2(
                    vTextureCoord.x * c - vTextureCoord.y * s + 0.5 * (1.0 - c) + 0.5 * s,
                    vTextureCoord.x * s + vTextureCoord.y * c + 0.5 * (1.0 - c) - 0.5 * s
                );
                
                // Use y coordinate for the gradient
                float gradient = rotatedCoord.y;
                
                // Mix colors based on y position
                vec3 color = mix(topColor, bottomColor, gradient);
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;
        
        return PIXI.Shader.from(vertexSrc, fragmentSrc, {
            topColor: [topRGB.r, topRGB.g, topRGB.b],
            bottomColor: [bottomRGB.r, bottomRGB.g, bottomRGB.b],
            angle: angle
        });
    }
    
    /**
     * Create geometry for the gradient mesh
     * @param {number} width - Width of the geometry
     * @param {number} height - Height of the geometry
     * @returns {PIXI.Geometry} The created geometry
     */
    createGeometry(width, height) {
        return new PIXI.Geometry()
            .addAttribute('aVertexPosition', [
                0, 0,           // top-left
                width, 0,       // top-right
                width, height,  // bottom-right
                0, height       // bottom-left
            ])
            .addAttribute('aTextureCoord', [
                0, 0, // top-left
                1, 0, // top-right
                1, 1, // bottom-right
                0, 1  // bottom-left
            ])
            .addIndex([0, 1, 2, 0, 2, 3]);
    }
    
    /**
     * Update the container position to center it on screen
     */
    updateContainerPosition() {
        this.container.position.set(
            this.app.renderer.width / 2,
            this.app.renderer.height / 2
        );
    }
    
    /**
     * Handle window or renderer resize events
     */
    handleResize() {
        try {
            // Ensure we have valid dimensions
            if (this.app.renderer.width <= 0 || this.app.renderer.height <= 0) {
                return; // Skip if dimensions are invalid (e.g., minimized window)
            }
            
            // Calculate new dimensions
            const newWidth = this.app.renderer.width * 1.5;
            const newHeight = this.app.renderer.height * 1.5;
            
            // Check if size changed significantly
            if (Math.abs(newWidth - this.currentWidth) > 50 || 
                Math.abs(newHeight - this.currentHeight) > 50) {
                
                // Store new dimensions
                this.currentWidth = newWidth;
                this.currentHeight = newHeight;
                
                // Remove the old mesh
                if (this.mesh) {
                    this.container.removeChild(this.mesh);
                    this.mesh.destroy(true);
                }
                
                // Create a new mesh with updated dimensions
                const {topColor, bottomColor, angleInDegrees = 15} = this.options;
                const angleInRadians = (angleInDegrees * Math.PI) / 180;
                const topRGB = this.hexToRgb(topColor);
                const bottomRGB = this.hexToRgb(bottomColor);
                
                this.shader = this.createShader(topRGB, bottomRGB, angleInRadians);
                const geometry = this.createGeometry(newWidth, newHeight);
                
                this.mesh = new PIXI.Mesh(geometry, this.shader);
                this.mesh.position.set(-newWidth / 2, -newHeight / 2);
                
                // Add the new mesh
                this.container.addChild(this.mesh);
            }
            
            // Update container position
            this.updateContainerPosition();
            
        } catch (error) {
            console.error('Error during resize:', error);
        }
    }
}