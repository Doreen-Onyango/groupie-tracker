import { getAllArtists, getArtistById } from "/static/scripts/fetchdata.js";
import { renderAllArtists, showModal } from "/static/scripts/renders.js";

/**
 * ArtistApp class to handle artist-related functionalities
 */
class ArtistApp {
	constructor() {
		this.initialize();
		this.setupEventListeners();
	}
}

/**
 * Fetches and displays all artists when the DOM is fully loaded
 */
ArtistApp.prototype.initialize = async function () {
	const data = await getAllArtists();
	renderAllArtists(data);
};

/**
 * Sets up event listeners for artist card clicks and search input
 */
ArtistApp.prototype.setupEventListeners = function () {
	document.addEventListener("click", this.handleArtistCardClick.bind(this));
	document
		.getElementById("search")
		.addEventListener("input", this.handleSearchInput.bind(this));
	document
		.getElementById("filter")
		.addEventListener("change", this.handleFilterChange.bind(this));
};

/**
 * Handles click events on artist cards
 * Retrieves and displays artist details in a modal
 * @param {Event} event - Click event on an artist card
 */
ArtistApp.prototype.handleArtistCardClick = async function (event) {
	const artistLink = event.target.closest(".artist-card-link");
	if (!artistLink) return;

	event.preventDefault();

	const artistId = artistLink
		.querySelector(".artist-card")
		.getAttribute("data-artist-id");
	if (!artistId) return;

	const data = await getArtistById(artistId);
	showModal(data);
};

/**
 * Handles input events on the search bar
 * Filters artist cards based on the search query
 */
ArtistApp.prototype.handleSearchInput = function () {
	const query = document.getElementById("search").value.toLowerCase();
	const cards = document.querySelectorAll("#artistsContainer .artist-card");

	cards.forEach((card) => {
		const artistName = card
			.querySelector(".artist-name")
			.textContent.toLowerCase();
		card.style.display = artistName.includes(query) ? "block" : "none";
	});
};

/**
 * Handles change events on the filter dropdown
 * Filters artist cards based on the selected filter criteria
 */
ArtistApp.prototype.handleFilterChange = function () {
	const filterValue = document.getElementById("filter").value;
	let filteredArtists;

	if (filterValue === "all") {
		filteredArtists = this.artistsData;
	} else {
		filteredArtists = this.artistsData.filter((artist) =>
			artist.genre.toLowerCase().includes(filterValue.toLowerCase())
		);
	}

	renderAllArtists(filteredArtists);
};

/**
 * Creates a new instance of ArtistApp and starts the application
 */
document.addEventListener("DOMContentLoaded", () => new ArtistApp());
