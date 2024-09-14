import {
	getAllArtists,
	getArtistById,
	setTooltip,
	setToggleAccessible,
	fillSlider,
	controlToSlider,
	controlFromSlider,
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
			membersFilter: document.getElementById("membersFilter"),
			fromSlider1: document.getElementById("fromSlider1"),
			toSlider1: document.getElementById("toSlider1"),
			fromTooltip1: document.getElementById("fromSliderTooltip1"),
			toTooltip1: document.getElementById("toSliderTooltip1"),
			fromSlider2: document.getElementById("fromSlider2"),
			toSlider2: document.getElementById("toSlider2"),
			fromTooltip2: document.getElementById("fromSliderTooltip2"),
			toTooltip2: document.getElementById("toSliderTooltip2"),
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
	filteredData = this.applyCreationDateFilter(filteredData);
	filteredData = this.applyFirstAlbumFilter(filteredData);
	filteredData = this.applyMembersFilter(filteredData);

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
 * Apply creation dates filter based on years
 * @param {Array} filteredData - the current filtered artist data
 * @returns {Array} filteredData - the data filtered by the year range
 */
ArtistApp.prototype.applyCreationDateFilter = function (filteredData) {
	const fromValue = parseInt(this.domElements.fromSlider1.value, 10);
	const toValue = parseInt(this.domElements.toSlider1.value, 10);

	return filteredData.filter((artist) => {
		let year = artist["creationDate"];
		if (!year) return false;
		return year >= fromValue && year <= toValue;
	});
};

/**
 * Apply first album filter based on years
 * @param {Array} filteredData - the current filtered artist data
 * @returns {Array} filteredData - the data filtered by the year range
 */
ArtistApp.prototype.applyFirstAlbumFilter = function (filteredData) {
	const fromValue = parseInt(this.domElements.fromSlider2.value, 10);
	const toValue = parseInt(this.domElements.toSlider2.value, 10);

	return filteredData.filter((artist) => {
		let year = artist["firstAlbum"];
		if (!year) return false;
		const parts = year.split("-");
		year = parseInt(parts[parts.length - 1], 10);
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

	const {
		fromSlider1,
		toSlider1,
		fromTooltip1,
		toTooltip1,
		fromSlider2,
		toSlider2,
		fromTooltip2,
		toTooltip2,
	} = this.domElements;
	// Colors for Slider 1 (Creation Date)
	const COLOR_TRACK_SLIDER1 = "#FF6347";
	const COLOR_RANGE_SLIDER1 = "#0EA5E9";

	// Colors for Slider 2 (First Album)
	const COLOR_TRACK_SLIDER2 = "#FF6347";
	const COLOR_RANGE_SLIDER2 = "#FFD700";

	let minYear1 = Infinity;
	let maxYear1 = -Infinity;
	let minYear2 = Infinity;
	let maxYear2 = -Infinity;

	// Loop through artist data to get min/max for creationDate (Slider 1)
	this.artistsData.data.forEach((artist) => {
		let year = artist["creationDate"];
		if (year) {
			if (year < minYear1) minYear1 = year;
			if (year > maxYear1) maxYear1 = year;
		}
	});

	// Loop through artist data to get min/max for firstAlbum (Slider 2)
	this.artistsData.data.forEach((artist) => {
		let year = artist["firstAlbum"];
		if (year) {
			const parts = year.split("-");
			year = parseInt(parts[parts.length - 1], 10);
			if (year < minYear2) minYear2 = year;
			if (year > maxYear2) maxYear2 = year;
		}
	});

	// Handle default min/max values if no valid years were found
	minYear1 = minYear1 === Infinity ? 0 : minYear1;
	maxYear1 = maxYear1 === -Infinity ? new Date().getFullYear() : maxYear1;

	minYear2 = minYear2 === Infinity ? 0 : minYear2;
	maxYear2 = maxYear2 === -Infinity ? new Date().getFullYear() : maxYear2;

	// Assign values to Slider 1 (creationDate)
	fromSlider1.min = minYear1;
	fromSlider1.max = maxYear1;
	fromSlider1.value = minYear1;

	toSlider1.min = minYear1;
	toSlider1.max = maxYear1;
	toSlider1.value = maxYear1;

	// Assign values to Slider 2 (firstAlbum)
	fromSlider2.min = minYear2;
	fromSlider2.max = maxYear2;
	fromSlider2.value = minYear2;

	toSlider2.min = minYear2;
	toSlider2.max = maxYear2;
	toSlider2.value = maxYear2;

	// Attach events to the sliders
	fromSlider1.oninput = () =>
		controlFromSlider(
			fromSlider1,
			toSlider1,
			fromTooltip1,
			toTooltip1,
			COLOR_TRACK_SLIDER1,
			COLOR_RANGE_SLIDER1
		);
	toSlider1.oninput = () =>
		controlToSlider(
			fromSlider1,
			toSlider1,
			fromTooltip1,
			toTooltip1,
			COLOR_TRACK_SLIDER1,
			COLOR_RANGE_SLIDER1
		);

	fromSlider2.oninput = () =>
		controlFromSlider(
			fromSlider2,
			toSlider2,
			fromTooltip2,
			toTooltip2,
			COLOR_TRACK_SLIDER2,
			COLOR_RANGE_SLIDER2
		);
	toSlider2.oninput = () =>
		controlToSlider(
			fromSlider2,
			toSlider2,
			fromTooltip2,
			toTooltip2,
			COLOR_TRACK_SLIDER2,
			COLOR_RANGE_SLIDER2
		);

	// Initialize slider visuals
	fillSlider(
		fromSlider1,
		toSlider1,
		COLOR_TRACK_SLIDER1,
		COLOR_RANGE_SLIDER1,
		toSlider1
	);
	setToggleAccessible(toSlider1);
	setTooltip(fromSlider1, fromTooltip1);
	setTooltip(toSlider1, toTooltip1);

	fillSlider(
		fromSlider2,
		toSlider2,
		COLOR_TRACK_SLIDER2,
		COLOR_RANGE_SLIDER2,
		toSlider2
	);
	setToggleAccessible(toSlider2);
	setTooltip(fromSlider2, fromTooltip2);
	setTooltip(toSlider2, toTooltip2);
};

/**
 * Creates a new instance of ArtistApp and starts the application
 */
document.addEventListener("DOMContentLoaded", () => {
	const app = new ArtistApp();
});
