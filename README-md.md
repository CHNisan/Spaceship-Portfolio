# Spaceship Portfolio Game

An interactive 2D spaceship exploration game built with PixiJS and Matter.js. Navigate through space, interact with points of interest, play with physics-based mini-games, and avoid asteroids.

## 🚀 Overview

This project is an interactive portfolio website designed as a space exploration game. Players control a spaceship to navigate through different areas containing projects, information, and interactive playground elements. The environment is designed around a central hub with pathways leading to different sections: portfolio showcase, personal details, and interactive playground areas.

The game serves as both an engaging interactive experience and a way to showcase development skills and portfolio projects.

## ✨ Key Features

### Core Gameplay
- **Physics-based Spaceship Control**: Realistic momentum and thrust mechanics with adjustable speed modes
- **Dynamic World Environment**: Resizable game world with distinct areas to explore
- **Interactive Points of Interest**: Clickable elements that display project information and link to external sites
- **Physics Playground**: Mini-games including bowling and an obstacle course
- **Asteroid Field**: Randomly generated asteroids with varied sizes and shapes

### Technical Features
- **Advanced Camera System**: 
  - Smooth follow mechanics with configurable damping
  - Zoom controls with min/max constraints and smooth interpolation
  - Free camera mode for exploring without ship movement
  - Focus capability on points of interest
- **Responsive Design**: Dynamically adapts UI and rendering to different screen sizes
- **Theme System**: Toggle between light and dark visual themes affecting specific game elements
- **Custom WebGL Shader**: Gradient background with configurable colors and angle
- **Event-Driven Architecture**: Clean communication between systems using custom events
- **Configurable Entity System**: Data-driven approach for easy customization

## 🎮 How to Play

### Controls:
- **Mouse Movement**: Aim the spaceship
- **Mouse Click**: Apply thrust to move in the aimed direction
- **Spacebar**: Toggle free camera mode
  - When in free camera mode: Click and drag to pan around the environment
- **Mouse Wheel**: Zoom in and out
- **D Key**: Toggle dark/light mode
- **Shift Key**: Boost speed
- **Ctrl Key**: Precision slow mode

### Gameplay Flow:
1. Start at the introduction screen and click "START" to begin
2. Navigate using mouse aim and click to apply thrust
3. Follow the colored paths to explore different areas:
   - **Pink Path**: Leads to the playground
   - **Green Path**: Leads to personal details
   - **Yellow Path**: Leads to portfolio projects
   - **Blue Path**: Leads to the centre
4. Interact with points of interest by hovering over them and clicking to visit external links
5. Experiment with the physics playground:
   - Bowling area: Try to knock down the pins
   - Ball-in-hole challenge: Navigate objects through obstacles

## 🛠️ Technical Implementation

### Architecture Overview

The project follows a modular ES6-based architecture with clean separation of concerns:

```
Core Systems ─┬─ Camera System
              ├─ Physics Engine
              └─ Input Manager
              
Entity System ─┬─ Base Entity
               └─ PhysicsEntity ─┬─ Ship
                                 ├─ Asteroid
                                 ├─ POI
                                 ├─ Wall
                                 └─ Ball

Managers ──────┬─ Entity Manager
               ├─ Background Manager
               ├─ Asset Manager
               ├─ WorldObject Manager
               └─ Playground Manager

UI System ─────── IntroScreen
```

