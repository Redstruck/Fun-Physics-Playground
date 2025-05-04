
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Button } from "@/components/ui/button";
import { Trash2, Square } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const PhysicsSimulator = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const [isCreatingCircle, setIsCreatingCircle] = useState(false);
  const [isCreatingRectangle, setIsCreatingRectangle] = useState(false);
  const [isCreatingTriangle, setIsCreatingTriangle] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 }); // Increased height to 800px
  const [showBorders, setShowBorders] = useState(false);
  const [borderLock, setBorderLock] = useState(false);
  const wallsRef = useRef([]);
  const groundRef = useRef(null); // Reference to the ground body
  const shapeRef = useRef([]); // Reference to keep track of shapes separately from walls
  
  // New state variables for click-to-place mode
  const [clickToPlaceMode, setClickToPlaceMode] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null); // 'circle', 'square', or 'triangle'

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      const container = sceneRef.current?.parentElement;
      if (container) {
        const width = Math.min(container.clientWidth - 32, 1000); // Increased max width to 1000px
        const height = width * 0.9; // Increased height ratio for taller canvas
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

  const addShape = (shapeType, x = dimensions.width / 2, y = dimensions.height / 2) => {
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
      World.add(engineRef.current.world, [shape]);
      // Add to shapes array for tracking
      shapeRef.current.push(shape);
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

  // New function to handle click-to-place
  const handleCanvasClick = (event) => {
    if (!clickToPlaceMode || !selectedShape || !engineRef.current) return;

    // Get canvas element and its bounding rect
    const canvas = engineRef.current.render.canvas;
    const rect = canvas.getBoundingClientRect();

    // Calculate the position relative to the canvas
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    // Add the shape at the click position
    addShape(selectedShape, x, y);
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

  // Helper function to handle both mouse and touch events
  const handleInteractionStart = (setter) => {
    if (!clickToPlaceMode) {
      // Original behavior when click-to-place is off
      setter(true);
    }
  };

  const handleInteractionEnd = (setter) => {
    if (!clickToPlaceMode) {
      // Original behavior when click-to-place is off
      setter(false);
    }
  };

  // Handle shape button clicks for click-to-place mode
  const handleShapeButtonClick = (shapeType) => {
    if (clickToPlaceMode) {
      // In click-to-place mode, select the shape type
      setSelectedShape(shapeType);
    }
    // If not in click-to-place mode, the regular button press/release
    // handling will take care of spawning shapes
  };

  return (
    <div className="flex flex-col md:flex-row items-start gap-4 w-full">
      {/* Control Panel */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-64 flex flex-col gap-3">
        <h2 className="text-lg font-semibold mb-2">Controls</h2>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="click-to-place" 
            checked={clickToPlaceMode}
            onCheckedChange={setClickToPlaceMode}
          />
          <label 
            htmlFor="click-to-place" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Click-to-Place Mode
          </label>
        </div>
        
        {clickToPlaceMode && (
          <div className="mt-2 text-sm text-gray-500">
            Selected shape: {selectedShape || 'None'}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center w-full">
        <div 
          ref={sceneRef} 
          className="border border-gray-300 rounded-lg overflow-hidden max-w-full" 
          onClick={handleCanvasClick}
        />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 w-full max-w-[800px]">
          <Button
            onMouseDown={() => handleInteractionStart(setIsCreatingCircle)}
            onMouseUp={() => handleInteractionEnd(setIsCreatingCircle)}
            onMouseLeave={() => handleInteractionEnd(setIsCreatingCircle)}
            onTouchStart={(e) => { e.preventDefault(); handleInteractionStart(setIsCreatingCircle); }}
            onTouchEnd={(e) => { e.preventDefault(); handleInteractionEnd(setIsCreatingCircle); }}
            onClick={() => handleShapeButtonClick('circle')}
            className={`w-full ${selectedShape === 'circle' && clickToPlaceMode ? 'bg-primary/70' : ''}`}
          >
            Add Circles
          </Button>
          <Button
            onMouseDown={() => handleInteractionStart(setIsCreatingRectangle)}
            onMouseUp={() => handleInteractionEnd(setIsCreatingRectangle)}
            onMouseLeave={() => handleInteractionEnd(setIsCreatingRectangle)}
            onTouchStart={(e) => { e.preventDefault(); handleInteractionStart(setIsCreatingRectangle); }}
            onTouchEnd={(e) => { e.preventDefault(); handleInteractionEnd(setIsCreatingRectangle); }}
            onClick={() => handleShapeButtonClick('square')}
            className={`w-full ${selectedShape === 'square' && clickToPlaceMode ? 'bg-primary/70' : ''}`}
          >
            Add Squares
          </Button>
          <Button
            onMouseDown={() => handleInteractionStart(setIsCreatingTriangle)}
            onMouseUp={() => handleInteractionEnd(setIsCreatingTriangle)}
            onMouseLeave={() => handleInteractionEnd(setIsCreatingTriangle)}
            onTouchStart={(e) => { e.preventDefault(); handleInteractionStart(setIsCreatingTriangle); }}
            onTouchEnd={(e) => { e.preventDefault(); handleInteractionEnd(setIsCreatingTriangle); }}
            onClick={() => handleShapeButtonClick('triangle')}
            className={`w-full ${selectedShape === 'triangle' && clickToPlaceMode ? 'bg-primary/70' : ''}`}
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
            {!showBorders && <span className="mr-2">🔲</span>}
            {showBorders ? "Open Borders" : "Close Borders"}
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
    </div>
  );
};

export default PhysicsSimulator;
