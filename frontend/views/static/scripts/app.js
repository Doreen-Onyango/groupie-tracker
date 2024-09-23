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
		this.domElements = {};
		this.initialize();
		this.setupEventListeners();
	}
}

/**
 * Fetches and displays all artists when the DOM is fully loaded
 */
ArtistApp.prototype.initialize = async function () {
	this.domElements = {
		searchByCreationDate: document.getElementById("searchByCreationDate"),
		creationDateSuggestions: document.getElementById("creationDateSuggestions"),
		searchByAlbumRelease: document.getElementById("searchByAlbumRelease"),
		searchSummary: document.getElementById("searchSummary"),
		searchUnified: document.getElementById("searchUnified"),
		fromTooltip2: document.getElementById("fromSliderTooltip2"),
		fromTooltip1: document.getElementById("fromSliderTooltip1"),
		searchByConcert: document.getElementById("searchByConcert"),
		concertSuggestions: document.getElementById("concertSuggestions"),
		nameSuggestions: document.getElementById("nameSuggestions"),
		toTooltip2: document.getElementById("toSliderTooltip2"),
		membersFilter: document.getElementById("membersFilter"),
		toTooltip1: document.getElementById("toSliderTooltip1"),
		fromSlider1: document.getElementById("fromSlider1"),
		fromSlider2: document.getElementById("fromSlider2"),
		toSlider1: document.getElementById("toSlider1"),
		toSlider2: document.getElementById("toSlider2"),
		resetButton: document.getElementById("resetButton"),

		// hidden data fields
		searchByName: document.getElementById("searchByName"),
	};
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
			element: this.domElements.searchUnified,
			event: "input",
			handler: this.handleUnifiedSearchInput,
		},
		{
			element: this.domElements.searchByConcert,
			event: "input",
			handler: this.handleConcertSearchInput,
		},
		{
			element: this.domElements.searchByCreationDate,
			event: "input",
			handler: this.handleCreationDateSearchInput,
		},
		{
			element: this.domElements.searchByAlbumRelease,
			event: "input",
			handler: this.handleAlbumReleaseSearchInput,
		},
		{
			element: this.domElements.resetButton,
			event: "click",
			handler: this.resetFilters,
		},
		{
			element: this.domElements.membersFilter,
			event: "change",
			handler: this.applyAllFilters,
		},
	]);

	document.addEventListener("click", this.hideSuggestionsOnClick.bind(this));
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
	filteredData = this.applySearchByAlbumReleaseFilter(filteredData);
	filteredData = this.applySearchByCreationDateFilter(filteredData);

	this.renderFilteredData(filteredData);
};

/**
 * Handles input event for the unified search input to show suggestions dropdown.
 */
ArtistApp.prototype.handleUnifiedSearchInput = function () {
	const query = this.domElements.searchUnified.value.toLowerCase();
	this.handleNameSearchInput(query);
	this.handleConcertSearchInput(query);
	this.handleCreationDateSearchInput(query);
};

/**
 * Handles input event for searching by album release.
 * @param {string} query - The search query entered by the user.
 */
ArtistApp.prototype.handleAlbumReleaseSearchInput = function (query) {
	const uniqueAlbumReleaseYears = [
		...new Set(
			this.artistsData.data
				.map((artist) => artist.firstAlbum)
				.filter((year) => year != null)
		),
	];

	const suggestions =
		`<p class="suggestion-title">Search by Album Release Year</p>` +
		uniqueAlbumReleaseYears
			.filter((year) => year.toString().startsWith(query))
			.map(
				(year) =>
					`<div class="suggestion-item" data-albumrelease="${year}">${year}</div>`
			)
			.join("");

	this.domElements.albumReleaseSuggestions.innerHTML = suggestions;
	this.domElements.albumReleaseSuggestions.style.display = suggestions
		? "block"
		: "none";

	this.addSuggestionClick("albumReleaseSuggestions", "searchByAlbumRelease");
};

/**
 * Applies the search filter based on the album release year.
 * Filters the artist data to match the input query in the searchByAlbumRelease field.
 * If no query is provided, the function returns the unfiltered data.
 * @param {Array} filteredData - The current filtered artist data
 * @returns {Array} - The filtered artist data by album release year
 */
ArtistApp.prototype.applySearchByAlbumReleaseFilter = function (filteredData) {
	const albumReleaseQuery = this.domElements.searchByAlbumRelease.value;
	if (!albumReleaseQuery) return filteredData;

	return filteredData.filter((artist) => {
		return artist.firstAlbum.toString().startsWith(albumReleaseQuery);
	});
};

/**
 * Apply search by creation date filter
 */
ArtistApp.prototype.applySearchByCreationDateFilter = function (filteredData) {
	const creationDateQuery = this.domElements.searchByCreationDate.value;
	if (!creationDateQuery) return filteredData;

	return filteredData.filter((artist) => {
		return artist.creationDate.toString().startsWith(creationDateQuery);
	});
};

/**
 * Handles input event for searching by creation date.
 * @param {string} query - The search query entered by the user.
 */
