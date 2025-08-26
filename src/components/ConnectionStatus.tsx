import { useWebSocket } from '../hooks/useWebSocket';

export const ConnectionStatus = () => {
	const { isConnected } = useWebSocket();

	return (
		<div
			className={`
				flex items-center space-x-2 px-3 py-2 rounded-full shadow-lg border-2
				${
					isConnected
						? 'bg-green-100 border-green-500 text-green-700'
						: 'bg-red-100 border-red-500 text-red-700'
				}
			`}
		>
			<div
				className={`
					w-3 h-3 rounded-full animate-pulse
					${isConnected ? 'bg-green-500' : 'bg-red-500'}
				`}
			/>
			<span className='text-sm font-medium'>
				{isConnected ? 'Connected' : 'Disconnected'}
			</span>
		</div>
	);
};
