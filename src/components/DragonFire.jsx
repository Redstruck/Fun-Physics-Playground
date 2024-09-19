import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: 0,
        height: 0,
        pointerEvents: 'none',
      }}
    >
      {[...Array(20)].map((_, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,160,0,1) 0%, rgba(255,69,0,1) 100%)`,
          }}
          animate={{
            x: Math.random() * 40 - 20,
            y: Math.random() * -50 - 20,
            opacity: [1, 0],
            scale: [0, 1.5],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'loop',
            delay: index * 0.02,
          }}
        />
      ))}
    </motion.div>
  );
};

export default DragonFire;
