import React, { useEffect, useState } from 'react';
import ParticleImage from 'react-particle-image';

const DragonFire = ({ dragonRef }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (dragonRef.current) {
        setPosition({
          x: dragonRef.current.position.x,
          y: dragonRef.current.position.y,
        });
      }
    };

    const interval = setInterval(updatePosition, 16); // 60fps

    return () => clearInterval(interval);
  }, [dragonRef]);

  const particleOptions = {
    filter: ({ x, y, image }) => {
      const pixel = image.get(x, y);
      return pixel.b > 50;
    },
    color: ({ x, y, image }) => {
      const pixel = image.get(x, y);
      return `rgb(${pixel.r}, ${pixel.g / 2}, 0)`;
    },
    radius: () => Math.random() * 1.5 + 0.5,
    mass: () => 20,
    friction: () => 0.15,
    initialVelocity: () => ({
      x: Math.random() * 4 - 2,
      y: Math.random() * -3 - 1,
    }),
  };

  return (
    <div style={{ position: 'absolute', left: position.x - 30, top: position.y - 30, pointerEvents: 'none' }}>
      <ParticleImage
        src="/fire.png"
        width={60}
        height={60}
        scale={1}
        entropy={5}
        maxParticles={1000}
        particleOptions={particleOptions}
      />
    </div>
  );
};

export default DragonFire;
