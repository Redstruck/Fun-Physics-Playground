import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { Button } from "@/components/ui/button";

const PhysicsSimulator = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;

    // Create an engine
    const engine = Engine.create();
    engineRef.current = engine;

    // Create a renderer
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

    // Create ground
    const ground = Bodies.rectangle(400, 590, 800, 20, { isStatic: true });

    // Add ground to the world
    World.add(engine.world, [ground]);

    // Run the engine
    Engine.run(engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

  const addCircle = () => {
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const circle = Bodies.circle(400, 50, 30, {
      restitution: 0.8,
      render: { fillStyle: '#4285F4' }
    });
    World.add(engineRef.current.world, [circle]);
  };

  const addRectangle = () => {
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const rectangle = Bodies.rectangle(400, 50, 60, 60, {
      restitution: 0.6,
      render: { fillStyle: '#EA4335' }
    });
    World.add(engineRef.current.world, [rectangle]);
  };

  const addTriangle = () => {
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const triangle = Bodies.polygon(400, 50, 3, 40, {
      restitution: 0.5,
      render: { fillStyle: '#FBBC05' }
    });
    World.add(engineRef.current.world, [triangle]);
  };

  return (
    <div className="flex flex-col items-center">
      <div ref={sceneRef} className="border border-gray-300 rounded-lg overflow-hidden" />
      <div className="mt-4 space-x-4">
        <Button onClick={addCircle}>Add Circle</Button>
        <Button onClick={addRectangle}>Add Rectangle</Button>
        <Button onClick={addTriangle}>Add Triangle</Button>
      </div>
    </div>
  );
};

export default PhysicsSimulator;