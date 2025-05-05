
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Waves } from "lucide-react";

const ControlPanel = ({ clickToPlaceMode, setClickToPlaceMode, selectedShape, onAddWater }) => {
  return (
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
      
      {clickToPlaceMode && selectedShape && (
        <div className="mt-2 text-sm text-gray-500">
          Selected shape: {selectedShape}
        </div>
      )}
      
      {clickToPlaceMode && !selectedShape && (
        <div className="mt-2 text-sm text-gray-500">
          Click on a shape button to select a shape type
        </div>
      )}

      <Button 
        onClick={onAddWater}
        className="w-full mt-2 bg-cyan-600 hover:bg-cyan-700"
      >
        <Waves className="h-4 w-4 mr-2" />
        Add Water
      </Button>
    </div>
  );
};

export default ControlPanel;
