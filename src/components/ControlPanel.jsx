
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

const ControlPanel = ({ clickToPlaceMode, setClickToPlaceMode, selectedShape }) => {
  return (
    <div className="bg-card border-2 border-border p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full md:w-64 flex flex-col gap-4">
      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
        Controls
      </h2>
      
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors duration-200">
        <Checkbox 
          id="click-to-place" 
          checked={clickToPlaceMode}
          onCheckedChange={setClickToPlaceMode}
          className="border-2"
        />
        <label 
          htmlFor="click-to-place" 
          className="text-sm font-medium leading-none cursor-pointer select-none"
        >
          Click-to-Place Mode
        </label>
      </div>
      
      {clickToPlaceMode && selectedShape && (
        <div className="mt-1 px-3 py-2 text-sm text-primary font-medium bg-primary/10 rounded-lg border border-primary/20">
          Selected: <span className="capitalize">{selectedShape}</span>
        </div>
      )}
      
      {clickToPlaceMode && !selectedShape && (
        <div className="mt-1 px-3 py-2 text-sm text-muted-foreground bg-muted rounded-lg">
          Select a shape button below
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
