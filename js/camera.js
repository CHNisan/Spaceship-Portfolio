// Camera control system
SpaceGame.Camera = {
    container: null,
    target: { x: 0, y: 0 },
    damping: 0.1, // Single universal damping value (0-1, lower = smoother, higher = tighter)
    
    init(container, app) {
        this.container = container;
        this.app = app;
    },
    
    follow(target) {
        this.target.x = target.position.x;
        this.target.y = target.position.y;
    },
    
    update(deltaTime) {
        // Apply smooth camera movement using linear interpolation
        this.container.pivot.x = this.lerp(this.container.pivot.x, this.target.x, this.damping);
        this.container.pivot.y = this.lerp(this.container.pivot.y, this.target.y, this.damping);
        
        // Center the container in the screen
        this.container.position.x = this.app.screen.width / 2;
        this.container.position.y = this.app.screen.height / 2;
    },
    
    // Helper function for smooth interpolation
    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }
};
// Test commit