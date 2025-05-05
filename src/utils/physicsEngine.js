
import Matter from 'matter-js';

export const createPhysicsEngine = (containerRef, dimensions) => {
  const Engine = Matter.Engine;
  const Render = Matter.Render;
  
  // Create engine with improved solver for fluid simulation
  const engine = Engine.create({
    positionIterations: 6,
    velocityIterations: 4,
    constraintIterations: 2,
    enableSleeping: false
  });
  
  const render = Render.create({
    element: containerRef,
    engine: engine,
    options: {
      width: dimensions.width,
      height: dimensions.height,
      wireframes: false,
      background: '#f4f4f4',
      pixelRatio: window.devicePixelRatio,
      showSleeping: false,
      showDebug: false,
      showBroadphase: false,
      showBounds: false,
      showVelocity: false,
      showCollisions: false
    }
  });
  
  // Set gravity
  engine.world.gravity.y = 0.98;
  
  return { engine, render };
};

export const startPhysicsEngine = (engine, render) => {
  Matter.Engine.run(engine);
  Matter.Render.run(render);
};

export const stopPhysicsEngine = (render, engine) => {
  if (render) {
    Matter.Render.stop(render);
    if (render.canvas) {
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    }
  }
  
  if (engine) {
    Matter.World.clear(engine.world);
    Matter.Engine.clear(engine);
  }
};

export const updatePhysicsRendererDimensions = (render, width, height) => {
  if (!render) return;
  
  render.options.width = width;
  render.options.height = height;
  render.canvas.width = width;
  render.canvas.height = height;
  Matter.Render.setPixelRatio(render, window.devicePixelRatio);
};
