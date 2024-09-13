import {
	getAllArtists,
	getArtistById,
	setTooltip,
	setToggleAccessible,
	fillSlider,
	controlToSlider,
	controlFromSlider,
	sortByLocation,
	sortById,
} from "/static/scripts/helpers.js";
import { renderAllArtists, showModal } from "/static/scripts/renders.js";

/**
 * ArtistApp class to handle artist-related functionalities
 */
class ArtistApp {
	constructor() {
		this.domElements = {
			searchByName: document.getElementById("searchByName"),
			searchByConcert: document.getElementById("searchByConcert"),
			artistsContainer: document.getElementById("artistsContainer"),
			membersFilter: document.getElementById("membersFilter"),
			filterType: document.getElementById("filterType"),
			fromSlider1: document.getElementById("fromSlider1"),
			toSlider1: document.getElementById("toSlider1"),
			fromTooltip1: document.getElementById("fromSliderTooltip1"),
			toTooltip1: document.getElementById("toSliderTooltip1"),
			concertsFilter: document.getElementById("concertsFilter"),
			searchType: document.getElementById("searchType"),
		};

		this.initialize();
		this.setupEventListeners();
	}
}

/**
 * Fetches and displays all artists when the DOM is fully loaded
 */
ArtistApp.prototype.initialize = async function () {
	this.artistsData = await getAllArtists();
	this.filteredData = [...this.artistsData.data];
	this.allArtistDetails = await this.fetchAllArtistDetails();

	this.setRangeFilterDefaults();
	this.applyAllFilters();
};

/**
 * Fetches detailed data for all artists
 * @returns {Promise<Array>} - An array of artist details
 */
ArtistApp.prototype.fetchAllArtistDetails = async function () {
	const artistDetails = await Promise.all(
		this.artistsData.data.map(async (artist) => {
			const data = await getArtistById(artist.id);
			return data;
		})
	);
	return artistDetails;
};

/**
 * Sets up event listeners for artist card clicks, search input, and range filter
 */
ArtistApp.prototype.setupEventListeners = function () {
	this.addEventListeners([
		{
			element: this.domElements.searchByName,
			event: "change",
			handler: this.applyAllFilters,
		},
		{
			element: this.domElements.searchByConcert,
			event: "change",
			handler: this.applyAllFilters,
		},
		{
			element: this.domElements.membersFilter,
			event: "change",
			handler: this.applyAllFilters,
		},
		{
			element: this.domElements.concertsFilter,
			event: "change",
			handler: this.applyAllFilters,
		},
		{
			element: this.domElements.filterType,
			event: "change",
			handler: this.handleFilterTypeChange,
		},
	]);

	document.addEventListener("click", this.handleArtistCardClick.bind(this));
	document.addEventListener("input", this.applyAllFilters.bind(this));
};

/**
 * Adds multiple event listeners at once
 */
ArtistApp.prototype.addEventListeners = function (listeners) {
	listeners.forEach(({ element, event, handler }) => {
		element.addEventListener(event, handler.bind(this));
	});
};

/**
 * Applies all active filters (search, members, and range filters)
 * Filters artist cards based on the current state of all filters
 */
ArtistApp.prototype.applyAllFilters = function () {
	if (!this.artistsData) return;
	let filteredData = [...this.artistsData.data];

	filteredData = this.applySearchByConcertFilter(filteredData);
	filteredData = this.applySearchByNameFilter(filteredData);
	filteredData = this.applyRangeFilter(filteredData);
	filteredData = this.applyMembersFilter(filteredData);

	const sortValue = this.domElements.concertsFilter.value;
	if (sortValue === "location") {
		filteredData = sortByLocation(filteredData);
	}

	this.renderFilteredData(filteredData);
};

/**
 * Apply search by name filter
 * @param {Array} filteredData - the current filtered artist data
 * @returns {Array} filteredData - the data filtered by artist name
 */
ArtistApp.prototype.applySearchByNameFilter = function (filteredData) {
	const nameQuery = this.domElements.searchByName.value.toLowerCase();
	return filteredData.filter((artist) => {
		const artistName = artist.name.toLowerCase();
		return artistName.includes(nameQuery);
	});
};

/**
 * Apply search by concert location filter
 * @param {Array} filteredData - the current filtered artist data
 * @returns {Array} filteredData - the data filtered by concert location
 */
