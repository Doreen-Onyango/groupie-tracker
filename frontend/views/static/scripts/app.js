// Define the updateHomePage function without parameters
const updateHomePage = async () => {
	const data = await getAllArtists();
	return { data };
};

// Add the event listener to the document
document.addEventListener("DOMContentLoaded", async function () {
	try {
		const { data } = await updateHomePage();
		console.log(data);
	} catch (err) {
		console.log(err);
	}
});

// Assuming searchForm and its handler should remain for other purposes
const searchForm = document.querySelector("form");

searchForm.addEventListener("submit", async function (e) {
	e.preventDefault();

	const queryParams = document.getElementById("search").value.trim();
	searchForm.reset();

	// You can add other update functions here if needed
});
