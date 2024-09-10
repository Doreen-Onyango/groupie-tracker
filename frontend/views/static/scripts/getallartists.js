const url = "http://localhost:4000/api/getallartists";
const headers = new Headers({
	"Content-Type": "application/json",
});
const body = JSON.stringify({});

/**
 * Fetches all artists' data from the server
 * @returns {Promise<Object>} - The JSON response from the server containing artists' data
 * Throws an error if the fetch request fails or the response is not ok.
 */
export const getAllArtists = async () => {
	try {
		const response = await fetch(url, {
			method: "POST",
			headers,
			body,
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching artists:", error);
		throw error;
	}
};