ArtistApp.prototype.applySearchByConcertFilter = function (filteredData) {
	const concertQuery = this.domElements.searchByConcert.value.toLowerCase();
	return this.allArtistDetails
		.filter((artistDetail) => {
			const locations = artistDetail.data.locations?.locations || [];
			const tempLoc = locations.map((loc) => loc.split("-").join(" "));
			return tempLoc.some((loc) => loc.toLowerCase().includes(concertQuery));
		})
		.map((detail) => detail.data.artist);
};

/**
 * Apply range filter based on years
 * @param {Array} filteredData - the current filtered artist data
 * @returns {Array} filteredData - the data filtered by the year range
 */
ArtistApp.prototype.applyRangeFilter = function (filteredData) {
	const fromValue = parseInt(this.domElements.fromSlider1.value, 10);
	const toValue = parseInt(this.domElements.toSlider1.value, 10);
	// const filterType = this.domElements.filterType.value;

	return filteredData.filter((artist) => {
		let year = artist["creationDate"];
		if (!year) return false;

		// if (filterType === "firstAlbum") {
		// 	const parts = year.split("-");
		// 	year = parseInt(parts[parts.length - 1], 10);
		// }
		return year >= fromValue && year <= toValue;
	});
};

/**
 * Apply members filter
 * @param {Array} filteredData - the current filtered artist data
 * @returns {Array} filteredData - the data filtered by the number of members
 */
ArtistApp.prototype.applyMembersFilter = function (filteredData) {
	const selectedSizes = Array.from(
		this.domElements.membersFilter.querySelectorAll("input:checked")
	).map((input) => parseInt(input.value, 10));

	if (!selectedSizes.length) return filteredData;

	return filteredData.filter((artist) => {
		const memberCount = Array.isArray(artist.members)
			? artist.members.length
			: artist.members;
		return selectedSizes.includes(memberCount);
	});
};

/**
 * Renders the filtered data
 * @param {Array} filteredData - the current filtered artist data
 */
ArtistApp.prototype.renderFilteredData = function (filteredData) {
	const data = {
		data: filteredData,
		message: this.artistsData.message,
		error: this.artistsData.error,
	};

	renderAllArtists(data, sortById);
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
 * Updates the range filter based on the selected filter type
 * Adjusts the min and max range based on the artist data
 */
ArtistApp.prototype.setRangeFilterDefaults = function () {
	if (!this.artistsData) return;

	const { fromSlider1, toSlider1, fromTooltip1, toTooltip1, filterType } =
		this.domElements;
	const COLOR_TRACK = "#CBD5E1";
	const COLOR_RANGE = "#0EA5E9";

	let minYear = Infinity;
	let maxYear = -Infinity;

	this.artistsData.data.forEach((artist) => {
		let year = artist["creationDate"];
		// if (filterType.value === "firstAlbum" && year) {
		// 	year = parseInt(year.split("-").pop(), 10);
		// }
		if (year < minYear) minYear = year;
		if (year > maxYear) maxYear = year;
	});

	// Ensure min and max years are valid
	minYear = minYear === Infinity ? 0 : minYear;
	maxYear = maxYear === -Infinity ? new Date().getFullYear() : maxYear;

	fromSlider1.min = minYear;
	fromSlider1.max = maxYear;
	fromSlider1.value = minYear;

	toSlider1.min = minYear;
	toSlider1.max = maxYear;
	toSlider1.value = maxYear;

	// Attach events to the sliders
	fromSlider1.oninput = () =>
		controlFromSlider(fromSlider1, toSlider1, fromTooltip1, toTooltip1);
	toSlider1.oninput = () =>
		controlToSlider(fromSlider1, toSlider1, fromTooltip1, toTooltip1);

	// Initial slider setup
	fillSlider(fromSlider1, toSlider1, COLOR_TRACK, COLOR_RANGE, toSlider1);
	setToggleAccessible(toSlider1);
	setTooltip(fromSlider1, fromTooltip1);
	setTooltip(toSlider1, toTooltip1);
};

/**
 * Handles filter type change event
 */
ArtistApp.prototype.handleFilterTypeChange = function () {
	this.setRangeFilterDefaults();
	this.applyAllFilters();
};

/**
 * Creates a new instance of ArtistApp and starts the application
 */
document.addEventListener("DOMContentLoaded", () => {
	const app = new ArtistApp();
});
