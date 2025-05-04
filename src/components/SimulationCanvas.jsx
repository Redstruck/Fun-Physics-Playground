
import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const SimulationCanvas = ({ 
  dimensions, 
  onCanvasClick, 
  engineRef,
  groundRef,
  wallsRef,
  shapeRef,
  showBorders,
  borderLock 
}) => {
  const sceneRef = useRef(null);

  // Setup the physics engine and renderer
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
      { isStatic: true, render: { fillStyle: '#333333' } }
    );
    groundRef.current = ground; // Store reference to ground
    World.add(engine.world, [ground]);

    Engine.run(engine);
    Render.run(render);

    // Add initial borders if showBorders is true
    if (showBorders) {
      addBorderWalls();
    }
    
    // Add border lock if enabled
    if (borderLock) {
      addBorderLockWalls();
    }

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
  }, [dimensions, engineRef, groundRef, wallsRef, showBorders, borderLock]);

  // Handle borders based on showBorders state
  useEffect(() => {
    if (engineRef.current) {
      if (showBorders) {
        addBorderWalls();
        // If both are enabled, remove border lock as it would be redundant
        if (borderLock) {
          removeBorderLockWalls();
        }
      } else {
        removeBorderWalls();
        // Re-add border lock walls if it's enabled
        if (borderLock) {
          addBorderLockWalls();
        }
      }
    }
  }, [showBorders, dimensions, engineRef, wallsRef, borderLock]);

  // Handle border lock when borderLock changes
  useEffect(() => {
    if (engineRef.current) {
      if (borderLock) {
        addBorderLockWalls();
        // If both are enabled, remove regular borders as border lock will take precedence
        if (showBorders) {
          removeBorderWalls();
        }
      } else {
        removeBorderLockWalls();
      }
    }
  }, [borderLock, dimensions, engineRef, wallsRef, showBorders]);

  const addBorderWalls = () => {
    // Remove any existing walls first
    removeBorderWalls();

    const World = Matter.World;
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
    
    const walls = [leftWall, rightWall, topWall];
    World.add(engineRef.current.world, walls);
    wallsRef.current = walls;
  };

  const removeBorderWalls = () => {
    if (wallsRef.current.length > 0 && engineRef.current) {
      const World = Matter.World;
      World.remove(engineRef.current.world, wallsRef.current);
      wallsRef.current = [];
    }
  };

  // Function to add border lock walls (sides and bottom only)
  const addBorderLockWalls = () => {
    // Remove any existing walls first
    removeBorderLockWalls();

    const World = Matter.World;
    const Bodies = Matter.Bodies;

    const wallThickness = 20;
    const wallOptions = { 
      isStatic: true, 
      render: { 
        // Make walls semi-transparent to indicate they're invisible boundaries
        fillStyle: 'rgba(150, 150, 150, 0.2)' 
      } 
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
    
    // Bottom wall (already exists as ground, but making it wider to ensure coverage)
    const bottomWall = Bodies.rectangle(
      dimensions.width / 2,
      dimensions.height + wallThickness / 2,
      dimensions.width + wallThickness * 2,
      wallThickness,
      wallOptions
    );
    
    const walls = [leftWall, rightWall, bottomWall];
    World.add(engineRef.current.world, walls);
    wallsRef.current = walls;
  };

  const removeBorderLockWalls = () => {
    if (wallsRef.current.length > 0 && engineRef.current) {
      const World = Matter.World;
      World.remove(engineRef.current.world, wallsRef.current);
      wallsRef.current = [];
    }
  };

  return (
    <div 
      ref={sceneRef} 
      className="border border-gray-300 rounded-lg overflow-hidden max-w-full" 
      onClick={onCanvasClick}
    />
  );
};

export default SimulationCanvas;
