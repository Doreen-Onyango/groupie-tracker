const baseUrl = "http://localhost:4000/api/";
const headers = new Headers({
	"Content-Type": "application/json",
});

/**
 * Utility function to fetch data from the server
 * @param {string} endpoint - The API endpoint to send the request to
 * @param {Object} [bodyData] - Optional body data to send with the request
 * @returns {Promise<Object>} - The JSON response from the server or an error object
 */
const fetchData = async (endpoint, bodyData = {}) => {
	const options = {
		method: "POST",
		headers,
		body: JSON.stringify(bodyData),
	};

	try {
		const response = await fetch(`${baseUrl}${endpoint}`, options);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		return {
			error: true,
			message: `Failed to fetch data from ${endpoint}: ${error.message}`,
			data: null,
		};
	}
};

export const getAllArtists = () => fetchData("getallartists");
export const getArtistById = (id) =>
	fetchData("getartistbyid", { artist_id: id });

export function setTooltip(slider, tooltip) {
	const value = slider.value;
	tooltip.textContent = `$${value}`;
	const thumbPosition = (value - slider.min) / (slider.max - slider.min);
	const percent = thumbPosition * 100;
	const markerWidth = 20;
	const offset = (((percent - 50) / 50) * markerWidth) / 2;
	tooltip.style.left = `calc(${percent}% - ${offset}px)`;
}
