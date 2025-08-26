import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useDroneStore } from '../store/droneStore';
import type { DroneData } from '../types/drone';

export const useWebSocket = () => {
	const [isConnected, setIsConnected] = useState(false);
	const [lastMessage, setLastMessage] = useState<DroneData | null>(null);
	const { addDrone } = useDroneStore();

	useEffect(() => {
		const newSocket = io(
			import.meta.env.VITE_BACKEND_URL || 'http://localhost:9013',
			{
				transports: ['polling'],
			}
		);

		newSocket.on('connect', () => {
			console.log('Connected to server');
			setIsConnected(true);
		});

		newSocket.on('disconnect', () => {
			console.log('Disconnected from server');
			setIsConnected(false);
		});

		newSocket.on('message', (data: DroneData) => {
			console.log('Received drone data:', data);
			setLastMessage(data);

			// Add drones to the store
			addDrone(data);
		});

		return () => {
			newSocket.close();
		};
	}, [addDrone]);

	return { isConnected, lastMessage };
};
