
import React from 'react';
import PhysicsSimulator from '../components/PhysicsSimulator';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Physics Simulator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Create shapes and watch physics in action
        </p>
      </div>
      <div className="w-full max-w-[1000px]">
        <PhysicsSimulator />
      </div>
    </div>
  );
};

export default Index;
