// Mapbox configuration
export const MAPBOX_CONFIG = {
	ACCESS_TOKEN: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,

	MAP_STYLE: 'mapbox://styles/mapbox/light-v11',

	// Default viewport - centered on Jordan area (from backend coordinates)
	DEFAULT_VIEWPORT: {
		longitude: 35.93131881204147,
		latitude: 31.94878648036645,
		zoom: 10,
	},
};
