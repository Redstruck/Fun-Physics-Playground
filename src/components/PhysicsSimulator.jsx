import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Button } from "@/components/ui/button";

const PhysicsSimulator = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
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
    World.add(engine.world, [ground]);

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

  const addShape = (shapeType) => {
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Common = Matter.Common;

    const x = Common.random(100, 700);
    const y = Common.random(0, 100);

    let shape;
    switch (shapeType) {
      case 'circle':
        shape = Bodies.circle(x, y, 30, {
          restitution: 0.8,
          render: { fillStyle: '#4285F4' }
        });
        break;
      case 'rectangle':
        shape = Bodies.rectangle(x, y, 60, 60, {
          restitution: 0.6,
          render: { fillStyle: '#EA4335' }
        });
        break;
      case 'triangle':
        shape = Bodies.polygon(x, y, 3, 40, {
          restitution: 0.5,
          render: { fillStyle: '#FBBC05' }
        });
        break;
    }

    World.add(engineRef.current.world, [shape]);
  };

  useEffect(() => {
    let intervalId;
    if (isCreatingCircle || isCreatingRectangle || isCreatingTriangle) {
      intervalId = setInterval(() => {
        if (isCreatingCircle) addShape('circle');
        if (isCreatingRectangle) addShape('rectangle');
        if (isCreatingTriangle) addShape('triangle');
      }, 100); // Create a shape every 100ms
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
    </div>
  );
};

export default PhysicsSimulator;
