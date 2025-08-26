import { useCallback, useState, useRef, useEffect } from 'react';
import {
	Map,
	Source,
	Layer,
	Marker,
	Popup,
	NavigationControl,
} from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import { MAPBOX_CONFIG } from '../config/mapbox';
import { useDroneStore, type Drone } from '../store/droneStore';
import { DroneIcon } from '../icons/DroneIcon';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
	getDroneColor,
	GREEN_DRONE_COLOR,
	RED_DRONE_COLOR,
} from '../utils/drones';

export const DroneMap = () => {
	const { drones, trajectories, selectedDroneId, selectDrone } =
		useDroneStore();
	const mapRef = useRef<MapRef>(null);

	const [mapInitialized, setMapInitialized] = useState(false);
	const [mapError, setMapError] = useState<string | null>(null);
	const [popupInfo, setPopupInfo] = useState<{
		longitude: number;
		latitude: number;
		drone: Drone;
	} | null>(null);

	const onMapLoad = useCallback(() => {
		setMapInitialized(true);
		setMapError(null);
	}, []);

	const onMapError = useCallback(() => {
		setMapError('Failed to load map. Please check your Mapbox token.');
	}, []);

	const handleMapClick = useCallback(() => {
		// Unselect drone when clicking on empty map area
		if (selectedDroneId) {
			selectDrone(null);
		}
	}, [selectedDroneId, selectDrone]);

	// Navigate to selected drone when it changes
	useEffect(() => {
		if (mapRef.current && selectedDroneId && mapInitialized) {
			const drone = drones.get(selectedDroneId);
			if (drone) {
				mapRef.current.flyTo({
					center: [drone.coordinates[0], drone.coordinates[1]],
					zoom: 15,
					duration: 2000,
				});
			}
		}
	}, [selectedDroneId, mapInitialized, drones]);

	// Check if Mapbox token is available
	if (!MAPBOX_CONFIG.ACCESS_TOKEN) {
		return (
			<div className='w-full bg-gray-100 rounded-lg flex items-center justify-center'>
				<div className='text-center p-6'>
					<div className='text-red-500 text-4xl mb-4'>🗺️</div>
					<h3 className='text-lg font-semibold text-gray-800 mb-2'>
						Map Loading Error
					</h3>
					<p className='text-gray-600 mb-4'>
						Mapbox access token is missing. Please add VITE_MAPBOX_ACCESS_TOKEN
						to your .env file
					</p>
					<div className='bg-blue-50 border border-blue-200 rounded-lg p-4 text-left'>
						<p className='text-sm text-blue-800 font-medium mb-2'>
							To fix this:
						</p>
						<ol className='text-sm text-blue-700 list-decimal list-inside space-y-1'>
							<li>
								Create a <code className='bg-blue-100 px-1 rounded'>.env</code>{' '}
								file in the frontend directory
							</li>
							<li>
								Add your Mapbox access token:{' '}
								<code className='bg-blue-100 px-1 rounded'>
									VITE_MAPBOX_ACCESS_TOKEN=your_token_here
								</code>
							</li>
							<li>
								Get a token from{' '}
								<a
									href='https://account.mapbox.com/access-tokens/'
									target='_blank'
									rel='noopener noreferrer'
									className='underline'
								>
									Mapbox Account
								</a>
							</li>
							<li>Restart the development server</li>
						</ol>
					</div>
				</div>
			</div>
		);
	}

	const trajectoryFeatures = Array.from(trajectories.values())
		.filter((trajectory) => {
			return trajectory.coordinates.length > 1; // Only show trajectories with at least 2 points
		})
		.map((trajectory) => {
			return {
				type: 'Feature' as const,
				geometry: {
					type: 'LineString' as const,
					coordinates: trajectory.coordinates,
				},
				properties: {
					droneId: trajectory.droneId,
				},
			};
		});

	const trajectoryData = {
		type: 'FeatureCollection' as const,
		features: trajectoryFeatures,
	};

	return (
		<div className='relative w-full h-full'>
			<Map
				ref={mapRef}
				mapboxAccessToken={MAPBOX_CONFIG.ACCESS_TOKEN}
				initialViewState={{
					longitude: MAPBOX_CONFIG.DEFAULT_VIEWPORT.longitude,
					latitude: MAPBOX_CONFIG.DEFAULT_VIEWPORT.latitude,
					zoom: MAPBOX_CONFIG.DEFAULT_VIEWPORT.zoom,
					pitch: 45,
					bearing: 0,
				}}
				style={{
					width: '100%',
					height: 'calc(100vh-200px)',
					minHeight: '600px',
				}}
				mapStyle={MAPBOX_CONFIG.MAP_STYLE}
				onLoad={onMapLoad}
				onError={onMapError}
				onClick={handleMapClick}
				interactiveLayerIds={['drone-markers']}
			>
				{/* Navigation Control */}
				<NavigationControl position='top-right' />

				<Source
					id='trajectories'
					type='geojson'
					data={trajectoryData}
				>
					<Layer
						id='trajectory-lines'
						type='line'
						paint={{
							'line-color': [
								'case',
								['>=', ['index-of', '-B', ['get', 'droneId']], 0], // contains "-B"
								GREEN_DRONE_COLOR, // green
								RED_DRONE_COLOR, // red
							],
							'line-width': 2,
							'line-opacity': 0.8,
						}}
					/>
				</Source>

				{/* Test trajectory to verify layer is working */}
				<Source
					id='test-trajectory'
					type='geojson'
					data={{
						type: 'FeatureCollection',
						features: [
							{
								type: 'Feature',
								geometry: {
									type: 'LineString',
									coordinates: [
										[
											MAPBOX_CONFIG.DEFAULT_VIEWPORT.longitude - 0.01,
											MAPBOX_CONFIG.DEFAULT_VIEWPORT.latitude - 0.01,
										],
										[
											MAPBOX_CONFIG.DEFAULT_VIEWPORT.longitude + 0.01,
											MAPBOX_CONFIG.DEFAULT_VIEWPORT.latitude + 0.01,
										],
									],
								},
								properties: { droneId: 'test' },
							},
						],
					}}
				></Source>

				{/* Drone Markers */}
				{Array.from(drones.values()).map((drone) => {
					const color = getDroneColor(drone.id);
					const isSelected = selectedDroneId === drone.id;
					console.log(drone.yaw);
					return (
						<Marker
							key={drone.id}
							longitude={drone.coordinates[0]}
							latitude={drone.coordinates[1]}
							anchor='center'
						>
							<div
								className={`cursor-pointer transition-all duration-200 hover:scale-110 ${
									isSelected
										? 'ring-4 ring-blue-500 rounded-full ring-opacity-75'
										: ''
								}`}
								onClick={(e) => {
									e.stopPropagation();
									selectDrone(drone.id);
								}}
								style={{
									transform: `rotate(-${drone.yaw}deg)`,
									transformOrigin: 'center',
								}}
								onMouseEnter={() =>
									setPopupInfo({
										longitude: drone.coordinates[0],
										latitude: drone.coordinates[1],
										drone,
									})
								}
								onMouseLeave={() => setPopupInfo(null)}
							>
								<div
									style={{ borderLeftColor: color }}
									className='absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-16'
								/>

								<div
									className='w-10 h-10 rounded-full flex items-center justify-center shadow-lg'
									style={{ backgroundColor: color }}
								>
									<DroneIcon className='w-6 h-6' />
								</div>
							</div>
						</Marker>
					);
				})}

				{/* Popup for drone info */}
				{popupInfo && (
					<Popup
						longitude={popupInfo.longitude}
						latitude={popupInfo.latitude}
						anchor='bottom'
						onClose={() => setPopupInfo(null)}
						closeButton={true}
						closeOnClick={false}
						maxWidth='300px'
					>
						<div className='p-2'>
							<h4 className='font-semibold text-gray-800 mb-2'>
								{popupInfo.drone.name}
							</h4>
							<div className='space-y-1 text-sm text-gray-600'>
								<p>
									<strong>Registration:</strong> {popupInfo.drone.registration}
								</p>
								<p>
									<strong>Altitude:</strong> {popupInfo.drone.altitude}m
								</p>
								<p>
									<strong>Pilot:</strong> {popupInfo.drone.pilot}
								</p>
								<p>
									<strong>Flight Time:</strong>{' '}
									{Math.floor((Date.now() - popupInfo.drone.timestamp) / 1000)}s
								</p>
								<p>
									<strong>Yaw:</strong> {popupInfo.drone.yaw}°
								</p>
							</div>
						</div>
					</Popup>
				)}
			</Map>

			{/* Legend */}
			<div className='absolute top-10 left-10 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg text-sm'>
				<h4 className='font-semibold text-gray-800 mb-2'>Legend</h4>
				<div className='space-y-2'>
					<div className='flex items-center space-x-2'>
						<div className='w-4 h-4 bg-green-500 rounded-full'></div>
						<span className='text-gray-700'>Green: Flying (contains -B)</span>
					</div>
					<div className='flex items-center space-x-2'>
						<div className='w-4 h-4 bg-red-500 rounded-full'></div>
						<span className='text-gray-700'>Red: Grounded (no -B)</span>
					</div>
				</div>
			</div>

			{mapError && (
				<div className='absolute top-2 right-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded z-10'>
					{mapError}
				</div>
			)}
		</div>
	);
};
