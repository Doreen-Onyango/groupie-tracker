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
	this.artistsData = await getAllArtists();
	this.setRangeFilterDefaults();
	renderAllArtists(this.artistsData);
};

/**
 * Sets up event listeners for artist card clicks, search input, and range filter
 */
ArtistApp.prototype.setupEventListeners = function () {
	document.addEventListener("click", this.handleArtistCardClick.bind(this));
	document
		.getElementById("search")
		.addEventListener("input", this.handleSearchInput.bind(this));
	document
		.getElementById("rangeFilter")
		.addEventListener("input", this.handleRangeFilter.bind(this));
	document.getElementById("filterType").addEventListener("change", () => {
		this.setRangeFilterDefaults();
		this.handleRangeFilter();
	});
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
 * Handles input events on the range filter
 * Filters artist cards based on the selected year range and filter type
 */
ArtistApp.prototype.handleRangeFilter = function () {
	if (!this.artistsData) return;

	const rangeValue = parseInt(document.getElementById("rangeFilter").value, 10);
	document.getElementById("rangeValue").textContent = rangeValue;
	const filterType = document.getElementById("filterType").value;

	const { data, message, error } = this.artistsData;
	const filteredData = data.filter((artist) => {
		let year = artist[filterType];

		if (year === null || year === undefined) return false;

		if (filterType === "firstAlbum") {
			const parts = year.split("-");
			year = parseInt(parts[parts.length - 1], 10);
		}

		return year <= rangeValue;
	});

	const filteredArtistsData = {
		error: error,
		message: message,
		data: filteredData,
	};

	renderAllArtists(filteredArtistsData);
};

/**
 * Updates the range filter based on the selected filter type
 * Adjusts the min and max range based on the artist data
 */
ArtistApp.prototype.setRangeFilterDefaults = function () {
	if (!this.artistsData) return;

	const filterType = document.getElementById("filterType").value;
	let minYear = Infinity;
	let maxYear = -Infinity;

	this.artistsData.data.forEach((artist) => {
		let year = artist[filterType];

		if (filterType === "firstAlbum") {
			const parts = year.split("-");
			year = parseInt(parts[parts.length - 1], 10);
		}

		if (year < minYear) minYear = year;
		if (year > maxYear) maxYear = year;
	});

	// Ensure minYear and maxYear have valid values
	if (minYear === Infinity || maxYear === -Infinity) {
		minYear = 0;
		maxYear = new Date().getFullYear();
	}

	const rangeFilter = document.getElementById("rangeFilter");
	rangeFilter.min = minYear;
	rangeFilter.max = maxYear;
	rangeFilter.value = maxYear;
	document.getElementById("rangeValue").textContent = maxYear;
};

/**
 * Creates a new instance of ArtistApp and starts the application
 */
document.addEventListener("DOMContentLoaded", () => {
	const app = new ArtistApp();
});
