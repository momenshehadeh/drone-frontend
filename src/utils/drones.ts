export const GREEN_DRONE_COLOR = '#10B981';
export const RED_DRONE_COLOR = '#EF4444';

export const isFlyingDrone = (droneId: string) => {
	return droneId.includes('-B');
};

export const getDroneColor = (droneId: string) => {
	return isFlyingDrone(droneId) ? GREEN_DRONE_COLOR : RED_DRONE_COLOR;
};
