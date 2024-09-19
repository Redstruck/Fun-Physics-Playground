import React from 'react';
import { Button } from "@/components/ui/button";

const ShapeCreator = ({ addShape }) => {
  return (
    <div className="mt-4 space-x-4">
      <Button
        onMouseDown={() => addShape('circle')}
        onMouseUp={() => addShape(null)}
        onMouseLeave={() => addShape(null)}
      >
        Add Circles
      </Button>
      <Button
        onMouseDown={() => addShape('rectangle')}
        onMouseUp={() => addShape(null)}
        onMouseLeave={() => addShape(null)}
      >
        Add Rectangles
      </Button>
      <Button
        onMouseDown={() => addShape('triangle')}
        onMouseUp={() => addShape(null)}
        onMouseLeave={() => addShape(null)}
      >
        Add Triangles
      </Button>
    </div>
  );
};

export default ShapeCreator;