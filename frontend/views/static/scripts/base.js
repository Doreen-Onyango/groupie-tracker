// Define Base class
export default class Base {
	constructor() {
		this.homelink = document.querySelector("#nav-groupie a");
		this.setupEventListeners();
		this.toggleSearch();

		if (window.location.pathname !== "/") {
			this.homelink.classList.remove("disabled-link");
		}
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
	this.homelink.addEventListener("click", this.handleHomelink.bind(this));
};

// Handle clicks on the home link
Base.prototype.handleHomelink = function (event) {
	if (window.location.pathname === "/") {
		event.preventDefault();
	}
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

const themeSwitcher = document.getElementById('themeSwitcher');
let currentTheme = localStorage.getItem('theme') || 'light';

// Apply the saved theme on page load
const body = document.body;
body.setAttribute('data-theme', currentTheme);

// Update the themeSwitcher's appearance based on the current theme
function updateTheme() {
  if (currentTheme === 'light') {
    body.setAttribute('data-theme', 'light');
  } else if (currentTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
  } else if (currentTheme === 'blue') {
    body.setAttribute('data-theme', 'blue');
  }
}

// Listen for clicks on the theme switcher button
themeSwitcher.addEventListener('click', () => {
  if (currentTheme === 'light') {
    currentTheme = 'dark';
  } else if (currentTheme === 'dark') {
    currentTheme = 'blue';
  } else if (currentTheme === 'blue') {
    currentTheme = 'light';
  }
  
  // Save the new theme to localStorage
  localStorage.setItem('theme', currentTheme);
  updateTheme();
});
