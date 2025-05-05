
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Square, Circle, Triangle } from "lucide-react";

const ShapeControls = ({
  handleInteractionStart,
  handleInteractionEnd,
  handleShapeButtonClick,
  setIsCreatingCircle,
  setIsCreatingRectangle,
  setIsCreatingTriangle,
  clearAllShapes,
  toggleBorders,
  showBorders,
  clickToPlaceMode,
  selectedShape
}) => {
  // Improved handler for touch interactions
  const handleTouchStart = (e, setter) => {
    e.preventDefault();
    handleInteractionStart(setter);
  };
  
  const handleTouchEnd = (e, setter) => {
    e.preventDefault();
    handleInteractionEnd(setter);
  };
  
  // Improved handler to ensure shape selection works on mobile
  const handleButtonClick = (e, shapeType) => {
    e.preventDefault();
    handleShapeButtonClick(shapeType);
  };

  // New handler specifically for touch selection in Click-to-Place mode
  const handleTouchSelection = (e, shapeType) => {
    e.preventDefault();
    handleShapeButtonClick(shapeType);
  };

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 w-full max-w-[800px]">
      <Button
        onMouseDown={() => handleInteractionStart(setIsCreatingCircle)}
        onMouseUp={() => handleInteractionEnd(setIsCreatingCircle)}
        onMouseLeave={() => handleInteractionEnd(setIsCreatingCircle)}
        onTouchStart={(e) => {
          if (clickToPlaceMode) {
            handleTouchSelection(e, 'circle');
          } else {
            handleTouchStart(e, setIsCreatingCircle);
          }
        }}
        onTouchEnd={(e) => {
          if (!clickToPlaceMode) {
            handleTouchEnd(e, setIsCreatingCircle);
          }
        }}
        onClick={(e) => handleButtonClick(e, 'circle')}
        className={`w-full ${selectedShape === 'circle' && clickToPlaceMode ? 'bg-primary/70' : ''}`}
      >
        <Circle className="h-4 w-4 mr-2" />
        Add Circles
      </Button>
      <Button
        onMouseDown={() => handleInteractionStart(setIsCreatingRectangle)}
        onMouseUp={() => handleInteractionEnd(setIsCreatingRectangle)}
        onMouseLeave={() => handleInteractionEnd(setIsCreatingRectangle)}
        onTouchStart={(e) => {
          if (clickToPlaceMode) {
            handleTouchSelection(e, 'square');
          } else {
            handleTouchStart(e, setIsCreatingRectangle);
          }
        }}
        onTouchEnd={(e) => {
          if (!clickToPlaceMode) {
            handleTouchEnd(e, setIsCreatingRectangle);
          }
        }}
        onClick={(e) => handleButtonClick(e, 'square')}
        className={`w-full ${selectedShape === 'square' && clickToPlaceMode ? 'bg-primary/70' : ''}`}
      >
        <Square className="h-4 w-4 mr-2" />
        Add Squares
      </Button>
      <Button
        onMouseDown={() => handleInteractionStart(setIsCreatingTriangle)}
        onMouseUp={() => handleInteractionEnd(setIsCreatingTriangle)}
        onMouseLeave={() => handleInteractionEnd(setIsCreatingTriangle)}
        onTouchStart={(e) => {
          if (clickToPlaceMode) {
            handleTouchSelection(e, 'triangle');
          } else {
            handleTouchStart(e, setIsCreatingTriangle);
          }
        }}
        onTouchEnd={(e) => {
          if (!clickToPlaceMode) {
            handleTouchEnd(e, setIsCreatingTriangle);
          }
        }}
        onClick={(e) => handleButtonClick(e, 'triangle')}
        className={`w-full ${selectedShape === 'triangle' && clickToPlaceMode ? 'bg-primary/70' : ''}`}
      >
        <Triangle className="h-4 w-4 mr-2" />
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
    </div>
  );
};

export default ShapeControls;
