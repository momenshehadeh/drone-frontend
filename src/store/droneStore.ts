import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DroneData } from '../types/drone';
import { getDroneColor, isFlyingDrone } from '../utils/drones';

export interface Drone {
	id: string;
	serial: string;
	registration: string;
	name: string;
	altitude: number;
	pilot: string;
	organization: string;
	yaw: number;
	coordinates: [number, number];
	timestamp: number;
}

export interface DroneTrajectory {
	droneId: string;
	coordinates: Array<[number, number]>;
	timestamps: number[];
}

interface DroneStore {
	// State
	drones: Map<string, Drone>;
	trajectories: Map<string, DroneTrajectory>;
	selectedDroneId: string | null;
	hoveredDroneId: string | null;

	// Actions
	addDrone: (droneData: DroneData) => void;
	selectDrone: (droneId: string | null) => void;

	// Computed values
	getDroneById: (id: string) => Drone | undefined;
	getAllDrones: () => Drone[];
	getRedDronesCount: () => number;
	getDroneColor: (registration: string) => string;
}

export const useDroneStore = create<DroneStore>()(
	devtools(
		(set, get) => ({
			// Initial state
			drones: new Map(),
			trajectories: new Map(),
			selectedDroneId: null,
			hoveredDroneId: null,

			// Actions
			addDrone: (droneData: DroneData) => {
				const timestamp = Date.now();

				droneData.features.forEach((feature) => {
					const droneId = feature.properties.registration;
					const drone: Drone = {
						id: droneId,
						serial: feature.properties.serial,
						registration: feature.properties.registration,
						name: feature.properties.Name,
						altitude: feature.properties.altitude,
						pilot: feature.properties.pilot,
						organization: feature.properties.organization,
						yaw: feature.properties.yaw,
						coordinates: feature.geometry.coordinates,
						timestamp,
					};

					set((state) => {
						const newDrones = new Map(state.drones);
						newDrones.set(droneId, drone);

						// Update trajectory
						const newTrajectories = new Map(state.trajectories);
						const existingTrajectory = newTrajectories.get(droneId);

						if (existingTrajectory) {
							// Create new trajectory object with updated coordinates
							const updatedCoordinates = [
								...existingTrajectory.coordinates,
								feature.geometry.coordinates,
							];
							const updatedTimestamps = [
								...existingTrajectory.timestamps,
								timestamp,
							];

							// Keep only last 100 points for performance
							const finalCoordinates =
								updatedCoordinates.length > 100
									? updatedCoordinates.slice(-100)
									: updatedCoordinates;
							const finalTimestamps =
								updatedTimestamps.length > 100
									? updatedTimestamps.slice(-100)
									: updatedTimestamps;

							// Create new trajectory object (don't mutate existing)
							newTrajectories.set(droneId, {
								droneId,
								coordinates: finalCoordinates,
								timestamps: finalTimestamps,
							});
						} else {
							// Create new trajectory with initial coordinate
							newTrajectories.set(droneId, {
								droneId,
								coordinates: [feature.geometry.coordinates],
								timestamps: [timestamp],
							});
						}

						return {
							drones: newDrones,
							trajectories: newTrajectories,
						};
					});
				});
			},

			selectDrone: (droneId: string | null) => {
				set({ selectedDroneId: droneId });
			},

			// Computed values
			getDroneById: (id: string) => {
				return get().drones.get(id);
			},

			getAllDrones: () => {
				return Array.from(get().drones.values());
			},

			getRedDronesCount: () => {
				return Array.from(get().drones.values()).filter(
					(drone) => !isFlyingDrone(drone.id)
				).length;
			},

			getDroneColor: (droneId: string) => {
				return getDroneColor(droneId);
			},
		}),
		{
			name: 'drone-store',
		}
	)
);
