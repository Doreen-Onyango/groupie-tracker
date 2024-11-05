// Define Base class
export default class Base {
	constructor() {
		this.setupEventListeners();
		this.toggleSearch();
	}
}

Base.prototype.toggleSearch = function () {
	const searchIcon = document.querySelector(".search-icon");
	const searchBox = document.querySelector(".search-box");
	const searchInput = document.getElementById("searchUnified");

	searchIcon.onclick = function toggleSearch() {
		searchInput.classList.toggle("expanded");
		searchInput.focus();

		if (searchInput.classList.contains("expanded")) {
			searchIcon.style.transition = "margin-top 0.7s ease-in-out";
			searchBox.style.width ="100%";
		} else {
			searchBox.style.width = "0";
			searchIcon.style.transition = "margin-top 0.5s ease-out";
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