ArtistApp.prototype.handleCreationDateSearchInput = function (query) {
	const uniqueCreationDates = [
		...new Set(
			this.artistsData.data
				.map((artist) => artist.creationDate)
				.filter((date) => date != null)
		),
	];

	const suggestions =
		`<p class="suggestion-title">Search by Creation Date</p>` +
		uniqueCreationDates
			.filter((date) => date.toString().startsWith(query))
			.map(
				(date) =>
					`<div class="suggestion-item" data-creationdate="${date}">${date}</div>`
			)
			.join("");

	this.domElements.creationDateSuggestions.innerHTML = suggestions;
	this.domElements.creationDateSuggestions.style.display = suggestions
		? "block"
		: "none";

	this.addSuggestionClick("creationDateSuggestions", "searchByCreationDate");
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
 * Handles input event for searching by artist name.
 * @param {string} query - The search query entered by the user.
 */
ArtistApp.prototype.handleNameSearchInput = function (query) {
	const nameSuggestions = this.artistsData.data
		.filter((artist) => artist.name.toLowerCase().includes(query))
		.map(
			(artist) =>
				`<div class="suggestion-item" data-name="${artist.name}">${artist.name}</div>`
		)
		.join("");

	this.domElements.nameSuggestions.innerHTML = nameSuggestions;
	this.domElements.nameSuggestions.style.display = nameSuggestions
		? "block"
		: "none";

	this.addSuggestionClick("nameSuggestions", "searchByName");
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
 * Handles input event for searching by concert.
 * @param {string} query - The search query entered by the user.
 */
ArtistApp.prototype.handleConcertSearchInput = function (query) {
	const concertSuggestions = this.allArtistDetails
		.flatMap((artistDetail) => artistDetail.data.locations?.locations || [])
		.filter((location) => location.toLowerCase().includes(query))
		.map(
			(location) =>
				`<div class="suggestion-item" data-location="${location}">${location
					.split("-")
					.join(" ")}</div>`
		)
		.join("");

	this.domElements.concertSuggestions.innerHTML = concertSuggestions;
	this.domElements.concertSuggestions.style.display = concertSuggestions
		? "block"
		: "none";

	this.addSuggestionClick("concertSuggestions", "searchByConcert");
};

/**
 * Hides suggestions when clicking outside of the input fields or suggestion boxes
 */
ArtistApp.prototype.hideSuggestionsOnClick = function (event) {
	if (
		!event.target.closest("#searchUnified") &&
		!event.target.closest("#searchByConcert") &&
		!event.target.closest("#searchByCreationDate") &&
		!event.target.closest("#searchByAlbumRelease")
	) {
		this.domElements.nameSuggestions.style.display = "none";
	}
};

/**
 * Adds click behavior for selecting a suggestion
 * @param {string} suggestionElementId - The ID of the suggestions dropdown
 * @param {string} inputElementId - The ID of the input field
 */
ArtistApp.prototype.addSuggestionClick = function (
	suggestionElementId,
	inputElementId
) {
	const suggestionBox = this.domElements[suggestionElementId];
	const inputField = this.domElements[inputElementId];
	const attributeMapping = {
		searchByName: "data-name",
		searchByConcert: "data-location",
		searchByCreationDate: "data-creationDate",
	};

	Array.from(suggestionBox.querySelectorAll(".suggestion-item")).forEach(
		(item) => {
			item.addEventListener("click", (e) => {
				const dataAttribute = attributeMapping[inputElementId];
				if (dataAttribute) {
					let value = e.target.getAttribute(dataAttribute);
					value = value.replace(/-(?!\d{2})/g, " ");
					inputField.value = value;
					suggestionBox.style.display = "none"; // Hide suggestions

					this.applyAllFilters(); // Apply filters

					// Update search summary
					const summary = `<p class="summary-title">${inputElementId}: ${value}</p>`;
					this.domElements.searchSummary.innerHTML += summary;
				} else {
					console.error(`No data attribute found for ${inputElementId}`);
				}
			});
		}
	);
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
 * Resets all filters to their default values
 */
ArtistApp.prototype.resetFilters = function () {
	// Reset text inputs
	this.domElements.searchUnified.value = "";
	this.domElements.searchByConcert.value = "";
	this.domElements.searchByCreationDate.value = "";
	this.domElements.searchByAlbumRelease.value = "";

	// Reset sliders
	this.domElements.fromSlider1.value = this.domElements.fromSlider1.min;
	this.domElements.toSlider1.value = this.domElements.toSlider1.max;
	this.domElements.fromSlider2.value = this.domElements.fromSlider2.min;
	this.domElements.toSlider2.value = this.domElements.toSlider2.max;

	// Reset tooltips and slider visuals
	setTooltip(this.domElements.fromSlider1, this.domElements.fromTooltip1);
	setTooltip(this.domElements.toSlider1, this.domElements.toTooltip1);
	setTooltip(this.domElements.fromSlider2, this.domElements.fromTooltip2);
	setTooltip(this.domElements.toSlider2, this.domElements.toTooltip2);

	fillSlider(
		this.domElements.fromSlider1,
		this.domElements.toSlider1,
		"#FF6347",
		"#0EA5E9",
		this.domElements.toSlider1
	);
	fillSlider(
		this.domElements.fromSlider2,
		this.domElements.toSlider2,
		"#FF6347",
		"#FFD700",
		this.domElements.toSlider2
	);

	// Reset checkboxes
	Array.from(
		this.domElements.membersFilter.querySelectorAll("input:checked")
	).forEach((checkbox) => (checkbox.checked = false));

	this.applyAllFilters();
};

/**
 * Creates a new instance of ArtistApp and starts the application
 */
document.addEventListener("DOMContentLoaded", () => {
	const app = new ArtistApp();
});
