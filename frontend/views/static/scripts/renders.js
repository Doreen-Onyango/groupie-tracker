// Renders all artists or displays an error message if there's an issue
// @param {Object} artistsData - The data object containing artists, message, and error status
export const renderAllArtists = ({ data, message, error }) => {
	const container = document.querySelector("#artistsContainer");
	const template = document.getElementById("artistCardTemplate");
	const loader = document.querySelector(".loader-container");

	container.innerHTML = error
		? `<div class="error-message">
				<h2>Oops, there is a network issue!</h2>
				<p>${message}</p>
			</div>`
		: "";
	if (error) {
		loader.style.display = "none";
		return;
	}

	data.forEach((artist) => {
		const card = template.content.cloneNode(true);

		const artistCard = card.querySelector(".artist-card");
		artistCard.setAttribute("data-artist-id", artist.id);

		card.querySelector(".artist-name").textContent = artist.name;

		const image = card.querySelector(".artist-image");
		image.src = artist.image;
		image.alt = `${artist.name} image`;

		const membersList = card.querySelector(".artist-members");
		const memberCount = artist.members.length;
		const li = document.createElement("li");

		if (memberCount > 0) {
			const membersInWords = numberToWords(memberCount);
			li.textContent = `Has ${membersInWords} member${
				memberCount > 1 ? "s" : ""
			}`;
		} else {
			li.textContent = `Has no members`;
		}
		membersList.appendChild(li);

		if (memberCount > 0) {
			artist.members.forEach((member) => {
				const memberItem = document.createElement("li");
				memberItem.textContent = member.name;
				membersList.appendChild(memberItem);
			});
		} else {
			const noMembersItem = document.createElement("li");
			noMembersItem.textContent = "Has no members";
			membersList.appendChild(noMembersItem);
		}

		card.querySelector(".artist-creationDate-value").textContent +=
			artist.creationDate || "Unknown Creation Date";
		card.querySelector(".artist-firstAlbum-value").textContent =
			formatDate(artist.firstAlbum) || "Unknown First Album";

		container.appendChild(card);
	});
	loader.style.display = "none";
};

// Displays a modal with detailed information about an artist
// @param {Object} artistData - Contains details about the artist and associated data
export function showModal(artistData) {
	const { data, message, error } = artistData;
	const modal = document.getElementById("artistDetailsModal");
	const artistDetailsSection = document.querySelector("#artistDetails");

	setTimeout(() => {
		// if (typeof mapboxgl !== "undefined") {
		mapboxgl.accessToken = token;
		initializeMap(data);
		// } else {
		// 	console.error("Mapbox GL library is not loaded");
		// }
	}, 300);

	artistDetailsSection.innerHTML = error
		? `<div class="error-message">
				<h2>Oops, there is a network issue!</h2>
				<p>${message}</p>
			</div>`
		: generateArtistDetailsHTML(data);

	modal.classList.add("show");

	const modalContent = document.querySelector(".modal-content");
	modalContent.classList.add("show");

	const closeButton = document.querySelector(".close-button");
	closeButton.onclick = () => closeModal(modal, modalContent);

	window.onclick = (event) => {
		if (event.target === modal) closeModal(modal, modalContent);
	};
}

// Generates the HTML content for artist details.
// @param {Object} data - The artist data including artist, locations, concertDates, relations, geoLocations.
// @param {Array} geoLocations - The geolocation data associated with the artist.
// @returns {string} - The generated HTML string.
function generateArtistDetailsHTML(data) {
	const { artist, locations, concertDates, relations } = data;
	const memberCount = artist.members.length;
	const membersInWords = numberToWords(memberCount);
	let membersTitle = "";

	if (memberCount > 0) {
		membersTitle = `${membersInWords} member${memberCount > 1 ? "s" : ""}`;
	} else {
		membersTitle = `no members`;
	}

	const memberSentence =
		artist.members.length > 1
			? `${artist.members.slice(0, -1).join(", ")} and ${artist.members.slice(
					-1
				)}`
			: artist.members[0] || "No members";

	return `
	<div class="modal-artist-details">
		<div class="modal-artist-data">
			<div class="modal-artist-info">
				<img src="${artist.image}" alt="${artist.name}" class="modal-artist-image"/>
				<h2>${artist.name}</h2>
				<p>
					<strong>Creation Date:</strong> ${artist.creationDate || "Unknown"}
				</p>
				<p>
					<strong>First Album:</strong> ${formatDate(artist.firstAlbum) || "Unknown"}
				</p>
			</div>
			<div class="modal-artist-members">
				<div class="modal-artist-members-data">
					<p><strong>${toTitleCase(membersTitle)}</strong></p>
					<p>${memberSentence}</p>
				</div>
				<div class="modal-artist-concerts-data">
					<p><strong>Concerts Held:</strong></p>
					<ul>
						${
							Object.entries(relations.datesLocations).length
								? Object.entries(relations.datesLocations)
										.map(([location, dates]) => {
											const sortedDates = dates.sort(
												(a, b) => new Date(a) - new Date(b)
											);
											return `<li>${formatLocation(location)} on ${sortedDates
												.map(formatDate)
												.join(", ")}</li>`;
										})
										.join("")
								: "<li>No concerts held</li>"
						}
					</ul>
				</div>
			</div>
		</div>
		<div id="map" style="width: 100%; height: 400px;"></div>
	</div>`;
}

