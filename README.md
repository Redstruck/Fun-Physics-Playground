# Fun Physics Playground

A browser-based physics sandbox built with React and Vite.
Designed as a hands-on playground for experimenting with gravity, shape spawning, and interactive simulations.

🔗 **Live Demo:** https://fun-physics-playground.vercel.app/

---

## Overview

Fun Physics Playground is an interactive 2D physics simulator that runs entirely in the browser.
It lets you create shapes, drop them into the scene, and watch them respond to the simulation in real time.

The project is intentionally lightweight and exploratory: the core focus is fast iteration, tactile interaction, and learning by building a small but complete simulation experience.

---

## Key Features

- Interactive physics canvas for real-time simulation
- Shape creation for circles, squares, and triangles
- Click-to-place mode for more precise object placement
- Controls for clearing the scene and toggling borders
- Responsive layout that works across desktop and mobile
- Built around a compact, easy-to-extend component structure

---

## Tech Stack

- **React** — application logic and UI
- **Vite** — development and build tooling
- **Tailwind CSS** — styling
- **Matter.js** — physics simulation engine
- **shadcn/ui** — reusable UI components

---

## Project Structure

The app is organized around a small simulation surface and supporting controls:

- `src/components/PhysicsSimulator.jsx` — main simulation wrapper
- `src/components/SimulationCanvas.jsx` — rendering and physics canvas
- `src/components/ShapeControls.jsx` — shape creation and scene actions
- `src/components/ControlPanel.jsx` — interaction mode controls
- `src/utils/physicsEngine.js` — physics engine setup and lifecycle helpers
- `src/utils/shapeUtils.js` — shape creation and placement helpers

---

## Running Locally

### Prerequisites

- Node.js
- npm

### Setup

```bash
git clone <your-repo-url>
cd Fun-Physics-Playground
npm install
npm run dev
```

---

## Development Notes

This project is built as an exploratory playground rather than a rigid engine.
The code favors simple controls, direct interaction, and small focused utilities that make it easy to experiment with new physics behaviors.
