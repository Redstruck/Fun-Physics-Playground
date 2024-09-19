import React from 'react';
import PhysicsSimulator from '../components/PhysicsSimulator';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Physics Simulator</h1>
      <PhysicsSimulator />
    </div>
  );
};

export default Index;
