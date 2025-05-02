import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Button } from "@/components/ui/button";
import { Trash2, Square } from "lucide-react";

const PhysicsSimulator = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const [isCreatingCircle, setIsCreatingCircle] = useState(false);
  const [isCreatingRectangle, setIsCreatingRectangle] = useState(false);
  const [isCreatingTriangle, setIsCreatingTriangle] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [showBorders, setShowBorders] = useState(false);
  const [borderLock, setBorderLock] = useState(false);
  const wallsRef = useRef([]);

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
      { isStatic: true, render: { fillStyle: '#333333' } }
    );
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
  }, [dimensions]);

  // Effect to handle borders when showBorders changes
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
  }, [showBorders, dimensions]);

  // Effect to handle border lock when borderLock changes
  useEffect(() => {
    if (engineRef.current) {
      if (borderLock) {
        addBorderLockWalls();
        // If both are enabled, remove regular borders as border lock will take precedence
        if (showBorders) {
          removeBorderWalls();
          setShowBorders(false);
        }
      } else {
        removeBorderLockWalls();
      }
    }
  }, [borderLock, dimensions]);

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

  const toggleBorders = () => {
    setShowBorders(prevState => !prevState);
    if (!showBorders && borderLock) {
      // Turn off border lock if enabling regular borders
      setBorderLock(false);
    }
  };

  const toggleBorderLock = () => {
    setBorderLock(prevState => !prevState);
    if (!borderLock && showBorders) {
      // Turn off regular borders if enabling border lock
      setShowBorders(false);
    }
  };

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

  // Improved shape creation interval with both mouse and touch support
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

  // Helper function to handle both mouse and touch events
  const handleInteractionStart = (setter) => {
    setter(true);
  };

  const handleInteractionEnd = (setter) => {
    setter(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div ref={sceneRef} className="border border-gray-300 rounded-lg overflow-hidden max-w-full" />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 w-full max-w-[800px]">
        <Button
          onMouseDown={() => handleInteractionStart(setIsCreatingCircle)}
          onMouseUp={() => handleInteractionEnd(setIsCreatingCircle)}
          onMouseLeave={() => handleInteractionEnd(setIsCreatingCircle)}
          onTouchStart={(e) => { e.preventDefault(); handleInteractionStart(setIsCreatingCircle); }}
          onTouchEnd={(e) => { e.preventDefault(); handleInteractionEnd(setIsCreatingCircle); }}
          className="w-full"
        >
          Add Circles
        </Button>
        <Button
          onMouseDown={() => handleInteractionStart(setIsCreatingRectangle)}
          onMouseUp={() => handleInteractionEnd(setIsCreatingRectangle)}
          onMouseLeave={() => handleInteractionEnd(setIsCreatingRectangle)}
          onTouchStart={(e) => { e.preventDefault(); handleInteractionStart(setIsCreatingRectangle); }}
          onTouchEnd={(e) => { e.preventDefault(); handleInteractionEnd(setIsCreatingRectangle); }}
          className="w-full"
        >
          Add Rectangles
        </Button>
        <Button
          onMouseDown={() => handleInteractionStart(setIsCreatingTriangle)}
          onMouseUp={() => handleInteractionEnd(setIsCreatingTriangle)}
          onMouseLeave={() => handleInteractionEnd(setIsCreatingTriangle)}
          onTouchStart={(e) => { e.preventDefault(); handleInteractionStart(setIsCreatingTriangle); }}
          onTouchEnd={(e) => { e.preventDefault(); handleInteractionEnd(setIsCreatingTriangle); }}
          className="w-full"
        >
          Add Triangles
        </Button>
        <Button 
          onClick={clearAllShapes}
          onTouchStart={(e) => { e.preventDefault(); clearAllShapes(); }}
          variant="destructive"
          className="w-full"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
        <Button 
          onClick={toggleBorders}
          onTouchStart={(e) => { e.preventDefault(); toggleBorders(); }}
          variant={showBorders ? "secondary" : "outline"}
          className="w-full"
        >
          <Square className="h-4 w-4 mr-2" />
          {showBorders ? "Hide Borders" : "Show Borders"}
        </Button>
        <Button 
          onClick={toggleBorderLock}
          onTouchStart={(e) => { e.preventDefault(); toggleBorderLock(); }}
          variant={borderLock ? "secondary" : "outline"}
          className="w-full"
        >
          <Square className="h-4 w-4 mr-2" />
          {borderLock ? "Unlock Borders" : "Lock Borders"}
        </Button>
      </div>
    </div>
  );
};

export default PhysicsSimulator;
