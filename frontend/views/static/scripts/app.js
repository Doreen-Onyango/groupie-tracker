// Declare variables to store module references
let helpersModule;
let rendersModule;

// Load modules dynamically based on the environment
async function loadModules() {
	if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
		// For testing environment
		helpersModule = await import("./helpers.js");
		rendersModule = await import("./renders.js");
	} else {
		// For production or client-side environment
		helpersModule = await import("/static/scripts/helpers.js");
		rendersModule = await import("/static/scripts/renders.js");
	}
}

// Initialize the app with services after loading modules
async function initializeApp() {
	try {
		// Load required modules
		await loadModules();

		// Destructure required services from helpers and renders modules
		const {
			getAllArtists,
			getArtistById,
			getCoordinates,
			setTooltip,
			setToggleAccessible,
			fillSlider,
			controlToSlider,
			controlFromSlider,
		} = helpersModule;
		const { renderAllArtists, showModal } = rendersModule;

		loadModules().then(() => {
			// Initialize the ArtistApp with the services
			const app = new ArtistApp({
				getAllArtists,
				getArtistById,
				getCoordinates,
				renderAllArtists,
				showModal,
				setTooltip,
				setToggleAccessible,
				fillSlider,
				controlToSlider,
				controlFromSlider,
			});
		});
	} catch (error) {
		console.error("Error loading modules:", error);
	}
}

/**
 * ArtistApp class to handle artist-related functionalities
 */
export default class ArtistApp {
	constructor(services) {
		this.services = services;
		this.domElements = {};
		this.activeQueries = [];
		this.currentPage = 1;
		this.itemsPerPage = 10;
		this.totalPages = 0;
		this.summaryCounter = 0;

		// Bind external services to the app
		this.getAllArtists = services.getAllArtists;
		this.getArtistById = services.getArtistById;
		this.getCoordinates = services.getCoordinates;
		this.renderAllArtists = services.renderAllArtists;
		this.showModal = services.showModal;
		this.setTooltip = services.setTooltip;
		this.setToggleAccessible = services.setToggleAccessible;
		this.fillSlider = services.fillSlider;
		this.controlToSlider = services.controlToSlider;
		this.controlFromSlider = services.controlFromSlider;

		// Initialize and set up event listeners
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
		albumReleaseSuggestions: document.getElementById("albumReleaseSuggestions"),
		membersSuggestions: document.getElementById("membersSuggestions"),
		searchSummary: document.getElementById("searchSummary"),
		searchUnified: document.getElementById("searchUnified"),
		unifiedSuggestions: document.getElementById("unifiedSuggestions"),
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
		searchByMembers: document.getElementById("searchByMembers"),
		prevPageButton: document.getElementById("prevPage"),
	};

	this.artistsData = await this.getAllArtists();
	this.filteredData = [...this.artistsData.data];
	this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);

	// Fetch artist details and geolocation data
	const artistDetails = await this.fetchAllArtistDetails();

	// Merge artist data and geolocation into a single object for each artist
	this.allArtistDetails = artistDetails.map((detail) => ({
		...detail.artistData,
		geoLocations: detail.geoLocations,
	}));

	// Calculate and set year ranges
	this.calculateMinMaxYears();

	// Apply filters and display initial data
	this.applyAllFilters(this.activeQueries);
	if (this.currentPage === 1 && this.domElements.prevPageButton)
		this.domElements.prevPageButton.classList.add("disabled");
};

/**
 * Fetches detailed data for all artists
 * @returns {Promise<Array>} - An array of artist details
 */
