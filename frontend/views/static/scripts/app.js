import { getAllArtists } from "/static/scripts/getallartists.js";
import { handleData } from "/static/scripts/helpers.js";

document.addEventListener("DOMContentLoaded", async function () {
	try {
		const data = await getAllArtists();
		handleData(data.data);
	} catch (err) {
		console.log(err);
	}
});

document.getElementById("search").addEventListener("input", function () {
	const query = this.value.toLowerCase();
	const cards = document.querySelectorAll("#artistsContainer .artist-card");

	cards.forEach(function (card) {
		const artistName = card
			.querySelector(".artist-name")
			.textContent.toLowerCase();
		if (artistName.includes(query)) {
			card.style.display = "block";
		} else {
			card.style.display = "none";
		}
	});
});
