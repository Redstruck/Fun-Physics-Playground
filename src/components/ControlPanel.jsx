
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

const ControlPanel = ({ clickToPlaceMode, setClickToPlaceMode, selectedShape }) => {
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
      
      {clickToPlaceMode && (
        <div className="mt-2 text-sm text-gray-500">
          Selected shape: {selectedShape || 'None'}
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