ArtistApp.prototype.fetchAllArtistDetails = async function () {
	const artistDetails = await Promise.all(
		this.artistsData.data.map(async (artist) => {
			const artistData = await this.getArtistById(artist.id);
			const geoLocations = await this.getCoordinates(artist.id);
			return { artistData, geoLocations };
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
			element: document.getElementById("nextPage"),
			event: "click",
			handler: () => this.changePage(this.currentPage + 1),
		},
		{
			element: document.getElementById("prevPage"),
			event: "click",
			handler: () => this.changePage(this.currentPage - 1),
		},
		{
			element: this.domElements.resetButton,
			event: "click",
			handler: this.resetFilters,
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
		if (element) {
			// Check if element is not null
			element.addEventListener(event, handler.bind(this));
		} else {
			console.warn("Element not found for event listener:", {
				event,
				handler,
			});
		}
	});
};

/**
 * Applies all active filters (search, members, and range filters)
 * Filters artist cards based on the current state of all filters
 */
ArtistApp.prototype.applyAllFilters = function (activeQueries) {
	if (!this.artistsData || this.activeQueries.length > 3) return;

	let accumulatedResults = [];

	// If no queries are present, use the full dataset
	if (activeQueries.length === 0 || activeQueries.length === undefined) {
		this.filteredData = [...this.artistsData.data];
	} else {
		// Iterate over each query type and apply the respective filter for each value in the array
		activeQueries.forEach((query) => {
			let result = [];

			switch (query.type) {
				case "searchByConcert":
					query.value.forEach((concertValue) => {
						const concertResult = this.applySearchByConcertFilter(
							this.filteredData,
							concertValue
						);
						result = [...result, ...concertResult];
					});
					break;
				case "searchByName":
					query.value.forEach((nameValue) => {
						const nameResult = this.applySearchByNameFilter(
							this.filteredData,
							nameValue
						);
						result = [...result, ...nameResult];
					});
					break;
				case "searchByMembers":
					query.value.forEach((memberValue) => {
						const memberResult = this.applySearchByMembersFilter(
							this.filteredData,
							memberValue
						);
						result = [...result, ...memberResult];
					});
					break;
				case "searchByAlbumRelease":
					query.value.forEach((albumValue) => {
						const albumResult = this.applySearchByAlbumReleaseFilter(
							this.filteredData,
							albumValue
						);
						result = [...result, ...albumResult];
					});
					break;
				case "searchByCreationDate":
					query.value.forEach((creationValue) => {
						const creationResult = this.applySearchByCreationDateFilter(
							this.filteredData,
							creationValue
						);
						result = [...result, ...creationResult];
					});
					break;
				default:
					break;
			}

			// Accumulate results from each filter applied to all values of the query
			accumulatedResults = [...accumulatedResults, ...result];
		});
	}

	// If results exist after applying filters, update filteredData
	if (accumulatedResults.length > 0) {
		this.filteredData = accumulatedResults;
	}

	// Apply additional filters and render the results
	this.filteredData = this.applyMembersFilter(this.filteredData);
	this.filteredData = this.applyRangeFilters(this.filteredData);

	// Calculate total pages after filtering
	this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);

	// Render the paginated data
	this.renderPaginatedArtists();
};

/**
 * Sorts an array of objects by the 'id' property.
 * @param {Array<Object>} items - The array of objects to be sorted.
 * @returns {Array<Object>} - The sorted array.
 */
ArtistApp.prototype.sortById = function (items) {
	return items.sort((a, b) => Number(a.id) - Number(b.id));
};

/**
 * Renders the artist cards for the current page based on the filtered data
 */
ArtistApp.prototype.renderPaginatedArtists = function () {
	const startIndex = (this.currentPage - 1) * this.itemsPerPage;
	const endIndex = startIndex + this.itemsPerPage;

	this.filteredData = this.sortById(this.filteredData);

	const paginatedData = this.filteredData.slice(startIndex, endIndex);
	if (this.currentPage > this.totalPages) {
		this.renderFilteredData(this.filteredData);
	} else {
		this.renderFilteredData(paginatedData);
	}
};

/**
 * Handles page changes and ensures filtered data is paginated correctly
 */
