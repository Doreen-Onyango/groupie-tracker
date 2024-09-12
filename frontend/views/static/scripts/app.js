import {
	getAllArtists,
	getArtistById,
	setTooltip,
	setToggleAccessible,
	fillSlider,
	controlToSlider,
	controlFromSlider,
} from "/static/scripts/helpers.js";
import { renderAllArtists, showModal } from "/static/scripts/renders.js";

/**
 * ArtistApp class to handle artist-related functionalities
 */
class ArtistApp {
	constructor() {
		// Global DOM elements
		this.searchInput = document.getElementById("search");
		this.artistsContainer = document.getElementById("artistsContainer");
		this.membersFilter = document.getElementById("membersFilter");
		this.filterType = document.getElementById("filterType");
		this.fromSlider = document.getElementById("fromSlider");
		this.toSlider = document.getElementById("toSlider");
		this.fromTooltip = document.getElementById("fromSliderTooltip");
		this.toTooltip = document.getElementById("toSliderTooltip");

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
	const bindEvent = (element, event, handler) =>
		element.addEventListener(event, handler.bind(this));

	document.addEventListener("click", this.handleArtistCardClick.bind(this));
	bindEvent(this.searchInput, "input", this.handleSearchInput);
	bindEvent(this.membersFilter, "change", this.handleMembersFilter);
	document.addEventListener("input", this.handleRangeFilter.bind(this));
	bindEvent(this.filterType, "change", () => {
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
	const query = this.searchInput.value.toLowerCase();
	const cards = this.artistsContainer.querySelectorAll(".artist-card");

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

	const fromValue = parseInt(this.fromSlider.value, 10);
	const toValue = parseInt(this.toSlider.value, 10);
	const filterType = this.filterType.value;

	const { data, message, error } = this.artistsData;
	const filteredData = data.filter((artist) => {
		let year = artist[filterType];

		if (year === null || year === undefined) return false;

		if (filterType === "firstAlbum") {
			const parts = year.split("-");
			year = parseInt(parts[parts.length - 1], 10);
		}
		return year >= fromValue && year <= toValue;
	});

	const filteredArtistsData = {
		error: error,
		message: message,
		data: filteredData,
	};

	renderAllArtists(filteredArtistsData);
};

/**
 * Handles changes to the members filter
 * Filters artist cards based on the selected member sizes
 */
ArtistApp.prototype.handleMembersFilter = function () {
	if (!this.artistsData) return;

	const selectedSizes = Array.from(
		this.membersFilter.querySelectorAll("input:checked")
	).map((input) => parseInt(input.value, 10));

	const { data, message, error } = this.artistsData;
	const filteredData = data.filter((artist) => {
		const memberCount = Array.isArray(artist.members)
			? artist.members.length
			: artist.members;
		return selectedSizes.length === 0 || selectedSizes.includes(memberCount);
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
	const COLOR_TRACK = "#CBD5E1";
	const COLOR_RANGE = "#0EA5E9";

	const MIN = parseInt(this.fromSlider.getAttribute("min"));
	const MAX = parseInt(this.fromSlider.getAttribute("max"));

	const filterType = this.filterType.value;
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

	this.fromSlider.min = minYear;
	this.fromSlider.max = maxYear;
	this.fromSlider.value = minYear;

	this.toSlider.min = minYear;
	this.toSlider.max = maxYear;
	this.toSlider.value = maxYear;

	// events
	this.fromSlider.oninput = () =>
		controlFromSlider(
			this.fromSlider,
			this.toSlider,
			this.fromTooltip,
			this.toTooltip
		);
	this.toSlider.oninput = () =>
		controlToSlider(
			this.fromSlider,
			this.toSlider,
			this.fromTooltip,
			this.toTooltip
		);

	// Initial load
	fillSlider(
		this.fromSlider,
		this.toSlider,
		COLOR_TRACK,
		COLOR_RANGE,
		this.toSlider
	);
	setToggleAccessible(this.toSlider);
	setTooltip(this.fromSlider, this.fromTooltip);
	setTooltip(this.toSlider, this.toTooltip);
};

/**
 * Creates a new instance of ArtistApp and starts the application
 */
document.addEventListener("DOMContentLoaded", () => {
	const app = new ArtistApp();
});
