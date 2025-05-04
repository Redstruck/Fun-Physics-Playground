
import Matter from 'matter-js';

export const createBorderWalls = (dimensions) => {
  const Bodies = Matter.Bodies;
  const wallThickness = 20;
  const wallOptions = { isStatic: true, render: { fillStyle: '#333333' } };
  
  // Left wall
  const leftWall = Bodies.rectangle(
    -wallThickness / 2,
    dimensions.height / 2,
    wallThickness,
    dimensions.height,
    wallOptions
  );
  
  // Right wall
  const rightWall = Bodies.rectangle(
    dimensions.width + wallThickness / 2,
    dimensions.height / 2,
    wallThickness,
    dimensions.height,
    wallOptions
  );
  
  // Top wall
  const topWall = Bodies.rectangle(
    dimensions.width / 2,
    -wallThickness / 2,
    dimensions.width,
    wallThickness,
    wallOptions
  );
  
  return [leftWall, rightWall, topWall];
};

export const createBorderLockWalls = (dimensions) => {
  const Bodies = Matter.Bodies;
  const wallThickness = 20;
  const wallOptions = { 
    isStatic: true, 
    render: { fillStyle: 'rgba(150, 150, 150, 0.2)' } 
  };
  
  // Left wall
  const leftWall = Bodies.rectangle(
    -wallThickness / 2,
    dimensions.height / 2,
    wallThickness,
    dimensions.height,
    wallOptions
  );
  
  // Right wall
  const rightWall = Bodies.rectangle(
    dimensions.width + wallThickness / 2,
    dimensions.height / 2,
    wallThickness,
    dimensions.height,
    wallOptions
  );
  
  // Bottom wall
  const bottomWall = Bodies.rectangle(
    dimensions.width / 2,
    dimensions.height + wallThickness / 2,
    dimensions.width + wallThickness * 2,
    wallThickness,
    wallOptions
  );
  
  return [leftWall, rightWall, bottomWall];
};

export const addWalls = (engine, walls) => {
  if (!engine || !walls || walls.length === 0) return;
  Matter.World.add(engine.world, walls);
};

export const removeWalls = (engine, walls) => {
  if (!engine || !walls || walls.length === 0) return;
  Matter.World.remove(engine.world, walls);
};
