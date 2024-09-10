import { getAllArtists, getArtistById } from "/static/scripts/fetchdata.js";
import { renderAllArtists, showModal } from "./renders.js";

/**
 * ArtistApp class to handle artist-related functionalities
 */
class ArtistApp {
	/**
	 * Initialize the ArtistApp and set up event listeners
	 */
	constructor() {
		this.initialize();
		this.setupEventListeners();
	}

	/**
	 * Fetches and displays all artists when the DOM is fully loaded
	 */
	async initialize() {
		try {
			const data = await getAllArtists();
			renderAllArtists(data);
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * Sets up event listeners for artist card clicks and search input
	 */
	setupEventListeners() {
		document.addEventListener("click", this.handleArtistCardClick.bind(this));
		document
			.getElementById("search")
			.addEventListener("input", this.handleSearchInput.bind(this));
	}

	/**
	 * Handles click events on artist cards
	 * Retrieves and displays artist details in a modal
	 * @param {Event} event - Click event on an artist card
	 */
	async handleArtistCardClick(event) {
		const artistLink = event.target.closest(".artist-card-link");
		if (!artistLink) return;

		event.preventDefault();

		const artistId = artistLink
			.querySelector(".artist-card")
			.getAttribute("data-artist-id");

		if (!artistId) return;

		try {
			const data = await getArtistById(artistId);
			showModal(data);
		} catch (err) {
			console.error("Error fetching artist details:", err);
		}
	}

	/**
	 * Handles input events on the search bar
	 * Filters artist cards based on the search query
	 */
	handleSearchInput() {
		const query = document.getElementById("search").value.toLowerCase();
		const cards = document.querySelectorAll("#artistsContainer .artist-card");

		cards.forEach((card) => {
			const artistName = card
				.querySelector(".artist-name")
				.textContent.toLowerCase();
			card.style.display = artistName.includes(query) ? "block" : "none";
		});
	}
}

// Instantiate the ArtistApp when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => new ArtistApp());
