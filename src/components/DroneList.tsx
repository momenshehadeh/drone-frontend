import { useDroneStore } from '../store/droneStore';
import { formatFlightTime } from '../utils/dates';

export const DroneList = () => {
	const { drones, selectedDroneId, getDroneColor, selectDrone } =
		useDroneStore();
	const allDrones = Array.from(drones.values());

	return (
		<div className='bg-white w-full rounded-lg shadow-lg p-4 overflow-hidden'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-xl font-bold text-gray-800'>Active Drones</h2>
				<span className='text-sm text-gray-500'>{allDrones.length} drones</span>
			</div>

			<div className='space-y-2 overflow-y-auto min-h-[600px] h-[calc(100vh-200px)]'>
				{allDrones.length === 0 ? (
					<div className='text-center text-gray-500 py-8'>
						<div className='text-4xl mb-2'>🛸</div>
						<p>No drones detected</p>
						<p className='text-sm'>Waiting for connection...</p>
					</div>
				) : (
					allDrones.map((drone) => {
						const isSelected = selectedDroneId === drone.id;
						const color = getDroneColor(drone.registration);

						return (
							<div
								key={drone.id}
								onClick={() => selectDrone(drone.id)}
								className={`
									p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
									${
										isSelected
											? 'border-blue-500 bg-blue-50 shadow-md'
											: 'border-gray-200 hover:border-gray-300'
									}
								`}
							>
								<div className='flex items-center justify-between mb-2'>
									<div className='flex items-center space-x-2'>
										<div
											className='w-3 h-3 rounded-full'
											style={{ backgroundColor: color }}
										/>
										<span className='font-semibold text-gray-800'>
											{drone.registration}
										</span>
									</div>
									<span className='text-xs text-gray-500'>
										{formatFlightTime(drone.timestamp)}
									</span>
								</div>

								<div className='space-y-1'>
									<div className='flex justify-between text-sm'>
										<span className='text-gray-600'>Name:</span>
										<span className='font-medium text-gray-800'>
											{drone.name}
										</span>
									</div>

									<div className='flex justify-between text-sm'>
										<span className='text-gray-600'>Altitude:</span>
										<span className='font-medium text-gray-800'>
											{drone.altitude}m
										</span>
									</div>

									<div className='flex justify-between text-sm'>
										<span className='text-gray-600'>Pilot:</span>
										<span className='font-medium text-gray-800'>
											{drone.pilot}
										</span>
									</div>

									<div className='flex justify-between text-sm'>
										<span className='text-gray-600'>Organization:</span>
										<span className='font-medium text-gray-800 truncate max-w-24'>
											{drone.organization}
										</span>
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};
