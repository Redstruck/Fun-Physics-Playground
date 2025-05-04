import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const SimulationCanvas = ({
  isCreatingCircle,
  isCreatingRectangle,
  isCreatingTriangle,
  showBorders,
  borderLock,
  clickToPlaceMode,
  selectedShape
}) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const wallsRef = useRef([]);
  const groundRef = useRef(null);
  const shapeRef = useRef([]);
  
  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      const container = sceneRef.current?.parentElement;
      if (container) {
        const width = Math.min(container.clientWidth - 32, 1000);
        const height = width * 0.9;
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
    groundRef.current = ground;
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
        }
      } else {
        removeBorderLockWalls();
        // Re-add borders if they were enabled
        if (showBorders) {
          addBorderWalls();
        }
      }
    }
  }, [borderLock, dimensions]);

  // Function to handle click-to-place logic
  const handleCanvasClick = (event) => {
    if (!clickToPlaceMode || !selectedShape || !engineRef.current) return;

    // Get canvas element and its bounding rect
    const canvas = engineRef.current.render.canvas;
    const rect = canvas.getBoundingClientRect();

    // Calculate the position relative to the canvas
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    console.log("Canvas clicked:", { x, y, selectedShape });
    
    // Add the shape at the click position
    addShape(selectedShape, x, y);
  };

  // Add shape at specific position
  const addShape = (shapeType, x = dimensions.width / 2, y = dimensions.height / 2) => {
    if (!engineRef.current) return;
    
    const World = Matter.World;
    const Bodies = Matter.Bodies;

    let shape;
    switch (shapeType) {
      case 'circle':
        shape = Bodies.circle(x, y, 20, {
          restitution: 0.8,
          render: { fillStyle: '#4285F4' }
        });
        break;
      case 'square':
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

    if (shape) {
      console.log("Adding shape:", shapeType, "at position:", x, y);
      World.add(engineRef.current.world, [shape]);
      // Add to shapes array for tracking
      shapeRef.current.push(shape);
    }
  };

  // Improved shape creation interval with both mouse and touch support
  useEffect(() => {
    let intervalId;
    // Only use interval for auto-spawning when not in click-to-place mode
    if (!clickToPlaceMode && (isCreatingCircle || isCreatingRectangle || isCreatingTriangle)) {
      intervalId = setInterval(() => {
        for (let i = 0; i < 5; i++) { // Create 5 shapes per interval
          if (isCreatingCircle) addShape('circle');
          if (isCreatingRectangle) addShape('square');
          if (isCreatingTriangle) addShape('triangle');
        }
      }, 50); // Reduced interval to 50ms for faster creation
    }
    return () => clearInterval(intervalId);
  }, [isCreatingCircle, isCreatingRectangle, isCreatingTriangle, clickToPlaceMode]);

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

  const clearAllShapes = () => {
    const World = Matter.World;
    
    // Only remove the shapes, not the walls or ground
    if (shapeRef.current.length > 0) {
      World.remove(engineRef.current.world, shapeRef.current);
      shapeRef.current = []; // Reset the shapes array
    }
    
    // Re-add the current border configuration if needed
    if (showBorders) {
      // Ensure borders are still active
      addBorderWalls();
    } else if (borderLock) {
      // Ensure border lock is still active
      addBorderLockWalls();
    }
  };

  return (
    <div 
      ref={sceneRef} 
      className="border border-gray-300 rounded-lg overflow-hidden max-w-full" 
      onClick={handleCanvasClick}
      style={{ cursor: clickToPlaceMode && selectedShape ? 'crosshair' : 'default' }}
    />
  );
};

export default SimulationCanvas;