ArtistApp.prototype.changePage = function (page) {
	// Ensure the page is within bounds
	if (page < 1 || page > this.totalPages) return;

	// Update the current page and render the paginated artists
	this.currentPage = page;
	this.renderPaginatedArtists();

	// Update pagination button states
	const prevPageButton = document.getElementById("prevPage");
	const nextPageButton = document.getElementById("nextPage");

	// Enable/disable the "Previous" button
	if (this.currentPage === 1) {
		prevPageButton.classList.add("disabled");
	} else {
		prevPageButton.classList.remove("disabled");
	}

	// Enable/disable the "Next" button
	if (this.currentPage === this.totalPages) {
		nextPageButton.classList.add("disabled");
	} else {
		nextPageButton.classList.remove("disabled");
	}
};

/**
 * Applies range filters (creation date and first album) and returns the filtered data
 */
ArtistApp.prototype.applyRangeFilters = function (data) {
	// Check if data is valid and iterable
	if (!Array.isArray(data)) {
		console.error("Invalid data passed to applyRangeFilters:", data);
		return [];
	}

	let creationDateFilteredData = this.applyCreationDateFilter([...data]);
	let albumReleaseFilteredData = this.applyFirstAlbumFilter([...data]);
	let finalFilteredData = creationDateFilteredData.filter((artist) =>
		albumReleaseFilteredData.some((a) => a.id === artist.id)
	);
	//TODO
	// add labels for rangefilters this.calculateMinMaxYears(finalFilteredData);
	return finalFilteredData;
};

/**
 * Handles input event for the unified search input to show suggestions dropdown.
 */
