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

  const ground = Matter.Bodies.rectangle(400, 590, 800, 20, { isStatic: true });
  
  const dragon = Matter.Bodies.circle(400, 300, 30, {
    mass: 50,
    render: {
      sprite: {
        texture: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 72 72"><path fill="%23D22F27" d="M17.5 14.5s1.875 6.813 3 11c1.125 4.188 1.375 11.563 1.375 11.563L7 45.938s6.625-1.126 11.375-2.376c4.75-1.25 10.688-3.437 10.688-3.437s-1.438 5.438-2.438 9.313c-1 3.874-1.688 11.124-1.688 11.124l14.126-8.187s-.313 3.437-.313 5.687s.688 4.376.688 4.376l7.437-5.563s.125-3.062.125-5.187c0-2.126-.688-6.063-.688-6.063l14.126 8.187s-.687-7.25-1.687-11.124c-1-3.875-2.438-9.313-2.438-9.313s5.938 2.187 10.688 3.437C71.375 44.812 78 45.938 78 45.938l-14.875-8.875s.25-7.375 1.375-11.563c1.125-4.187 3-11 3-11L53.563 24.75s-3.938-4.563-6.938-6.563s-9.188-3.624-9.188-3.624s-6.187 1.624-9.187 3.624s-6.938 6.563-6.938 6.563L17.5 14.5z"/><path fill="%23EA5A47" d="M36.01 15.166c-1.509.415-4.506 1.17-7.073 2.959c-3.25 2.266-6.938 6.563-6.938 6.563L17.5 14.5s1.875 6.813 3 11c1.125 4.188 1.375 11.563 1.375 11.563L7 45.938s6.625-1.126 11.375-2.376c4.75-1.25 10.688-3.437 10.688-3.437s-1.438 5.438-2.438 9.313c-1 3.874-1.688 11.124-1.688 11.124l14.126-8.187s-.313 3.437-.313 5.687s.688 4.376.688 4.376l1.573-1.178V15.166z"/></svg>',
        xScale: 1,
        yScale: 1
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