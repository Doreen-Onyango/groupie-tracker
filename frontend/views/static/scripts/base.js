// Define Base class
export default class Base {
	constructor() {
		this.setupEventListeners();
		this.toggleSearch();
	}
}

Base.prototype.toggleSearch = function () {
	const searchIcon = document.querySelector(".search-icon");
	searchIcon.onclick = function toggleSearch() {
		const searchInput = document.getElementById("searchUnified");
		searchInput.classList.toggle("expanded");
		searchInput.focus();

		if (searchInput.classList.contains("expanded")) {
			searchIcon.style.transition = "margin-top 0.7s ease-in-out"; // Adjust easing for moving up
			searchIcon.style.marginTop = "-15%";
		} else {
			searchIcon.style.transition = "margin-top 0.5s ease-out"; // Adjust easing for returning
			searchIcon.style.marginTop = "-50%";
		}
	};
};

// Sets up event listeners for the application
Base.prototype.setupEventListeners = function () {
	document.addEventListener("keydown", this.handleShortcuts.bind(this));
};

// Handles keyboard shortcuts events
Base.prototype.handleShortcuts = function (event) {
	const isCtrl = event.ctrlKey;
	const isAlt = event.altKey;

	switch (event.key.toLowerCase()) {
		case "a":
			if (isCtrl && isAlt) {
				event.preventDefault();
				window.location.href = "/about";
			}
			break;

		case "h":
			if (isCtrl && isAlt) {
				event.preventDefault();
				window.location.href = "/";
			}
			break;

		default:
			break;
	}
};

// instantiate Base navigation class
if (typeof document !== "undefined") {
	document.addEventListener("DOMContentLoaded", () => new Base());
}
