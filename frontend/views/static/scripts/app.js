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
	document
		.getElementById("filterType")
		.addEventListener("change", this.updateRangeFilter.bind(this));
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
	const rangeValue = document.getElementById("rangeFilter").value;
	document.getElementById("rangeValue").textContent = rangeValue;

	const filterType = document.getElementById("filterType").value;

	const { data, message, error } = this.artistsData;
	const filteredData = data.filter((artist) => {
		const dateValue = artist[filterType];
		return new Date(dateValue).getFullYear() <= rangeValue;
	});

	const filteredArtistsData = {
		data: filteredData,
		message: message,
		error: error,
	};

	renderAllArtists(filteredArtistsData);
};

/**
 * Updates the range filter based on the selected filter type
 * Adjusts the min and max range based on the artist data
 */
ArtistApp.prototype.updateRangeFilter = function () {
	const filterType = document.getElementById("filterType").value;
	let minYear = new Date().getFullYear();
	let maxYear = 0;

	this.artistsData.data.forEach((artist) => {
		const dateValue = artist[filterType];
		const year = new Date(dateValue).getFullYear();
		if (year < minYear) minYear = year;
		if (year > maxYear) maxYear = year;
	});

	const rangeFilter = document.getElementById("rangeFilter");
	rangeFilter.min = minYear;
	rangeFilter.max = maxYear;
	rangeFilter.value = maxYear;

	document.getElementById("rangeValue").textContent = maxYear;

	this.handleRangeFilter();
};

/**
 * Creates a new instance of ArtistApp and starts the application
 */
document.addEventListener("DOMContentLoaded", () => new ArtistApp());
