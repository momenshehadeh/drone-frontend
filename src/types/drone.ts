export interface Drone {
	id: string;
	serial: string;
	registration: string;
	name: string;
	altitude: number;
	pilot: string;
	organization: string;
	yaw: number;
}

// Drone data type from the backend
export interface DroneData {
	type: string;
	features: Array<{
		type: string;
		properties: {
			serial: string;
			registration: string;
			Name: string;
			altitude: number;
			pilot: string;
			organization: string;
			yaw: number;
		};
		geometry: {
			coordinates: [number, number];
			type: string;
		};
	}>;
}
