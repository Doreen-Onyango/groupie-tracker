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
 * Sorts an array of objects by the 'id' property.
 * @param {Array<Object>} items - The array of objects to be sorted.
 * @returns {Array<Object>} - The sorted array.
 */
export function sortById(items) {
	return items.sort((a, b) => a.id - b.id);
}

export function fetchMap(id) {
	const map = new google.maps.Map(document.getElementById("map"), {
		zoom: 4,
		center: { lat: 39.8283, lng: -98.5795 }, // Center of the USA
	});

	// Fetch the concert locations with lat/lng from the backend
	fetch(`/api/artist/concerts?artist_id=${id}`)
		.then((response) => response.json())
		.then((data) => {
			data.concerts.forEach((concert) => {
				const marker = new google.maps.Marker({
					map: map,
					position: { lat: concert.latitude, lng: concert.longitude },
					title: concert.location,
				});

				const infoWindow = new google.maps.InfoWindow({
					content: `<h3>${concert.location}</h3><p>Date: ${concert.date}</p>`,
				});

				marker.addListener("click", () => {
					infoWindow.open(map, marker);
				});
			});
		})
		.catch((error) => console.error("Error fetching concert data:", error));
};
