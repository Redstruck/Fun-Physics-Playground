
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const PhysicsSimulator = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const [isCreatingCircle, setIsCreatingCircle] = useState(false);
  const [isCreatingRectangle, setIsCreatingRectangle] = useState(false);
  const [isCreatingTriangle, setIsCreatingTriangle] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      const container = sceneRef.current?.parentElement;
      if (container) {
        const width = Math.min(container.clientWidth - 32, 800); // Max width 800px with some padding
        const height = width * 0.75; // Maintain 4:3 aspect ratio
        setDimensions({ width, height });
        
        // Update renderer if it exists
        if (engineRef.current?.render) {
          engineRef.current.render.options.width = width;
          engineRef.current.render.options.height = height;
          engineRef.current.render.canvas.width = width;
          engineRef.current.render.canvas.height = height;
          Matter.Render.setPixelRatio(engineRef.current.render, window.devicePixelRatio);
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

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
        width: dimensions.width,
        height: dimensions.height,
        wireframes: false,
        background: '#f4f4f4',
        pixelRatio: window.devicePixelRatio
      }
    });

    // Create ground based on current dimensions
    const ground = Bodies.rectangle(
      dimensions.width / 2, 
      dimensions.height - 10, 
      dimensions.width, 
      20, 
      { isStatic: true }
    );
    World.add(engine.world, [ground]);

    Engine.run(engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
        render.canvas = null;
        render.context = null;
        render.textures = {};
      }
    };
  }, [dimensions]);

  const addShape = (shapeType) => {
    const World = Matter.World;
    const Bodies = Matter.Bodies;

    const x = dimensions.width / 2; // Middle of the canvas
    const y = dimensions.height / 2; // Middle of the canvas

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
  };

  const clearAllShapes = () => {
    const World = Matter.World;
    const Composite = Matter.Composite;
    
    // Get all bodies except the ground (which is at index 0)
    const bodies = Composite.allBodies(engineRef.current.world).slice(1);
    
    // Remove all bodies except the ground
    World.remove(engineRef.current.world, bodies);
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
    <div className="flex flex-col items-center w-full">
      <div ref={sceneRef} className="border border-gray-300 rounded-lg overflow-hidden max-w-full" />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-[800px]">
        <Button
          onMouseDown={() => setIsCreatingCircle(true)}
          onMouseUp={() => setIsCreatingCircle(false)}
          onMouseLeave={() => setIsCreatingCircle(false)}
          onTouchStart={() => setIsCreatingCircle(true)}
          onTouchEnd={() => setIsCreatingCircle(false)}
          className="w-full"
        >
          Add Circles
        </Button>
        <Button
          onMouseDown={() => setIsCreatingRectangle(true)}
          onMouseUp={() => setIsCreatingRectangle(false)}
          onMouseLeave={() => setIsCreatingRectangle(false)}
          onTouchStart={() => setIsCreatingRectangle(true)}
          onTouchEnd={() => setIsCreatingRectangle(false)}
          className="w-full"
        >
          Add Rectangles
        </Button>
        <Button
          onMouseDown={() => setIsCreatingTriangle(true)}
          onMouseUp={() => setIsCreatingTriangle(false)}
          onMouseLeave={() => setIsCreatingTriangle(false)}
          onTouchStart={() => setIsCreatingTriangle(true)}
          onTouchEnd={() => setIsCreatingTriangle(false)}
          className="w-full"
        >
          Add Triangles
        </Button>
        <Button 
          onClick={clearAllShapes} 
          variant="destructive"
          className="w-full"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>
    </div>
  );
};

export default PhysicsSimulator;
