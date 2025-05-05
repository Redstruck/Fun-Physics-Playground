
import Matter from 'matter-js';

// Configuration for water behavior
const WATER_CONFIG = {
  particleSize: 8,
  density: 0.9,
  friction: 0.1,
  frictionAir: 0.02,
  restitution: 0.2,
  particleColor: '#3B83F6',
  maxParticles: 300, // Maximum number of particles for performance
  emissionRate: 5, // Particles per emission
  emissionInterval: 100, // Time between emissions in ms
  particleLifespan: 8000, // Time in ms before recycling a particle
};

// Store for water particles
let waterParticles = [];
let emissionTimer = null;
let particlePool = [];

// Create a single water particle
export const createWaterParticle = (x, y) => {
  const Bodies = Matter.Bodies;
  
  // Try to reuse a particle from the pool first
  if (particlePool.length > 0) {
    const recycledParticle = particlePool.pop();
    Matter.Body.setPosition(recycledParticle, { x, y });
    Matter.Body.setVelocity(recycledParticle, { x: 0, y: 0 });
    return recycledParticle;
  }
  
  // Create a new particle if none are available in the pool
  return Bodies.circle(x, y, WATER_CONFIG.particleSize, {
    density: WATER_CONFIG.density,
    friction: WATER_CONFIG.friction,
    frictionAir: WATER_CONFIG.frictionAir,
    restitution: WATER_CONFIG.restitution,
    render: {
      fillStyle: WATER_CONFIG.particleColor,
      opacity: 0.8,
    },
    collisionFilter: {
      group: 0,
      category: 0x0002,
      mask: 0xFFFF
    },
    isWater: true, // Tag for identifying water particles
  });
};

// Start water emission
export const startWaterEmission = (engine, width) => {
  if (emissionTimer) {
    clearInterval(emissionTimer);
  }
  
  emissionTimer = setInterval(() => {
    if (waterParticles.length >= WATER_CONFIG.maxParticles) {
      // Recycle oldest particles if max is reached
      const particlesToRecycle = waterParticles.splice(0, WATER_CONFIG.emissionRate);
      particlesToRecycle.forEach(particle => {
        Matter.World.remove(engine.world, particle);
        particlePool.push(particle);
      });
    }
    
    // Emit new particles in random positions across the top
    for (let i = 0; i < WATER_CONFIG.emissionRate; i++) {
      const x = Math.random() * width * 0.8 + width * 0.1; // Emit within middle 80% of width
      const y = 20; // Near the top
      const particle = createWaterParticle(x, y);
      Matter.World.add(engine.world, particle);
      waterParticles.push(particle);
      
      // Schedule particle for recycling
      setTimeout(() => {
        if (waterParticles.includes(particle)) {
          waterParticles = waterParticles.filter(p => p !== particle);
          Matter.World.remove(engine.world, particle);
          particlePool.push(particle);
        }
      }, WATER_CONFIG.particleLifespan);
    }
  }, WATER_CONFIG.emissionInterval);
  
  return emissionTimer;
};

// Stop water emission and clear existing water
export const stopWaterEmission = (engine) => {
  if (emissionTimer) {
    clearInterval(emissionTimer);
    emissionTimer = null;
  }
  
  // Remove all water particles
  waterParticles.forEach(particle => {
    Matter.World.remove(engine.world, particle);
  });
  
  // Add removed particles to pool for reuse
  particlePool = [...particlePool, ...waterParticles];
  waterParticles = [];
};

// Get all current water particles
export const getWaterParticles = () => {
  return waterParticles;
};

// Apply additional physics to make water behave more realistically
export const updateWaterPhysics = (engine) => {
  const waterBodies = waterParticles;
  
  // Apply water physics: surface tension, stacking behavior, etc.
  for (let i = 0; i < waterBodies.length; i++) {
    const particleA = waterBodies[i];
    
    // Apply small horizontal dampening to simulate water settling
    Matter.Body.setVelocity(particleA, {
      x: particleA.velocity.x * 0.98,
      y: particleA.velocity.y
    });
    
    // Water particles should flow around objects with some cohesion
    for (let j = i + 1; j < waterBodies.length; j++) {
      const particleB = waterBodies[j];
      const dx = particleB.position.x - particleA.position.x;
      const dy = particleB.position.y - particleA.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Apply gentle cohesion force between close water particles
      if (dist < WATER_CONFIG.particleSize * 4 && dist > 0) {
        const force = 0.0001;
        Matter.Body.applyForce(particleA, particleA.position, {
          x: (dx / dist) * force,
          y: (dy / dist) * force
        });
      }
    }
  }
};
