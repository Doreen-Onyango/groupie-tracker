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
		// Global DOM elements
		this.searchInput = document.getElementById("search");
		this.artistsContainer = document.getElementById("artistsContainer");
		this.membersFilter = document.getElementById("membersFilter");
		this.filterType = document.getElementById("filterType");
		this.fromSlider = document.getElementById("fromSlider");
		this.toSlider = document.getElementById("toSlider");
		this.fromTooltip = document.getElementById("fromSliderTooltip");
		this.toTooltip = document.getElementById("toSliderTooltip");
		this.concertsFilter = document.getElementById("concertsFilter"); // Concerts filter dropdown element
		this.searchType = document.getElementById("searchType");

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
	const bindEvent = (element, event, handler) =>
		element.addEventListener(event, handler.bind(this));

	document.addEventListener("click", this.handleArtistCardClick.bind(this));
	bindEvent(this.searchInput, "input", this.applyAllFilters);
	bindEvent(this.membersFilter, "change", this.applyAllFilters);
	bindEvent(this.concertsFilter, "change", this.applyAllFilters); // Listen for concert location sorting
	document.addEventListener("input", this.applyAllFilters.bind(this));
	bindEvent(this.filterType, "change", () => {
		this.setRangeFilterDefaults();
		this.applyAllFilters();
	});
};

/**
 * Applies all active filters (search, members, and range filters)
 * Filters artist cards based on the current state of all filters
 */
ArtistApp.prototype.applyAllFilters = function () {
	if (!this.artistsData) return;

	let filteredData = [...this.artistsData.data];

	// Apply search filter based on searchType
	const query = this.searchInput.value.toLowerCase();
	const searchType = this.searchType.value;

	if (searchType === "artistName") {
		filteredData = filteredData.filter((artist) => {
			const artistName = artist.name.toLowerCase();
			return artistName.includes(query);
		});
	} else if (searchType === "concertLocation") {
		filteredData = this.allArtistDetails
			.filter((artistDetail) => {
				const locations = artistDetail.data.locations?.locations || [];
				const tempLoc = locations.map((loc) => loc.split("-").join(" "));
				return tempLoc.some((loc) => loc.toLowerCase().includes(query));
			})
			.map((detail) => detail.data.artist);
	}

	// Apply range filter
	const fromValue = parseInt(this.fromSlider.value, 10);
	const toValue = parseInt(this.toSlider.value, 10);
	const filterType = this.filterType.value;
	filteredData = filteredData.filter((artist) => {
		let year = artist[filterType];

		if (year === null || year === undefined) return false;

		if (filterType === "firstAlbum") {
			const parts = year.split("-");
			year = parseInt(parts[parts.length - 1], 10);
		}
		return year >= fromValue && year <= toValue;
	});

	// Apply members filter
	const selectedSizes = Array.from(
		this.membersFilter.querySelectorAll("input:checked")
	).map((input) => parseInt(input.value, 10));

	if (selectedSizes.length > 0) {
		filteredData = filteredData.filter((artist) => {
			const memberCount = Array.isArray(artist.members)
				? artist.members.length
				: artist.members;
			return selectedSizes.includes(memberCount);
		});
	}

	// Apply sorting based on concert locations
	const sortValue = this.concertsFilter.value;
	if (sortValue === "location") {
		filteredData = sortByLocation(filteredData);
	}

	// Update the filtered data
	this.filteredData = filteredData;

	// Render the updated filtered data
	const data = {
		data: this.filteredData,
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
