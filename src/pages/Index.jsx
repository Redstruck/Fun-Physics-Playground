
import React from 'react';
import PhysicsSimulator from '../components/PhysicsSimulator';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8 text-center">Physics Simulator</h1>
      <div className="w-full max-w-[800px]">
        <PhysicsSimulator />
      </div>
    </div>
  );
};

export default Index;
