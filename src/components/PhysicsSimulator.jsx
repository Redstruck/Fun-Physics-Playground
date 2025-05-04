
import React, { useState } from 'react';
import SimulationCanvas from './SimulationCanvas';
import ControlPanel from './ControlPanel';
import ShapeControls from './ShapeControls';

const PhysicsSimulator = () => {
  const [isCreatingCircle, setIsCreatingCircle] = useState(false);
  const [isCreatingRectangle, setIsCreatingRectangle] = useState(false);
  const [isCreatingTriangle, setIsCreatingTriangle] = useState(false);
  const [showBorders, setShowBorders] = useState(false);
  const [borderLock, setBorderLock] = useState(false);
  const [clickToPlaceMode, setClickToPlaceMode] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null); // 'circle', 'square', or 'triangle'

  // Handler for toggling borders
  const toggleBorders = () => {
    setShowBorders(prevState => !prevState);
    if (!showBorders && borderLock) {
      // Turn off border lock if enabling regular borders
      setBorderLock(false);
    }
  };

  // Handler for toggling border lock
  const toggleBorderLock = () => {
    setBorderLock(prevState => !prevState);
    if (!borderLock && showBorders) {
      // Turn off regular borders if enabling border lock
      setShowBorders(false);
    }
  };

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
      <ControlPanel 
        clickToPlaceMode={clickToPlaceMode}
        setClickToPlaceMode={setClickToPlaceMode}
        selectedShape={selectedShape}
      />
      <div className="flex flex-col items-center w-full">
        <SimulationCanvas 
          isCreatingCircle={isCreatingCircle}
          isCreatingRectangle={isCreatingRectangle}
          isCreatingTriangle={isCreatingTriangle}
          showBorders={showBorders}
          borderLock={borderLock}
          clickToPlaceMode={clickToPlaceMode}
          selectedShape={selectedShape}
        />
        <ShapeControls 
          handleInteractionStart={handleInteractionStart}
          handleInteractionEnd={handleInteractionEnd}
          handleShapeButtonClick={handleShapeButtonClick}
          setIsCreatingCircle={setIsCreatingCircle}
          setIsCreatingRectangle={setIsCreatingRectangle}
          setIsCreatingTriangle={setIsCreatingTriangle}
          clearAllShapes={() => {}} // This will be implemented in SimulationCanvas
          toggleBorders={toggleBorders}
          toggleBorderLock={toggleBorderLock}
          showBorders={showBorders}
          borderLock={borderLock}
          clickToPlaceMode={clickToPlaceMode}
          selectedShape={selectedShape}
        />
      </div>
    </div>
  );
};

export default PhysicsSimulator;
