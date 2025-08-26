# Sager Drone Fleet Frontend

A ReactJS application for real-time drone visualization on Mapbox maps.

## Features

- 🛸 Real-time drone tracking on interactive Mapbox maps
- 📊 Live dashboard with drone statistics
- 📍 Drone trajectories and paths
- 🎯 Color-coded drones (Green: B-registered, Red: Others)
- 📱 Responsive design with modern UI
- 🔌 WebSocket connection to backend
- 📈 Performance optimized for thousands of drones

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the frontend directory:
```env
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
VITE_BACKEND_URL=http://localhost:9013
```

3. Start the development server:
```bash
npm run dev
```

## Backend Requirements

Make sure your backend is running on port 9013 with Socket.IO support.

## Technologies Used

- React 19
- TypeScript
- Mapbox GL JS
- Socket.IO Client
- Zustand (State Management)
- Tailwind CSS
- Vite

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx   # Statistics dashboard
│   ├── DroneList.tsx   # Sidebar drone list
│   ├── DroneMap.tsx    # Mapbox map component
│   ├── Layout.tsx      # Main layout wrapper
│   └── ...
├── store/              # Zustand state management
│   └── droneStore.ts   # Drone data store
├── hooks/              # Custom React hooks
│   └── useWebSocket.ts # WebSocket connection
├── types/              # TypeScript type definitions
│   └── drone.ts        # Drone data types
└── config/             # Configuration files
    └── mapbox.ts       # Mapbox settings
```

## Usage

1. **Map View**: See all drones on the map with real-time updates
2. **Dashboard**: View statistics and drone distribution
3. **Drone List**: Click drones to select and view details
4. **Hover Effects**: Hover over drones to see popup information
5. **Trajectories**: View drone flight paths from when the page opened

## Performance Features

- Efficient drone data management with Map data structures
- Trajectory data limited to last 100 points per drone
- Optimized re-renders with Zustand state management
- WebSocket connection for real-time updates
