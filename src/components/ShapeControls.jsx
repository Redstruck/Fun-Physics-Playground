
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Square } from "lucide-react";

const ShapeControls = ({
  handleInteractionStart,
  handleInteractionEnd,
  handleShapeButtonClick,
  setIsCreatingCircle,
  setIsCreatingRectangle,
  setIsCreatingTriangle,
  clearAllShapes,
  toggleBorders,
  toggleBorderLock,
  showBorders,
  borderLock,
  clickToPlaceMode,
  selectedShape
}) => {
  return (
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
  );
};

export default ShapeControls;
