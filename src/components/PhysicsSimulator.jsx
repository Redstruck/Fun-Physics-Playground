import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Button } from "@/components/ui/button";

const PhysicsSimulator = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const dragonRef = useRef(null);
  const [isCreatingCircle, setIsCreatingCircle] = useState(false);
  const [isCreatingRectangle, setIsCreatingRectangle] = useState(false);
  const [isCreatingTriangle, setIsCreatingTriangle] = useState(false);

  useEffect(() => {
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;

    const engine = Engine.create();
    engineRef.current = engine;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: '#f4f4f4'
      }
    });

    const ground = Bodies.rectangle(400, 590, 800, 20, { isStatic: true });
    
    // Create dragon with increased mass
    const dragon = Bodies.circle(400, 300, 30, {
      mass: 50, // Increased mass to make it much heavier
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

    World.add(engine.world, [ground, dragon]);

    Engine.run(engine);
    Render.run(render);

    // Add keyboard controls for the dragon
    window.addEventListener('keydown', handleKeyDown);

    // Add automatic movement to the dragon
    const moveInterval = setInterval(() => {
      const force = 0.001; // Reduced force due to increased mass
      const randomDirection = Math.random() * Math.PI * 2;
      Matter.Body.applyForce(dragon, dragon.position, {
        x: Math.cos(randomDirection) * force,
        y: Math.sin(randomDirection) * force
      });
    }, 100); // Apply force every 100ms

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(moveInterval);
    };
  }, []);

  const handleKeyDown = (event) => {
    const dragon = dragonRef.current;
    if (!dragon) return;

    const force = 0.002; // Reduced force for better control due to increased mass
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

  const addShape = (shapeType) => {
    const World = Matter.World;
    const Bodies = Matter.Bodies;

    const x = Math.random() * 800; // Random x position
    const y = Math.random() * 300; // Random y position in the upper half

    let shape;
    switch (shapeType) {
      case 'circle':
        shape = Bodies.circle(x, y, 20, {
          restitution: 0.8,
          render: { fillStyle: '#4285F4' }
        });
        break;
      case 'rectangle':
        shape = Bodies.rectangle(x, y, 40, 40, {
          restitution: 0.6,
          render: { fillStyle: '#EA4335' }
        });
        break;
      case 'triangle':
        shape = Bodies.polygon(x, y, 3, 30, {
          restitution: 0.5,
          render: { fillStyle: '#FBBC05' }
        });
        break;
    }

    World.add(engineRef.current.world, [shape]);

    // Check for collisions
    Matter.Events.on(engineRef.current, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        if (bodyA.label === 'dragon' || bodyB.label === 'dragon') {
          const shapeToRemove = bodyA.label === 'dragon' ? bodyB : bodyA;
          Matter.World.remove(engineRef.current.world, shapeToRemove);
        }
      });
    });
  };

  useEffect(() => {
    let intervalId;
    if (isCreatingCircle || isCreatingRectangle || isCreatingTriangle) {
      intervalId = setInterval(() => {
        for (let i = 0; i < 5; i++) { // Create 5 shapes per interval
          if (isCreatingCircle) addShape('circle');
          if (isCreatingRectangle) addShape('rectangle');
          if (isCreatingTriangle) addShape('triangle');
        }
      }, 50); // Reduced interval to 50ms for faster creation
    }
    return () => clearInterval(intervalId);
  }, [isCreatingCircle, isCreatingRectangle, isCreatingTriangle]);

  return (
    <div className="flex flex-col items-center">
      <div ref={sceneRef} className="border border-gray-300 rounded-lg overflow-hidden" />
      <div className="mt-4 space-x-4">
        <Button
          onMouseDown={() => setIsCreatingCircle(true)}
          onMouseUp={() => setIsCreatingCircle(false)}
          onMouseLeave={() => setIsCreatingCircle(false)}
        >
          Add Circles
        </Button>
        <Button
          onMouseDown={() => setIsCreatingRectangle(true)}
          onMouseUp={() => setIsCreatingRectangle(false)}
          onMouseLeave={() => setIsCreatingRectangle(false)}
        >
          Add Rectangles
        </Button>
        <Button
          onMouseDown={() => setIsCreatingTriangle(true)}
          onMouseUp={() => setIsCreatingTriangle(false)}
          onMouseLeave={() => setIsCreatingTriangle(false)}
        >
          Add Triangles
        </Button>
      </div>
      <p className="mt-4 text-sm text-gray-600">Use arrow keys to control the dragon</p>
    </div>
  );
};

export default PhysicsSimulator;
