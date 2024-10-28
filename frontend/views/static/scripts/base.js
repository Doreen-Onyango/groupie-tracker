export default class Base {
	constructor() {
		this.setupEventListeners();
	}
}

/**
 * Sets up event listeners for the application
 */
Base.prototype.setupEventListeners = function () {
	document.addEventListener("keydown", this.handleShortcuts.bind(this));
};

/**
 * Handles keyboard shortcuts events
 */
Base.prototype.handleShortcuts = function (event) {
	const isCtrl = event.ctrlKey;
	const isAlt = event.altKey;

	switch (event.key.toLowerCase()) {
		case "a":
			// About Page = Ctrl + Alt + A
			if (isCtrl && isAlt) {
				event.preventDefault();
				window.location.href = "/about";
			}
			break;

		case "h":
			// Home Page = Ctrl + Alt + H
			if (isCtrl && isAlt) {
				event.preventDefault();
				window.location.href = "/";
			}
			break;

		default:
			break;
	}
};

if (typeof document !== "undefined") {
	document.addEventListener("DOMContentLoaded", () => new Base());
}
