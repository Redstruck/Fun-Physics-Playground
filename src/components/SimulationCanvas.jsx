import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import Matter from 'matter-js';
import { createPhysicsEngine, startPhysicsEngine, stopPhysicsEngine, updatePhysicsRendererDimensions } from '../utils/physicsEngine';
import { createShape, createGround, addShape, clearShapes, handleCanvasClick } from '../utils/shapeUtils';
import { createBorderWalls, createBorderLockWalls, addWalls, removeWalls } from '../utils/borderUtils';

const SimulationCanvas = forwardRef(({
  isCreatingCircle,
  isCreatingRectangle,
  isCreatingTriangle,
  showBorders,
  borderLock,
  clickToPlaceMode,
  selectedShape
}, ref) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const wallsRef = useRef([]);
  const groundRef = useRef(null);
  const shapeRef = useRef([]);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    clearAllShapes: () => {
      if (engineRef.current && shapeRef.current.length > 0) {
        clearShapes(engineRef.current, shapeRef.current);
        shapeRef.current = [];
      }
    }
  }));

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      const container = sceneRef.current?.parentElement;
      if (container) {
        const width = Math.min(container.clientWidth - 32, 1000);
        const height = width * 0.9;
        setDimensions({ width, height });
        
        // Update renderer if it exists
        if (renderRef.current) {
          updatePhysicsRendererDimensions(renderRef.current, width, height);
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize physics engine
  useEffect(() => {
    // Create physics engine
    const { engine, render } = createPhysicsEngine(sceneRef.current, dimensions);
    engineRef.current = engine;
    renderRef.current = render;

    // Create ground based on current dimensions
    const ground = createGround(dimensions.width, dimensions.height);
    groundRef.current = ground;
    Matter.World.add(engine.world, [ground]);

    // Start the engine
    startPhysicsEngine(engine, render);

    // Add initial borders if showBorders is true
    if (showBorders) {
      const walls = createBorderWalls(dimensions);
      addWalls(engine, walls);
      wallsRef.current = walls;
    }
    
    // Add border lock if enabled
    if (borderLock) {
      const walls = createBorderLockWalls(dimensions);
      addWalls(engine, walls);
      wallsRef.current = walls;
    }

    // Cleanup
    return () => {
      stopPhysicsEngine(render, engine);
    };
  }, [dimensions]);

  // Effect to handle borders when showBorders changes
  useEffect(() => {
    if (engineRef.current) {
      if (showBorders) {
        const walls = createBorderWalls(dimensions);
        addWalls(engineRef.current, walls);
        wallsRef.current = walls;
        
        // If both are enabled, remove border lock as it would be redundant
        if (borderLock) {
          removeWalls(engineRef.current, wallsRef.current);
          wallsRef.current = [];
        }
      } else {
        removeWalls(engineRef.current, wallsRef.current);
        wallsRef.current = [];
        
        // Re-add border lock walls if it's enabled
        if (borderLock) {
          const walls = createBorderLockWalls(dimensions);
          addWalls(engineRef.current, walls);
          wallsRef.current = walls;
        }
      }
    }
  }, [showBorders, dimensions]);

  // Effect to handle border lock when borderLock changes
  useEffect(() => {
    if (engineRef.current) {
      if (borderLock) {
        const walls = createBorderLockWalls(dimensions);
        addWalls(engineRef.current, walls);
        wallsRef.current = walls;
        
        // If both are enabled, remove regular borders as border lock will take precedence
        if (showBorders) {
          removeWalls(engineRef.current, wallsRef.current);
          wallsRef.current = [];
        }
      } else {
        removeWalls(engineRef.current, wallsRef.current);
        wallsRef.current = [];
        
        // Re-add borders if they were enabled
        if (showBorders) {
          const walls = createBorderWalls(dimensions);
          addWalls(engineRef.current, walls);
          wallsRef.current = walls;
        }
      }
    }
  }, [borderLock, dimensions]);

  // Function to handle click-to-place logic
  const handleCanvasClicking = (event) => {
    if (!clickToPlaceMode || !selectedShape || !engineRef.current) {
      return;
    }
    
    const shape = handleCanvasClick(event, renderRef.current, engineRef.current, selectedShape);
    if (shape) {
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
          let shape;
          if (isCreatingCircle) {
            shape = createShape('circle', dimensions.width / 2, dimensions.height / 2);
          } else if (isCreatingRectangle) {
            shape = createShape('square', dimensions.width / 2, dimensions.height / 2);
          } else if (isCreatingTriangle) {
            shape = createShape('triangle', dimensions.width / 2, dimensions.height / 2);
          }
          
          if (shape) {
            addShape(engineRef.current, shape);
            shapeRef.current.push(shape);
          }
        }
      }, 50); // Reduced interval to 50ms for faster creation
    }
    return () => clearInterval(intervalId);
  }, [isCreatingCircle, isCreatingRectangle, isCreatingTriangle, clickToPlaceMode, dimensions]);

  return (
    <div 
      ref={sceneRef} 
      className="border-2 border-border rounded-xl overflow-hidden max-w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card" 
      onClick={handleCanvasClicking}
      style={{ cursor: clickToPlaceMode && selectedShape ? 'crosshair' : 'default' }}
    />
  );
});

export default SimulationCanvas;