ArtistApp.prototype.handleUnifiedSearchInput = function () {
	const query = this.domElements.searchUnified.value.toLowerCase().trim();
	this.handleCreationDateSearchInput(query);
	this.handleAlbumReleaseSearchInput(query);
	this.handleConcertSearchInput(query);
	this.handleMembersSearchInput(query);
	this.handleNameSearchInput(query);
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

	const suggestions = uniqueAlbumReleaseYears
		.filter((year) => year.toString().startsWith(query))
		.map(
			(year) =>
				`<div class="suggestion-item" data-albumrelease="${year}" data-label="album released">
					${year}
				</div>`
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
ArtistApp.prototype.applySearchByAlbumReleaseFilter = function (
	filteredData,
	albumReleaseQuery
) {
	if (!albumReleaseQuery) return filteredData;

	return filteredData.filter((artist) => {
		return artist.firstAlbum.toString().startsWith(albumReleaseQuery);
	});
};

/**
 * Apply search by creation date filter
 */
ArtistApp.prototype.applySearchByCreationDateFilter = function (
	filteredData,
	creationDateQuery
) {
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

	const suggestions = uniqueCreationDates
		.filter((date) => date.toString().startsWith(query))
		.map(
			(date) =>
				`<div class="suggestion-item" data-creationdate="${date}" data-label="creation date">
					${date}
				</div>`
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
ArtistApp.prototype.applySearchByNameFilter = function (
	filteredData,
	nameQuery
) {
	return filteredData.filter((artist) => {
		const artistName = artist.name.toLowerCase();
		return artistName.includes(nameQuery);
	});
};

/**
 * Apply search by members filter.
 * @param {Array} filteredData - The current filtered artist data.
 * @param {string} nameQuery - The search query for the member name.
 * @returns {Array} - The data filtered by artist members.
 */
ArtistApp.prototype.applySearchByMembersFilter = function (
	filteredData,
	nameQuery
) {
	// Filter the data by checking if any member of the artist matches the query
	return filteredData.filter((artist) =>
		artist.members.some((member) =>
			member.toLowerCase().includes(nameQuery.toLowerCase())
		)
	);
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
				`<div class="suggestion-item" data-name="${artist.name}" data-label="artist name">
					${artist.name}
				</div>`
		)
		.join("");

	this.domElements.nameSuggestions.innerHTML = nameSuggestions;
	this.domElements.nameSuggestions.style.display = nameSuggestions
		? "block"
		: "none";

	this.addSuggestionClick("nameSuggestions", "searchByName");
};

/**
 * Handles input event for searching by artist members.
 * @param {string} query - The search query entered by the user.
 */
ArtistApp.prototype.handleMembersSearchInput = function (query) {
	// track uniques to prevent duplicates
	const uniqueMembers = new Set();

	// Flatten the members from all artists and filter by the search query
	const membersSuggestions = this.artistsData.data
		.flatMap((artist) =>
			artist.members.filter((member) => {
				const lowerCaseMember = member.toLowerCase();

				if (
					lowerCaseMember.includes(query.toLowerCase()) &&
					!uniqueMembers.has(lowerCaseMember)
				) {
					uniqueMembers.add(lowerCaseMember);
					return true;
				}
				return false;
			})
		)
		.map(
			(member) =>
				`<div class="suggestion-item" data-members="${member}" data-label="member">${member}</div>`
		)
		.join("");

	// Update the suggestions container with the filtered results
	this.domElements.membersSuggestions.innerHTML = membersSuggestions;
	this.domElements.membersSuggestions.style.display = membersSuggestions
		? "block"
		: "none";

	this.addSuggestionClick("membersSuggestions", "searchByMembers");
};

/**
 * Apply search by concert location filter
 * @param {Array} filteredData - the current filtered artist data
 * @returns {Array} filteredData - the data filtered by concert location
 */
ArtistApp.prototype.applySearchByConcertFilter = function (
	filteredData,
	concertQuery
) {
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
ArtistApp.prototype.handleConcertSearchInput = function (data) {
	const query = data
		.toLowerCase()
		.replace(/[^a-z]+/g, "-")
		.trim();

	// track unique location suggestions
	const uniqueLocations = new Set();

	const concertSuggestions = this.allArtistDetails
		.flatMap((artistDetail) => artistDetail.data.locations?.locations || [])
		.filter((location) => {
			const lowerCaseLocation = location.toLowerCase();

			if (
				lowerCaseLocation.includes(query) &&
				!uniqueLocations.has(lowerCaseLocation)
			) {
				uniqueLocations.add(lowerCaseLocation);
				return true;
			}
			return false;
		})
		.map(
			(location) =>
				`<div class="suggestion-item" data-location="${location}" data-label="location">${location
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
	event.stopPropagation();
	this.domElements.unifiedSuggestions.classList.add("hidden");
	this.domElements.searchUnified.value = "";
};

/**
 * Updates or adds a new query to the active queries list.
 * It stores multiple values for any query type (like name, members, concerts, etc.) in an array.
 */
ArtistApp.prototype.addQuery = function (type, value) {
	const existingQueryIndex = this.activeQueries.findIndex(
		(q) => q.type === type
	);

	// If the query type is new, add it with the value in an array
	if (existingQueryIndex === -1) {
		this.activeQueries.push({ type, value: [value] });
	} else {
		if (!this.activeQueries[existingQueryIndex].value.includes(value)) {
			this.activeQueries[existingQueryIndex].value.push(value);
		}
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
		searchByMembers: "data-members",
		searchByConcert: "data-location",
		searchByCreationDate: "data-creationdate",
		searchByAlbumRelease: "data-albumRelease",
	};

	this.domElements.unifiedSuggestions.classList.remove("hidden");
	Array.from(suggestionBox.querySelectorAll(".suggestion-item")).forEach(
		(item) => {
			item.addEventListener("click", (e) => {
				const dataAttribute = attributeMapping[inputElementId];
				if (dataAttribute) {
					let value = e.target.getAttribute(dataAttribute);
					value = value.replace(/-(?!\d{2})/g, " ");
					inputField.value = value;
					suggestionBox.style.display = "none";

					this.addQuery(inputElementId, value.toLowerCase().trim());
					this.applyAllFilters(this.activeQueries);
					this.addSearchSummaryItem(inputElementId, value);
				} else {
					console.error(`No data attribute found for ${inputElementId}`);
				}
			});
		}
	);
};

// Function to add an item to the search summary and handle removal with filtering
ArtistApp.prototype.addSearchSummaryItem = function (inputElementId, value) {
	if (this.activeQueries.length > 3) return;
	// TODO: add a toast
	const summaryContainer = document.getElementById("searchSummary");
	const item = document.createElement("div");
	item.className = "searchSummaryItem";

	const itemText = document.createElement("p");
	const splitId = inputElementId.split("By");
	const type = splitId[splitId.length - 1];

	itemText.textContent = `${type}: ${value}`;
	if (this.activeQueries.length > 0) {
		this.summaryCounter++;
		this.domElements.searchUnified.placeholder =
			this.summaryCounter < 2
				? `added ${this.summaryCounter} item`
				: `added ${this.summaryCounter} items`;
	}

	// Create the close icon
	const closeIcon = document.createElement("span");
	closeIcon.className = "closeIcon";
	closeIcon.textContent = "×";

	closeIcon.addEventListener("click", (e) => {
		this.activeQueries = this.activeQueries
			.map((query) => {
				if (query.value.includes(value.toLowerCase().trim())) {
					query.value = query.value.filter(
						(val) => val.toLowerCase().trim() !== value.toLowerCase().trim()
					);
				}
				return query;
			})
			.filter((query) => query.value.length > 0);

		item.remove();

		if (this.activeQueries.length > 0) {
			this.summaryCounter--;
			this.domElements.searchUnified.placeholder =
				this.summaryCounter < 2
					? `added ${this.summaryCounter} item`
					: `added ${this.summaryCounter} items`;
		} else {
			this.domElements.searchUnified.placeholder =
				"Search for artists, concerts, performed locations and album release....";
		}

		if (this.activeQueries.length < 1) {
			const searchIcon =
				this.domElements.searchSummary.querySelector(".search-icon");
			this.domElements.searchSummary.innerHTML = "";
			if (searchIcon) {
				this.domElements.searchSummary.appendChild(searchIcon);
			}
		}

		this.applyAllFilters(this.activeQueries);
	});

	item.appendChild(itemText);
	item.appendChild(closeIcon);
	summaryContainer.appendChild(item);
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
	if (!this.domElements.membersFilter) {
		console.error("membersFilter element not found");
		return;
	}
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
 * Removes duplicate artist data and renders the filtered data.
 * @param {Array} filteredData - The current filtered artist data.
 */
ArtistApp.prototype.renderFilteredData = function (filteredData) {
	if (typeof this.renderAllArtists !== "function") {
		console.error("renderAllArtists is not a function:", this.renderAllArtists);
		return; // Prevent further execution
	}

	const uniqueArtists = [];
	const seenIds = new Set();

	filteredData.forEach((artist) => {
		if (!seenIds.has(artist.id)) {
			uniqueArtists.push(artist);
			seenIds.add(artist.id);
		}
	});

	// Prepare the data object with deduplicated artists
	const data = {
		data: uniqueArtists,
		message: this.artistsData.message,
		error: this.artistsData.error,
	};

	// Render the unique artist data
	this.renderAllArtists(data);
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

	// Find the artist details in `allArtistDetails`
	const artistData = this.allArtistDetails.find(
		(artist) => artist.data.artist.id === artistId
	);

	if (artistData) {
		this.showModal(artistData);
	} else {
		console.error("Artist data not found.");
	}
};

/**
 * Calculates the minimum and maximum years for creation dates and album releases
 * @param {Array} artistData - The array of artist data
 */
ArtistApp.prototype.calculateMinMaxYears = function () {
	if (!this.filteredData || this.filteredData.length === 0) return;

	this.yearRanges = {
		minCreationDate: Infinity,
		maxCreationDate: -Infinity,
		minAlbumDate: Infinity,
		maxAlbumDate: -Infinity,
	};

	// Loop through artist data to calculate min/max values
	this.filteredData.forEach((artist) => {
		const creationYear = artist.creationDate;
		const albumYear = artist.firstAlbum
			? parseInt(artist.firstAlbum.split("-").pop())
			: null;

		// Update creation date range
		if (creationYear) {
			this.yearRanges.minCreationDate = Math.min(
				this.yearRanges.minCreationDate,
				creationYear
			);
			this.yearRanges.maxCreationDate = Math.max(
				this.yearRanges.maxCreationDate,
				creationYear
			);
		}

		// Update album release date range
		if (albumYear) {
			this.yearRanges.minAlbumDate = Math.min(
				this.yearRanges.minAlbumDate,
				albumYear
			);
			this.yearRanges.maxAlbumDate = Math.max(
				this.yearRanges.maxAlbumDate,
				albumYear
			);
		}
	});

	// Ensure reasonable defaults if no valid years are found
	this.yearRanges.minCreationDate =
		this.yearRanges.minCreationDate === Infinity
			? 0
			: this.yearRanges.minCreationDate;
	this.yearRanges.maxCreationDate =
		this.yearRanges.maxCreationDate === -Infinity
			? new Date().getFullYear()
			: this.yearRanges.maxCreationDate;
	this.yearRanges.minAlbumDate =
		this.yearRanges.minAlbumDate === Infinity
			? 0
			: this.yearRanges.minAlbumDate;
	this.yearRanges.maxAlbumDate =
		this.yearRanges.maxAlbumDate === -Infinity
			? new Date().getFullYear()
			: this.yearRanges.maxAlbumDate;

	// After calculating min and max years, update the sliders
	this.setRangeFilterDefaults();
};

/**
 * Updates the slider values by setting the min, max, and current values.
 * @param {HTMLElement} fromSlider - The "from" slider element.
 * @param {HTMLElement} toSlider - The "to" slider element.
 * @param {number} minYear - The minimum year value for the slider.
 * @param {number} maxYear - The maximum year value for the slider.
 */
ArtistApp.prototype.updateSliderValues = function (
	fromSlider,
	toSlider,
	minYear,
	maxYear
) {
	fromSlider.min = minYear;
	fromSlider.max = maxYear;
	fromSlider.value = minYear;

	toSlider.min = minYear;
	toSlider.max = maxYear;
	toSlider.value = maxYear;
};

/**
 * Attaches slider events to control the "from" and "to" sliders for interactivity.
 * @param {HTMLElement} fromSlider - The "from" slider element.
 * @param {HTMLElement} toSlider - The "to" slider element.
 * @param {HTMLElement} fromTooltip - The tooltip element for the "from" slider.
 * @param {HTMLElement} toTooltip - The tooltip element for the "to" slider.
 * @param {string} trackColor - The color of the slider track.
 * @param {string} rangeColor - The color of the slider range.
 */
ArtistApp.prototype.attachSliderEvents = function (
	fromSlider,
	toSlider,
	fromTooltip,
	toTooltip,
	trackColor,
	rangeColor
) {
	fromSlider.oninput = () =>
		this.controlFromSlider(
			fromSlider,
			toSlider,
			fromTooltip,
			toTooltip,
			trackColor,
			rangeColor
		);

	toSlider.oninput = () =>
		this.controlToSlider(
			fromSlider,
			toSlider,
			fromTooltip,
			toTooltip,
			trackColor,
			rangeColor
		);
};

/**
 * Initializes the slider visuals by setting the track and range colors, tooltips, and accessibility settings.
 * @param {HTMLElement} fromSlider - The "from" slider element.
 * @param {HTMLElement} toSlider - The "to" slider element.
 * @param {string} trackColor - The color of the slider track.
 * @param {string} rangeColor - The color of the slider range.
 * @param {HTMLElement} fromTooltip - The tooltip element for the "from" slider.
 * @param {HTMLElement} toTooltip - The tooltip element for the "to" slider.
 */
ArtistApp.prototype.initializeSliderVisuals = function (
	fromSlider,
	toSlider,
	trackColor,
	rangeColor,
	fromTooltip,
	toTooltip
) {
	this.fillSlider(fromSlider, toSlider, trackColor, rangeColor, toSlider);
	this.setToggleAccessible(toSlider);
	this.setTooltip(fromSlider, fromTooltip);
	this.setTooltip(toSlider, toTooltip);
};

/**
 * Sets the default values for range filters (creation dates and album releases)
 * Consumes the pre-calculated min/max years and initializes slider visuals.
 */
ArtistApp.prototype.setRangeFilterDefaults = function () {
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

	const { minCreationDate, maxCreationDate, minAlbumDate, maxAlbumDate } =
		this.yearRanges;

	// Ensure sliders and tooltips exist before setting values
	if (!fromSlider1 || !toSlider1 || !fromSlider2 || !toSlider2) {
		console.error("Sliders are not available in the DOM.");
		return;
	}

	// Set values for Creation Date Slider
	this.updateSliderValues(
		fromSlider1,
		toSlider1,
		minCreationDate,
		maxCreationDate
	);

	// Set values for Album Release Slider
	this.updateSliderValues(fromSlider2, toSlider2, minAlbumDate, maxAlbumDate);

	// Attach slider events for both sliders
	this.attachSliderEvents(
		fromSlider1,
		toSlider1,
		fromTooltip1,
		toTooltip1,
		"var(--code-color)",
		"var(--background-color)"
	);
	this.attachSliderEvents(
		fromSlider2,
		toSlider2,
		fromTooltip2,
		toTooltip2,
		"var(--code-color)",
		"var(--background-color)"
	);

	// Initialize slider visuals for Creation Date slider if tooltips exist
	if (fromTooltip1 && toTooltip1) {
		this.initializeSliderVisuals(
			fromSlider1,
			toSlider1,
			"var(--code-color)",
			"var(--background-color)",
			fromTooltip1,
			toTooltip1
		);
	} else {
		console.error("Creation Date tooltips are missing.");
	}

	// Initialize slider visuals for Album Release slider if tooltips exist
	if (fromTooltip2 && toTooltip2) {
		this.initializeSliderVisuals(
			fromSlider2,
			toSlider2,
			"var(--code-color)",
			"var(--background-color)",
			fromTooltip2,
			toTooltip2
		);
	} else {
		console.error("Album Release tooltips are missing.");
	}
};

/**
 * Resets all filters to their default values
 */
ArtistApp.prototype.resetFilters = function () {
	// Reset text inputs
	this.domElements.searchUnified.value = "";
	this.domElements.searchByName.value = "";
	this.domElements.searchByConcert.value = "";
	this.domElements.searchByCreationDate.value = "";
	this.domElements.searchByAlbumRelease.value = "";
	this.activeQueries = [];

	// Reset summary but retain the search icon
	const searchIcon =
		this.domElements.searchSummary.querySelector(".search-icon");
	this.domElements.searchSummary.innerHTML = "";
	if (searchIcon) {
		this.domElements.searchSummary.appendChild(searchIcon);
	}
	this.activeQueries = [];

	// Reset sliders
	this.domElements.fromSlider1.value = this.domElements.fromSlider1.min;
	this.domElements.toSlider1.value = this.domElements.toSlider1.max;
	this.domElements.fromSlider2.value = this.domElements.fromSlider2.min;
	this.domElements.toSlider2.value = this.domElements.toSlider2.max;

	// Reset data
	this.filteredData = [...this.artistsData.data];

	// Reset tooltips and slider visuals
	this.setTooltip(this.domElements.fromSlider1, this.domElements.fromTooltip1);
	this.setTooltip(this.domElements.toSlider1, this.domElements.toTooltip1);
	this.setTooltip(this.domElements.fromSlider2, this.domElements.fromTooltip2);
	this.setTooltip(this.domElements.toSlider2, this.domElements.toTooltip2);

	this.fillSlider(
		this.domElements.fromSlider1,
		this.domElements.toSlider1,
		"var(--code-color)",
		"var(--background-color)",
		this.domElements.toSlider1
	);
	this.fillSlider(
		this.domElements.fromSlider2,
		this.domElements.toSlider2,
		"var(--code-color)",
		"var(--background-color)",
		this.domElements.toSlider2
	);

	// Reset checkboxes
	Array.from(
		this.domElements.membersFilter.querySelectorAll("input:checked")
	).forEach((checkbox) => (checkbox.checked = false));

	this.applyAllFilters(this.activeQueries);
};

/**
 * Creates a new instance of ArtistApp and starts the application
 */
if (typeof document !== "undefined") {
	document.addEventListener("DOMContentLoaded", initializeApp);
}
