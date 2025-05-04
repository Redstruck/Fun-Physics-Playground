
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import SimulationCanvas from './SimulationCanvas';
import ControlPanel from './ControlPanel';
import ShapeControls from './ShapeControls';

const PhysicsSimulator = () => {
  const engineRef = useRef(null);
  const [isCreatingCircle, setIsCreatingCircle] = useState(false);
  const [isCreatingRectangle, setIsCreatingRectangle] = useState(false);
  const [isCreatingTriangle, setIsCreatingTriangle] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const [showBorders, setShowBorders] = useState(false);
  const [borderLock, setBorderLock] = useState(false);
  const wallsRef = useRef([]);
  const groundRef = useRef(null);
  const shapeRef = useRef([]);
  
  // Click-to-place mode state
  const [clickToPlaceMode, setClickToPlaceMode] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null);

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.querySelector('.physics-container');
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
      default:
        return;
    }

    if (shape) {
      World.add(engineRef.current.world, [shape]);
      shapeRef.current.push(shape);
    }
  };

  const clearAllShapes = () => {
    if (!engineRef.current) return;
    
    const World = Matter.World;
    
    if (shapeRef.current.length > 0) {
      World.remove(engineRef.current.world, shapeRef.current);
      shapeRef.current = [];
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

  // Shape creation interval
  useEffect(() => {
    let intervalId;
    if (!clickToPlaceMode && (isCreatingCircle || isCreatingRectangle || isCreatingTriangle)) {
      intervalId = setInterval(() => {
        for (let i = 0; i < 5; i++) {
          if (isCreatingCircle) addShape('circle');
          if (isCreatingRectangle) addShape('square');
          if (isCreatingTriangle) addShape('triangle');
        }
      }, 50);
    }
    return () => clearInterval(intervalId);
  }, [isCreatingCircle, isCreatingRectangle, isCreatingTriangle, clickToPlaceMode, dimensions.width, dimensions.height]);

  // Helper functions for shape interactions
  const handleInteractionStart = (setter) => {
    if (!clickToPlaceMode) {
      setter(true);
    }
  };

  const handleInteractionEnd = (setter) => {
    if (!clickToPlaceMode) {
      setter(false);
    }
  };

  // Handle shape button clicks for click-to-place mode
  const handleShapeButtonClick = (shapeType) => {
    if (clickToPlaceMode) {
      setSelectedShape(shapeType);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start gap-4 w-full physics-container">
      {/* Control Panel */}
      <ControlPanel 
        clickToPlaceMode={clickToPlaceMode}
        setClickToPlaceMode={setClickToPlaceMode}
        selectedShape={selectedShape}
      />

      {/* Main Content */}
      <div className="flex flex-col items-center w-full">
        <SimulationCanvas 
          dimensions={dimensions}
          onCanvasClick={handleCanvasClick}
          engineRef={engineRef}
          groundRef={groundRef}
          wallsRef={wallsRef}
          shapeRef={shapeRef}
          showBorders={showBorders}
          borderLock={borderLock}
        />
        <ShapeControls 
          handleShapeButtonClick={handleShapeButtonClick}
          handleInteractionStart={handleInteractionStart}
          handleInteractionEnd={handleInteractionEnd}
          selectedShape={selectedShape}
          clickToPlaceMode={clickToPlaceMode}
          clearAllShapes={clearAllShapes}
          toggleBorders={toggleBorders}
          toggleBorderLock={toggleBorderLock}
          showBorders={showBorders}
          borderLock={borderLock}
          setIsCreatingCircle={setIsCreatingCircle}
          setIsCreatingRectangle={setIsCreatingRectangle}
          setIsCreatingTriangle={setIsCreatingTriangle}
        />
      </div>
    </div>
  );
};

export default PhysicsSimulator;
