const url = "http://localhost:4000/api/getartistbyid";
const headers = new Headers({
	"Content-Type": "application/json",
});

export const getArtistById = async (id) => {
	const body = JSON.stringify({ artist_id: id });

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
