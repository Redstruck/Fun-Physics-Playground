import Matter from 'matter-js';

export const setupPhysics = (sceneRef, engineRef, dragonRef) => {
  const engine = Matter.Engine.create();
  engineRef.current = engine;

  const render = Matter.Render.create({
    element: sceneRef.current,
    engine: engine,
    options: {
      width: 800,
      height: 600,
      wireframes: false,
      background: '#f4f4f4'
    }
  });

  const ground = Matter.Bodies.rectangle(400, 590, 800, 20, { 
    isStatic: true,
    render: {
      fillStyle: '#2e2e2e'
    }
  });
  
  const dragonImage = '/dragon.png'; // Use a local image in the public folder
  const dragon = Matter.Bodies.circle(400, 300, 30, {
    mass: 50,
    render: {
      sprite: {
        texture: dragonImage,
        xScale: 0.6,
        yScale: 0.6
      }
    },
    label: 'dragon'
  });
  dragonRef.current = dragon;

  Matter.World.add(engine.world, [ground, dragon]);

  Matter.Engine.run(engine);
  Matter.Render.run(render);

  return { engine, dragon };
};

export const handleKeyDown = (event, dragon) => {
  const force = 0.002;
  switch (event.key) {
    case 'ArrowUp':
      Matter.Body.applyForce(dragon, dragon.position, { x: 0, y: -force });
      break;
    case 'ArrowDown':
      Matter.Body.applyForce(dragon, dragon.position, { x: 0, y: force });
      break;
    case 'ArrowLeft':
      Matter.Body.applyForce(dragon, dragon.position, { x: -force, y: 0 });
      break;
    case 'ArrowRight':
      Matter.Body.applyForce(dragon, dragon.position, { x: force, y: 0 });
      break;
  }
};

export const addShape = (shapeType, engine) => {
  if (!shapeType) return;

  const x = Math.random() * 800;
  const y = Math.random() * 300;

  let shape;
  switch (shapeType) {
    case 'circle':
      shape = Matter.Bodies.circle(x, y, 20, {
        restitution: 0.8,
        render: { fillStyle: '#4285F4' }
      });
      break;
    case 'rectangle':
      shape = Matter.Bodies.rectangle(x, y, 40, 40, {
        restitution: 0.6,
        render: { fillStyle: '#EA4335' }
      });
      break;
    case 'triangle':
      shape = Matter.Bodies.polygon(x, y, 3, 30, {
        restitution: 0.5,
        render: { fillStyle: '#FBBC05' }
      });
      break;
  }

  Matter.World.add(engine.world, [shape]);

  Matter.Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair;
      if (bodyA.label === 'dragon' || bodyB.label === 'dragon') {
        const shapeToRemove = bodyA.label === 'dragon' ? bodyB : bodyA;
        Matter.World.remove(engine.world, shapeToRemove);
      }
    });
  });
};

export const triggerLightning = (engine, setIsLightning) => {
  setIsLightning(true);
  const shapes = engine.world.bodies.filter(body => body.label !== 'dragon' && !body.isStatic);
  shapes.forEach(shape => {
    Matter.World.remove(engine.world, shape);
  });
  setTimeout(() => setIsLightning(false), 500);
};