### Built With:
- **[PixiJS](https://pixijs.com/)**: 2D WebGL renderer for high-performance graphics (v7.4.2)
- **[Matter.js](https://brm.io/matter-js/)**: 2D physics engine for realistic movement and collisions (v0.20.0)
- **ES6 Modules**: Modern JavaScript architecture with import/export system

### Key System Details

#### Entity System
The game uses an inheritance-based entity system:
- `Entity`: Base class with position, rotation, and graphic properties
- `PhysicsEntity`: Extends Entity with Matter.js physics body integration
- Specialized entities inherit from these base classes

Example of inheritance structure:
```javascript
// Base Entity (handles graphics)
class Entity {
    constructor(container) {
        this.container = container;
        this.graphic = null;
        this.position = { x: 0, y: 0 };
        this.rotation = 0;
    }
    
    // Base methods...
}

// PhysicsEntity adds physics behavior
class PhysicsEntity extends Entity {
    constructor(container, physics) {
        super(container);
        this.physics = physics;
        this.physicsBody = null;
    }
    
    // Physics-specific methods...
}

// Ship adds specific ship behaviors
class Ship extends PhysicsEntity {
    constructor(container, physics) {
        super(container, physics);
        this.engineGlow = null;
        this.isThrusting = false;
    }
    
    // Ship-specific methods...
}
```

#### Physics System
- Zero-gravity space environment with configurable properties
- Collision detection and resolution using Matter.js
- Custom boundary system to keep entities within the game world
- Specialized physics for different entity types (ship, asteroids, playground objects)

#### Camera System
- Smooth follow system with configurable damping for natural movement
- Zoom functionality with min/max constraints and smooth transitions
- Free camera mode with drag controls
- Target-focus capability for examining points of interest

#### Input System
- Mouse-oriented ship control (point and thrust)
- Multi-key support for specialized actions
- Event-based input handling for responsive controls
- Integration with camera for proper coordinate conversion

#### Manager System
Singleton managers coordinate entity creation and updates:
- `EntityManager`: Central entity coordination
- `WorldObjectManager`: Handles world objects (asteroids, POIs, paths)
- `PlaygroundManager`: Manages physics playground elements
- `BackgroundManager`: Controls the background shader
- `AssetManager`: Handles asset preloading

#### Configuration System
Extensive configuration system divided by entity type:
- Core systems (camera, physics, world, theme)
- Entities (ship, asteroids, POI, etc.)
- UI elements

Example configuration file structure:
```javascript
// Ship configuration
const shipConfig = {
    PHYSICS: {
        DENSITY: 0.001,
        FRICTION_AIR: 0.03,
        RESTITUTION: 0.3,
        FRICTION: 0.01
    },
    
    THRUST: {
        FORCE_MULTIPLIER: 0.0007,
        ANGULAR_VELOCITY_MULT: 0.2,
        SLOW_MULTIPLIER: 0.3,
        FAST_MULTIPLIER: 2
    },
    
    VISUAL: {
        BODY_COLOR: 0x4AA8E2,
        ENGINE_GLOW_COLOR: 0xF76565,
        ENGINE_GLOW_SIZE: 3,
        SIZE_MULTIPLIER: 1.0
    },
    
    SPAWN: {
        X: 0,
        Y: 0,
        ROTATION: -Math.PI / 2
    }
};
```

#### Shader System
Custom WebGL shader for gradient background:
- Configurable top and bottom colors
- Adjustable angle
- Responsive to window resize
- Smooth transitions for theme changes

## 🗂️ Detailed Project Structure

```
├── assets/                  # Game assets
│   ├── images/              # Images for POIs and UI elements
│   └── videos/              # Videos for POI hover effects
├── js/
│   ├── config/              # Configuration files
│   │   ├── core/            # Core system configurations
│   │   │   ├── camera.js    # Camera behavior settings
│   │   │   ├── physics.js   # Physics engine parameters
│   │   │   ├── theme.js     # Color schemes
│   │   │   └── world.js     # World dimensions and properties
│   │   ├── entities/        # Entity configurations
│   │   │   ├── ship.js      # Player ship settings
│   │   │   ├── playground-objects/  # Playground entity settings
│   │   │   └── world-objects/       # World entity settings
│   │   ├── ui/              # UI configurations
│   │   └── index.js         # Configuration exports
│   ├── core/                # Core systems
│   │   ├── camera.js        # Camera and view management
│   │   ├── input.js         # Input handling
│   │   └── physics.js       # Physics system
│   ├── entities/            # Entity classes
│   │   ├── main/            # Base entity classes
│   │   │   ├── entity.js    # Base visual entity
│   │   │   └── physics-entity.js  # Physics-enabled entity
│   │   ├── playground-objects/    # Playground-specific entities
│   │   ├── world-objects/         # World-specific entities
│   │   └── ship.js          # Player ship implementation
│   ├── managers/            # System managers
│   │   ├── asset-manager.js       # Asset loading and management
│   │   ├── background-manager.js  # Background handling
│   │   ├── entity-manager.js      # Entity coordination
│   │   ├── playground-manager.js  # Playground area management
│   │   └── world-object-manager.js  # World object management
│   ├── shaders/             # WebGL shaders
│   │   └── gradient-background.js  # Background gradient shader
│   ├── ui/                  # User interface components
│   │   └── intro-screen.js  # Introduction screen
│   ├── game.js              # Main game initialization and loop
│   └── main.js              # Application entry point
├── index.html               # Main HTML file
└── style.css                # CSS styling
```

## ⚙️ Configuration

The game can be extensively customized through the configuration files in the `js/config/` directory. Here are some of the key configurable aspects:

### Camera Configuration
```javascript
const cameraConfig = {
    FOLLOW: {
        DAMPING: 0.1  // Smooth camera following
    },
    
    ZOOM: {
        DEFAULT: 1.0,
        MIN: 0.3,      // Zoomed out limit
        MAX: 2.0,      // Zoomed in limit
        STEP: 0.1,     // Zoom increment per scroll
        DAMPING: 0.1   // Zoom transition smoothing
    }
};
```

### Physics Configuration
```javascript
const physicsConfig = {
    ENGINE: {
        GRAVITY: { x: 0, y: 0 },  // Zero gravity for space
        TIMING: {
            TIMESTEP: 1000 / 60,   // Target 60 FPS
            VELOCITY_ITERATIONS: 8,
            POSITION_ITERATIONS: 3
        }
    },
    
    WALLS: {
        THICKNESS: 50,
        IS_STATIC: true,
        RESTITUTION: 0.2  // Bounciness of walls
    }
};
```

### World Configuration
```javascript
const worldConfig = {
    SIZE: 5000,  // Size of the game world
    
    BACKGROUND: {
        TOP_COLOR: themeConfig.MAIN.LIGHT.PRIMARY,
        BOTTOM_COLOR: themeConfig.MAIN.LIGHT.SECONDARY,
        ANGLE: 15  // Gradient angle
    },
    
    // Other world settings...
};
```

### Ship Configuration
```javascript
const shipConfig = {
    PHYSICS: {
        DENSITY: 0.001,
        FRICTION_AIR: 0.03,  // Air resistance
        RESTITUTION: 0.3,    // Bounciness
        FRICTION: 0.01       // Surface friction
    },
    
    THRUST: {
        FORCE_MULTIPLIER: 0.0007,  // Base thrust power
        ANGULAR_VELOCITY_MULT: 0.2,
        SLOW_MULTIPLIER: 0.3,      // Ctrl pressed
        FAST_MULTIPLIER: 2         // Shift pressed
    },
    
    // Visual and spawn settings...
};
```

## 🔧 Customization Guide

### Adding New POIs
To add a new Point of Interest:
1. Edit `js/config/entities/world-objects/poi.js`
2. Add a new object to the `ITEMS` array:
```javascript
{
    x: 1900,           // X position
    y: -1100,          // Y position
    width: 480,        // Width of POI
    height: 270,       // Height of POI
    color: 0x00FF00,   // Fallback color
    title: "New Project",
    description: "Description of the project",
    webAddress: "https://your-project-link.com",
    image: "ProjectScreenshot",  // Image asset name
    video: "ProjectVideo"        // Video asset name
}
```
3. Add the corresponding assets to the `assets` directory
4. Update the asset bundles in `js/managers/asset-manager.js`

### Creating New Playground Elements
To add a new physics playground:
1. Edit `js/config/entities/playground-objects/playground.js`
2. Add a new configuration object
3. Implement the creation logic in `js/managers/playground-manager.js`

### Changing Colors and Theme
1. Edit the color scheme in `js/config/core/theme.js`:
```javascript
const themeConfig = {
    MAIN: {
        LIGHT: {
            PRIMARY: 0xF4F3EE,
            SECONDARY: 0xE4E5DA
        },
        DARK: {
            PRIMARY: 0x323330,
            SECONDARY: 0x191919
        }
    },
    
    COLORS: {
        RED: 0xF76565,
        YELLOW: 0xFFAA00,
        GREEN: 0x00FF00,
        BLUE: 0x00FFFF,
        PINK: 0xFF00FF
    }
};
```

---

Created by [Christopher Nisan](https://github.com/CHNisan)

**[Back to top](#spaceship-portfolio-game)**