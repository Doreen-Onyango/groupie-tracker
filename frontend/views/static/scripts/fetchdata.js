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
	const body = JSON.stringify(bodyData);

	try {
		const response = await fetch(`${baseUrl}${endpoint}`, {
			method: "POST",
			headers,
			body,
		});

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

/**
 * Fetches all artists' data from the server
 * @returns {Promise<Object>} - The JSON response from the server containing artists' data
 */
export const getAllArtists = () => {
	return fetchData("getallartists");
};

/**
 * Fetches data for a specific artist by their ID
 * @param {string} id - The ID of the artist to fetch
 * @returns {Promise<Object>} - The JSON response from the server containing the artist's data
 */
export const getArtistById = (id) => {
	return fetchData("getartistbyid", { artist_id: id });
};
