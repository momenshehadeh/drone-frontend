import { useDroneStore } from '../store/droneStore';

export const RedDroneCounter: React.FC = () => {
	const { getRedDronesCount } = useDroneStore();
	const redDronesCount = getRedDronesCount();

	return (
		<div className='bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-4 border-white'>
			<div className='text-center'>
				<div className='text-2xl font-bold'>{redDronesCount}</div>
				<div className='text-xs'>Red</div>
			</div>
		</div>
	);
};
