import { getAllArtists, getArtistById } from "/static/scripts/fetchdata.js";
import { renderAllArtists, showModal } from "./renders.js";

/**
 * Event listener for when the DOM content is fully loaded
 * @param {Object} data - Data from the getAllArtists() call
 * Manipulates the DOM to display the artists.
 */
document.addEventListener("DOMContentLoaded", async function () {
	try {
		const data = await getAllArtists();
		renderAllArtists(data);
	} catch (err) {
		console.log(err);
	}
});

/**
 * Event listener for individual artist card click events
 * @param {Event} event - Click event on an artist card
 * @param {Object} data - Data from the getArtistById() call
 * Retrieves artist details and displays them in a modal.
 */
document.addEventListener("click", async function (event) {
	const artistLink = event.target.closest(".artist-card-link");
	if (!artistLink) return;

	event.preventDefault();

	const artistId = artistLink
		.querySelector(".artist-card")
		.getAttribute("data-artist-id");

	if (!artistId) return;

	try {
		const data = await getArtistById(artistId);
		showModal(data.data);
	} catch (err) {
		console.error("Error fetching artist details:", err);
	}
});
