import { getAllArtists } from "/static/scripts/getallartists.js";
import { getArtistById } from "./getartistbyid.js";
import { renderAllArtists, showModal } from "./renders.js";

document.addEventListener("DOMContentLoaded", async function () {
	try {
		const data = await getAllArtists();
		renderAllArtists(data.data);
	} catch (err) {
		console.log(err);
	}
});

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
