import {
	getAllArtists,
	getArtistById,
	setTooltip,
	createScale,
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
	document
		.getElementById("membersFilter")
		.addEventListener("change", this.handleMembersFilter.bind(this));
	document.addEventListener(
		"DOMContentLoaded",
		this.handleDOMContentLoaded.bind(this)
	);
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
 * Handles changes to the members filter
 * Filters artist cards based on the selected member sizes
 */
ArtistApp.prototype.handleMembersFilter = function () {
	if (!this.artistsData) return;

	const selectedSizes = Array.from(
		document.querySelectorAll("#membersFilter input:checked")
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
	this.handleDOMContentLoaded();

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
 * Handles the DOMContentLoaded event to initialize the application
 * @param {Event} event - DOMContentLoaded event
 */
ArtistApp.prototype.handleDOMContentLoaded = function (event) {
	const COLOR_TRACK = "#CBD5E1";
	const COLOR_RANGE = "#0EA5E9";

	// Get the sliders and tooltips
	const fromSlider = document.querySelector("#fromSlider");
	const toSlider = document.querySelector("#toSlider");
	const fromTooltip = document.querySelector("#fromSliderTooltip");
	const toTooltip = document.querySelector("#toSliderTooltip");
	const scale = document.getElementById("scale");

	// Get min and max values from the fromSlider element
	const MIN = parseInt(fromSlider.getAttribute("min")); // scale will start from min value (first range slider)
	const MAX = parseInt(fromSlider.getAttribute("max")); // scale will end at max value (first range slider)
	const STEPS = parseInt(scale.dataset.steps); // update the data-steps attribute value to change the scale points

	// events
	fromSlider.oninput = () =>
		controlFromSlider(fromSlider, toSlider, fromTooltip, toTooltip);
	toSlider.oninput = () =>
		controlToSlider(fromSlider, toSlider, fromTooltip, toTooltip);

	// Initial load
	fillSlider(fromSlider, toSlider, COLOR_TRACK, COLOR_RANGE, toSlider);
	setToggleAccessible(toSlider);
	setTooltip(fromSlider, fromTooltip);
	setTooltip(toSlider, toTooltip);
	createScale(MIN, MAX, STEPS);
};

/**
 * Creates a new instance of ArtistApp and starts the application
 */
document.addEventListener("DOMContentLoaded", () => {
	const app = new ArtistApp();
});