// Converts a date from 'DD-MM-YYYY' to 'YYYY-MM-DD' format for proper parsing.
// @param {string} dateStr - The date string in 'DD-MM-YYYY' format.
// @returns {string} - The date string in 'YYYY-MM-DD' format.
function convertDateFormat(dateStr) {
	const [day, month, year] = dateStr.split("-");
	return `${year}-${month}-${day}`;
}
// Sorts an array of objects by the date property in 'DD-MM-YYYY' format.
// @param {Array} data - The array of objects to sort. Each object should have a 'date' property.
// @param {string} dateProperty - The property name that holds the date value in each object.
// @returns {Array} - The sorted array of objects.
function sortByDate(data, dateProperty) {
	return data.sort((a, b) => {
		const dateA = Date.parse(convertDateFormat(a[dateProperty]));
		const dateB = Date.parse(convertDateFormat(b[dateProperty]));
		return dateA - dateB;
	});
}

// Converts a given string to title case, where the first letter of each word is capitalized.
// @param {string} str - The string to be converted to title case.
// @returns {string} - The title-cased string.
function toTitleCase(str) {
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

// @param {*} num
// @returns
function numberToWords(num) {
	const words = [
		"zero",
		"one",
		"two",
		"three",
		"four",
		"five",
		"six",
		"seven",
		"eight",
		"nine",
		"ten",
		"eleven",
		"twelve",
		"thirteen",
		"fourteen",
		"fifteen",
		"sixteen",
		"seventeen",
		"eighteen",
		"nineteen",
	];
	const tens = [
		"",
		"",
		"twenty",
		"thirty",
		"forty",
		"fifty",
		"sixty",
		"seventy",
		"eighty",
		"ninety",
	];

	if (num < 20) return words[num];
	const digit = num % 10;
	if (num < 100)
		return tens[Math.floor(num / 10)] + (digit ? "-" + words[digit] : "");
	return "too many members";
}

// Closes the modal and hides the modal content
// @param {Element} modal - The modal element
// @param {Element} modalContent - The modal content element
function closeModal(modal, modalContent) {
	modal.classList.remove("show");
	modalContent.classList.remove("show");
}

// Formats the location string.
// @param {string} location - The location string to format.
// @returns {string} - The formatted location string.
function formatLocation(location) {
	return location
		.split("-")
		.map((part) =>
			part
				.split("_")
				.map(
					(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
				)
				.join(" ")
		)
		.join(" in ");
}

// Formats the date string into a long date format.
// @param {string} date - The date string to format.
// @returns {string} - The formatted date string.
function formatDate(date) {
	const [day, month, year] = date.split("-");
	return new Date(`${year}-${month}-${day}`).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

// loader
// Returns the HTML markup for a loader animation.
// @returns {string} - HTML string for the loader.
export const loader = () => {
	return `
    <div class="loader-container"> 
      <div class="loader">
        <div class="dot dot-lower"></div>
        <div class="dot dot-middle"></div>
        <div class="dot dot-upper"></div>
      </div>
    </div>
  `;
};

// declare map variables
let geoMap;
const planeIconUrl = "/static/images/airplane.png";
const token =
	"pk.eyJ1IjoiYWRpb3pkYW5pZWwiLCJhIjoiY20yb2Z6OHRzMGZ4djJqczM5Mm9ibWI2YyJ9.tssXEtMnVmkJT9NsswMzvA";

// fetch locations coordinates
async function fetchCoordinates(cityName) {
	const response = await fetch(
		`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
			cityName
		)}.json?access_token=${mapboxgl.accessToken}`
	);
	const data = await response.json();
	if (data.features.length > 0) {
		const coordinates = data.features[0].center;
		return { cityName, coordinates };
	}
	return null;
}

// Function to create Bezier curve points
const bezierCurve = (p1, p2, p3, p4, nPoints) => {
	const points = [];
	for (let t = 0; t <= 1; t += 1 / nPoints) {
		const x = Math.pow(1 - t, 3);
		3;
		3;
		Math.pow(t, 3);
		const y = Math.pow(1 - t, 3);
		3;
		3;
		Math.pow(t, 3);
		points.push([x, y]);
	}
	return points;
};

// Draw curved paths between consecutive locations
const drawCurvedLine = (from, to) => {
	const midPoint = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + 5];
	return bezierCurve(from, midPoint, midPoint, to, 50);
};

const initializeMap = async (data) => {
	geoMap = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/streets-v11",
		center: [-74.5, 40],
		zoom: 2,
	});

	const cityEntries = Object.entries(data.relations.datesLocations);
	const locationsWithCoordinates = await Promise.all(
		cityEntries.map(async ([cityName, dates]) => {
			const locationData = await fetchCoordinates(cityName);
			return locationData
				? dates.map((date) => ({
						date,
						coordinates: locationData.coordinates,
						cityName: locationData.cityName,
					}))
				: [];
		})
	);

	const sortedLocations = locationsWithCoordinates
		.flat()
		.sort(
			(a, b) =>
				new Date(a.date.split("-").reverse().join("-")) -
				new Date(b.date.split("-").reverse().join("-"))
		);

	// Add markers for each location
	sortedLocations.forEach((location) => {
		const popupContent = `<strong>${location.cityName}</strong><br/>Date: ${location.date}`;
		new mapboxgl.Marker({ color: "red" })
			.setLngLat(location.coordinates)
			.setPopup(new mapboxgl.Popup().setHTML(popupContent))
			.addTo(geoMap);
	});

	const features = [];
	for (let i = 0; i < sortedLocations.length - 1; i++) {
		const curve = drawCurvedLine(
			sortedLocations[i].coordinates,
			sortedLocations[i + 1].coordinates
		);
		features.push({
			type: "Feature",
			geometry: {
				type: "LineString",
				coordinates: curve,
			},
			properties: {},
		});
	}

	// Load the curved paths into the geoMap
	geoMap.on("load", () => {
		geoMap.addSource("route", {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: features,
			},
		});

		geoMap.addLayer({
			id: "curved-route",
			type: "line",
			source: "route",
			layout: {
				"line-cap": "round",
				"line-join": "round",
			},
			paint: {
				"line-color": "#888",
				"line-width": 4,
				"line-opacity": 0.8,
			},
		});

		animatePlane(sortedLocations.map((location) => location.coordinates));
	});

	geoMap.addControl(new mapboxgl.NavigationControl());
};

// animate artist movement recursively
const animatePlane = (path) => {
	let index = 0;
	const planeMarker = new mapboxgl.Marker({
		element: createPlaneIcon(planeIconUrl),
	})
		.setLngLat(path[0])
		.addTo(geoMap);

	const movePlane = () => {
		if (index < path.length - 1) {
			const [start, end] = [path[index], path[index + 1]];
			const duration = 3000;
			let startTime = performance.now();

			const animate = (timestamp) => {
				const progress = (timestamp - startTime) / duration;
				if (progress < 1) {
					const interpolated = [
						start[0] + (end[0] - start[0]),
						start[1] + (end[1] - start[1]),
					];
					planeMarker.setLngLat(interpolated);
					requestAnimationFrame(animate);
				} else {
					index++;
					movePlane();
				}
			};
			requestAnimationFrame(animate);
		} else {
			planeMarker.remove();
		}
	};
	movePlane();
};

// creates a plane icon element
const createPlaneIcon = (url) => {
	const img = document.createElement("img");
	img.src = url;
	img.style.width = "40px";
	img.style.height = "auto";
	return img;
};
