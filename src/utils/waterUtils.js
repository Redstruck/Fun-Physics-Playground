
import Matter from 'matter-js';

// Water properties
const WATER_COLOR = '#42c2ff';
const WATER_OPACITY = 0.8;

// Create a water body that acts as a fluid
export const createWater = (width, height) => {
  const Bodies = Matter.Bodies;
  const Body = Matter.Body;
  const Common = Matter.Common;
  
  // Create water as a soft body (compound body of multiple parts)
  const particleOptions = {
    friction: 0.05,
    frictionAir: 0.02,
    restitution: 0.3,
    density: 0.998, // Close to water density
    render: {
      fillStyle: WATER_COLOR,
      opacity: WATER_OPACITY,
      visible: true
    }
  };
  
  // Create a soft body water element
  const columns = 10;
  const rows = 3;
  const columnGap = width * 0.8 / columns;
  const rowGap = 20;
  const startX = width * 0.1;
  const startY = 50;
  const particleRadius = columnGap / 3;
  
  // Create particles
  const particles = [];
  let lastColumn = [];
  let currentColumn = [];
  
  // Generate particles grid
  for (let i = 0; i < columns; i++) {
    currentColumn = [];
    
    for (let j = 0; j < rows; j++) {
      const particle = Bodies.circle(
        startX + i * columnGap,
        startY + j * rowGap,
        particleRadius,
        particleOptions
      );
      
      particles.push(particle);
      currentColumn.push(particle);
      
      // Connect horizontally
      if (i > 0) {
        for (let k = 0; k < lastColumn.length; k++) {
          const lastParticle = lastColumn[k];
          if (j === k) {
            createWaterConstraint(lastParticle, particle);
          }
        }
      }
      
      // Connect vertically in current column
      if (j > 0) {
        createWaterConstraint(currentColumn[j-1], particle);
      }
    }
    
    lastColumn = currentColumn;
  }
  
  // Connect diagonally
  for (let i = 1; i < columns; i++) {
    for (let j = 1; j < rows; j++) {
      const current = particles[(i * rows) + j];
      const aboveLeft = particles[((i-1) * rows) + (j-1)];
      createWaterConstraint(current, aboveLeft);
    }
  }
  
  return particles;
};

// Create constraints between water particles
const createWaterConstraint = (bodyA, bodyB) => {
  return Matter.Constraint.create({
    bodyA: bodyA,
    bodyB: bodyB,
    stiffness: 0.03,
    damping: 0.1,
    render: {
      type: 'line',
      strokeStyle: WATER_COLOR,
      lineWidth: 1,
      opacity: 0.2
    }
  });
};

// Add water to the world
export const addWater = (engine, water) => {
  if (!engine || !water || water.length === 0) return;
  Matter.World.add(engine.world, water);
};

// Remove water from the world
export const removeWater = (engine, water) => {
  if (!engine || !water || water.length === 0) return;
  Matter.World.remove(engine.world, water);
};
