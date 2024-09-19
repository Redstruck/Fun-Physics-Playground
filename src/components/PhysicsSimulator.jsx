import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const colorPalettes = {
  default: ['#4285F4', '#EA4335', '#FBBC05', '#34A853'],
  pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA'],
  neon: ['#FF00FF', '#00FF00', '#00FFFF', '#FFFF00'],
  earth: ['#5D4037', '#795548', '#A1887F', '#D7CCC8'],
};

const PhysicsSimulator = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const [isCreatingCircle, setIsCreatingCircle] = useState(false);
  const [isCreatingRectangle, setIsCreatingRectangle] = useState(false);
  const [isCreatingTriangle, setIsCreatingTriangle] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState('default');

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

  const getRandomColor = () => {
    const palette = colorPalettes[selectedPalette];
    return palette[Math.floor(Math.random() * palette.length)];
  };

  const addShape = (shapeType) => {
    const World = Matter.World;
    const Bodies = Matter.Bodies;

    const x = 400; // Middle of the canvas
    const y = 300; // Middle of the canvas

    let shape;
    const color = getRandomColor();

    switch (shapeType) {
      case 'circle':
        shape = Bodies.circle(x, y, 20, {
          restitution: 0.8,
          render: { fillStyle: color }
        });
        break;
      case 'rectangle':
        shape = Bodies.rectangle(x, y, 40, 40, {
          restitution: 0.6,
          render: { fillStyle: color }
        });
        break;
      case 'triangle':
        shape = Bodies.polygon(x, y, 3, 30, {
          restitution: 0.5,
          render: { fillStyle: color }
        });
        break;
    }

    World.add(engineRef.current.world, [shape]);
  };

  useEffect(() => {
    let intervalId;
    if (isCreatingCircle || isCreatingRectangle || isCreatingTriangle) {
      intervalId = setInterval(() => {
        for (let i = 0; i < 5; i++) {
          if (isCreatingCircle) addShape('circle');
          if (isCreatingRectangle) addShape('rectangle');
          if (isCreatingTriangle) addShape('triangle');
        }
      }, 50);
    }
    return () => clearInterval(intervalId);
  }, [isCreatingCircle, isCreatingRectangle, isCreatingTriangle, selectedPalette]);

  return (
    <div className="flex flex-col items-center">
      <div ref={sceneRef} className="border border-gray-300 rounded-lg overflow-hidden" />
      <div className="mt-4 space-x-4 flex items-center">
        <Select value={selectedPalette} onValueChange={setSelectedPalette}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a color palette" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="pastel">Pastel</SelectItem>
            <SelectItem value="neon">Neon</SelectItem>
            <SelectItem value="earth">Earth</SelectItem>
          </SelectContent>
        </Select>
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
