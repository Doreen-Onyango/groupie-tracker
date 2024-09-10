import { getAllArtists, getArtistById } from "/static/scripts/fetchdata.js";
import { renderAllArtists, showModal } from "./renders.js";

/**
 * Event listener for when the DOM content is fully loaded
 * Fetches and displays all artists.
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
 * Retrieves artist details and displays them in a modal.
 * @param {Event} event - Click event on an artist card
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
		showModal(data);
	} catch (err) {
		console.error("Error fetching artist details:", err);
	}
});

/**
 * Event listener for search input
 * Filters the displayed artist cards based on the search query.
 */
document.getElementById("search").addEventListener("input", function () {
	const query = this.value.toLowerCase();
	const cards = document.querySelectorAll("#artistsContainer .artist-card");

	cards.forEach(function (card) {
		const artistName = card
			.querySelector(".artist-name")
			.textContent.toLowerCase();
		card.style.display = artistName.includes(query) ? "block" : "none";
	});
});
