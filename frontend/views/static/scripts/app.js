import { getAllArtists } from "/static/scripts/getallartists.js";
import { getArtistById } from "./getartistbyid.js";
import { handleData, showModal } from "/static/scripts/helpers.js";

document.addEventListener("DOMContentLoaded", async function () {
	try {
		const data = await getAllArtists();
		handleData(data.data);
	} catch (err) {
		console.log(err);
	}
});

document.addEventListener("click", async function (event) {
	// Check if the clicked element is within an artist card link
	const artistLink = event.target.closest(".artist-card-link");
	if (!artistLink) return; // Exit if the click was not on a card link

	// Prevent the default action of the link
	event.preventDefault();

	// Get the artist ID from the data attribute on the card
	const artistId = artistLink
		.querySelector(".artist-card")
		.getAttribute("data-artist-id");

	if (!artistId) return; // Exit if no artist ID is found

	try {
		// Fetch the artist data by ID
		const data = await getArtistById(artistId);

		// Handle the data (e.g., display it in a detailed view)
		showModal(data.data);
	} catch (err) {
		console.error("Error fetching artist details:", err);
	}
});
