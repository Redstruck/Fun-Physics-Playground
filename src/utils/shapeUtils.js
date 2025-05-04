
import Matter from 'matter-js';

export const createShape = (shapeType, x, y) => {
  const Bodies = Matter.Bodies;
  
  switch (shapeType) {
    case 'circle':
      return Bodies.circle(x, y, 20, {
        restitution: 0.8,
        render: { fillStyle: '#4285F4' }
      });
    case 'square':
      return Bodies.rectangle(x, y, 40, 40, {
        restitution: 0.6,
        render: { fillStyle: '#EA4335' }
      });
    case 'triangle':
      return Bodies.polygon(x, y, 3, 30, {
        restitution: 0.5,
        render: { fillStyle: '#FBBC05' }
      });
    default:
      console.warn("Unknown shape type:", shapeType);
      return null;
  }
};

export const createGround = (width, height) => {
  const Bodies = Matter.Bodies;
  
  return Bodies.rectangle(
    width / 2, 
    height - 10, 
    width, 
    20, 
    { isStatic: true, render: { fillStyle: '#333333' } }
  );
};

export const addShape = (engine, shape) => {
  if (!engine || !shape) return;
  Matter.World.add(engine.world, [shape]);
};

export const clearShapes = (engine, shapes) => {
  if (!engine || shapes.length === 0) return;
  Matter.World.remove(engine.world, shapes);
};

export const handleCanvasClick = (event, render, engine, selectedShape) => {
  if (!render || !render.canvas || !engine) {
    console.error("Renderer or canvas not available");
    return null;
  }
  
  const canvas = render.canvas;
  const rect = canvas.getBoundingClientRect();

  // Calculate the position relative to the canvas
  const x = (event.clientX - rect.left) * (canvas.width / rect.width);
  const y = (event.clientY - rect.top) * (canvas.height / rect.height);

  console.log("Canvas clicked:", { x, y, selectedShape });
  
  // Create the shape
  const shape = createShape(selectedShape, x, y);
  if (shape) {
    // Add the shape to the world
    addShape(engine, shape);
    return shape;
  }
  
  return null;
};
