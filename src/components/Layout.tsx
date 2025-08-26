import { DroneMap } from './DroneMap';
import { DroneList } from './DroneList';
import { ConnectionStatus } from './ConnectionStatus';
import { RedDroneCounter } from './RedDroneCounter';

export const Layout: React.FC = () => {
	return (
		<div className='min-h-screen bg-gray-100 w-full'>
			{/* Main Content */}
			<main className='px-4 sm:px-6 lg:px-8 py-6'>
				<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
					{/* Drone List Sidebar */}
					<div className='lg:col-span-1'>
						<DroneList />
					</div>

					{/* Map */}
					<div className='lg:col-span-3 h-full'>
						<DroneMap />
					</div>
				</div>
			</main>

			{/* Fixed Components */}
			<div className='fixed bottom-6 right-6 z-50 flex items-center space-x-4'>
				<RedDroneCounter />
				<ConnectionStatus />
			</div>
		</div>
	);
};
