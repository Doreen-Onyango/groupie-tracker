const baseUrl = "http://localhost:4000/api/";
const headers = new Headers({
	"Content-Type": "application/json",
});

/**
 * Utility function to fetch data from the server
 * @param {string} endpoint - The API endpoint to send the request to
 * @param {Object} [bodyData] - Optional body data to send with the request
 * @returns {Promise<Object>} - The JSON response from the server or an error object
 */
const fetchData = async (endpoint, bodyData = {}) => {
	const options = {
		method: "POST",
		headers,
		body: JSON.stringify(bodyData),
	};

	try {
		const response = await fetch(`${baseUrl}${endpoint}`, options);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		return {
			error: true,
			message: `Failed to fetch data from ${endpoint}: ${error.message}`,
			data: null,
		};
	}
};

export const getAllArtists = () => fetchData("getallartists");
export const getArtistById = (id) =>
	fetchData("getartistbyid", { artist_id: id });

export function controlFromSlider(
	fromSlider,
	toSlider,
	fromTooltip,
	toTooltip,
	sliderColor,
	rangeColor
) {
	const [from, to] = getParsed(fromSlider, toSlider);
	fillSlider(fromSlider, toSlider, sliderColor, rangeColor, toSlider);
	if (from > to) {
		fromSlider.value = to;
		toSlider.value = to + 1;
	}
	setTooltip(toSlider, toTooltip);
	setTooltip(fromSlider, fromTooltip);
	setToggleAccessible(toSlider);
}

export function controlToSlider(
	fromSlider,
	toSlider,
	fromTooltip,
	toTooltip,
	sliderColor,
	rangeColor
) {
	const [from, to] = getParsed(fromSlider, toSlider);
	fillSlider(fromSlider, toSlider, sliderColor, rangeColor, toSlider);
	if (to < from) {
		toSlider.value = from;
		fromSlider.value = from - 1;
	}
	setTooltip(toSlider, toTooltip);
	setTooltip(fromSlider, fromTooltip);
	setToggleAccessible(toSlider);
}

function getParsed(currentFrom, currentTo) {
	const from = parseInt(currentFrom.value, 10);
	const to = parseInt(currentTo.value, 10);
	return [from, to];
}

export function setTooltip(slider, tooltip) {
	const value = slider.value;
	tooltip.textContent = `${value}`;
	const thumbPosition = (value - slider.min) / (slider.max - slider.min);
	const percent = thumbPosition * 100;
	const markerWidth = 20;
	const offset = (((percent - 50) / 50) * markerWidth) / 2;
	tooltip.style.left = `calc(${percent}% - ${offset}px)`;
}

export function setToggleAccessible(currentTarget) {
	const fromSlider1 = document.querySelector("#fromSlider1");
	const toSlider1 = document.querySelector("#toSlider1");
	const fromSlider2 = document.querySelector("#fromSlider2");
	const toSlider2 = document.querySelector("#toSlider2");

	if (Number(fromSlider1.value) >= Number(toSlider1.value)) {
		fromSlider1.style.zIndex = 2;
		toSlider1.style.zIndex = 1;
	} else {
		fromSlider1.style.zIndex = 1;
		toSlider1.style.zIndex = 2;
	}

	if (Number(fromSlider2.value) >= Number(toSlider2.value)) {
		fromSlider2.style.zIndex = 2;
		toSlider2.style.zIndex = 1;
	} else {
		fromSlider2.style.zIndex = 1;
		toSlider2.style.zIndex = 2;
	}
}

export function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
	const rangeDistance = to.max - to.min;
	const fromPosition = from.value - to.min;
	const toPosition = to.value - to.min;
	controlSlider.style.background = `linear-gradient(
          to right,
          ${sliderColor} 0%,
          ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
          ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
          ${rangeColor} ${(toPosition / rangeDistance) * 100}%,
          ${sliderColor} ${(toPosition / rangeDistance) * 100}%,
          ${sliderColor} 100%)`;
}

/**
 * Sorts an array of artists by the number of concert locations.
 * @param {Array<Object>} artists - The array of artists to be sorted.
 * @returns {Array<Object>} - The sorted array of artists.
 */
export function sortByLocation(artists) {
	return artists.sort((a, b) => {
		const locationsA = a.locations?.length || 0;
		const locationsB = b.locations?.length || 0;
		return locationsB - locationsA;
	});
}

/**
 * Sorts an array of objects by the 'id' property.
 * @param {Array<Object>} items - The array of objects to be sorted.
 * @returns {Array<Object>} - The sorted array.
 */
export function sortById(items) {
	return items.sort((a, b) => a.id - b.id);
}
