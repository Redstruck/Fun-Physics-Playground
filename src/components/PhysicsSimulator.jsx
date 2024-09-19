import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Button } from "@/components/ui/button";
import DragonFire from './DragonFire';
import ShapeCreator from './ShapeCreator';
import { setupPhysics, handleKeyDown, addShape, triggerLightning } from '../utils/physicsUtils';

const PhysicsSimulator = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const dragonRef = useRef(null);
  const [isLightning, setIsLightning] = useState(false);

  useEffect(() => {
    const { engine, dragon } = setupPhysics(sceneRef, engineRef, dragonRef);

    window.addEventListener('keydown', (e) => handleKeyDown(e, dragon));

    const moveInterval = setInterval(() => {
      const force = 0.001;
      const randomDirection = Math.random() * Math.PI * 2;
      Matter.Body.applyForce(dragon, dragon.position, {
        x: Math.cos(randomDirection) * force,
        y: Math.sin(randomDirection) * force
      });
    }, 100);

    const lightningInterval = setInterval(() => {
      if (Math.random() < 0.005) {
        triggerLightning(engineRef.current, setIsLightning);
      }
    }, 100);

    return () => {
      Matter.Render.stop(engine.render);
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(moveInterval);
      clearInterval(lightningInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div 
        ref={sceneRef} 
        className={`border border-gray-300 rounded-lg overflow-hidden ${isLightning ? 'bg-yellow-200' : ''}`} 
        style={{ position: 'relative' }}
      >
        {isLightning && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.8)',
              zIndex: 10,
            }}
          />
        )}
        <DragonFire dragonRef={dragonRef} />
      </div>
      <ShapeCreator addShape={(type) => addShape(type, engineRef.current)} />
      <p className="mt-4 text-sm text-gray-600">Use arrow keys to control the dragon</p>
    </div>
  );
};

export default PhysicsSimulator;
