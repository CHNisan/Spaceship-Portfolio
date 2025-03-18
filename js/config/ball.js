const ballConfig = {
    DEFAULT: {
        PHYSICS: {
            RESTITUTION: 0.7,  // Bounciness
            FRICTION: 0.001,
            DENSITY: 0.00001
        }
    },
    BOWLING: {
        PHYSICS: {
            RESTITUTION: 0.7,  // Bounciness
            FRICTION: 0.000001,
            DENSITY: 0.000005
        }
    },
    PIN: {
        PHYSICS: {
            RESTITUTION: 0.9,  // Bounciness
            FRICTION: 0.0001,
            DENSITY: 0.00001
        }
    }
};

export default ballConfig;