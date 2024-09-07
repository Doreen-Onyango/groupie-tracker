const url = "http://localhost:4000/api/getallartists";
const headers = new Headers({
	"Content-Type": "application/json",
});

const getAllArtists = async () => {
	const body = JSON.stringify({});

	try {
		const response = await fetch(url, {
			method: "POST",
			headers,
			body,
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching artists:", error);
		throw error;
	}
};
