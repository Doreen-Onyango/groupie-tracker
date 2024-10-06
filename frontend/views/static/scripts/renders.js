/**
 * Renders all artists or displays an error message if there's an issue
 * @param {Object} artistsData - The data object containing artists, message, and error status
 */
export const renderAllArtists = ({ data, message, error }, sortById) => {
	const container = document.querySelector("#artistsContainer");
	const template = document.getElementById("artistCardTemplate");

	container.innerHTML = error
		? `<div class="error-message">
				<h2>Oops, there is a network issue!</h2>
				<p>${message}</p>
			</div>`
		: "";

	if (error) return;

	const sortedArtistData = sortById(data);

	sortedArtistData.forEach((artist) => {
		const card = template.content.cloneNode(true);

		const artistCard = card.querySelector(".artist-card");
		artistCard.setAttribute("data-artist-id", artist.id);

		card.querySelector(".artist-name").textContent = artist.name;

		const image = card.querySelector(".artist-image");
		image.src = artist.image;
		image.alt = `${artist.name} image`;

		const membersList = card.querySelector(".artist-members");
		artist.members.forEach((member) => {
			const li = document.createElement("li");
			li.textContent = member;
			membersList.appendChild(li);
		});

		card.querySelector(".artist-creationDate").textContent =
			artist.creationDate || "Unknown Creation Date";
		card.querySelector(".artist-firstAlbum").textContent =
			formatDate(artist.firstAlbum) || "Unknown First Album";

		container.appendChild(card);
	});
};

/**
 * Displays a modal with detailed information about an artist
 * @param {Object} artistData - Contains details about the artist and associated data
 */
export function showModal(artistData) {
	const { data, message, error } = artistData;
	const modal = document.getElementById("artistDetailsModal");
	const artistDetailsSection = document.querySelector("#artistDetails");

	// Extract geoLocations directly from data (assuming it's inside the data object)
	const geoLocations = artistData.geoLocations.data || [];

	setTimeout(() => {
		initMap(geoLocations);
	}, 300);

	// Handle error state
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

/**
 * Generates the HTML content for artist details.
 * @param {Object} data - The artist data including artist, locations, concertDates, relations, geoLocations.
 * @param {Array} geoLocations - The geolocation data associated with the artist.
 * @returns {string} - The generated HTML string.
 */
function generateArtistDetailsHTML(data) {
	const { artist, locations, concertDates, relations } = data;

	return `
		<div class="artist-info">
			<img src="${artist.image}" alt="${artist.name}" class="artist-image"/>
			<h2>${artist.name}</h2>
			<p><strong>Creation Date:</strong> ${artist.creationDate || "Unknown"}</p>
			<p><strong>First Album:</strong> ${
				formatDate(artist.firstAlbum) || "Unknown"
			}</p>
		</div>
		<div class="artist-details">
			<strong>Members:</strong>
			<ul id="artistMembersList">
				${artist.members.map((member) => `<li>${member}</li>`).join("")}
			</ul>

			<p><strong>Locations:</strong></p>
			<ul>
				${
					locations.locations.length
						? locations.locations.map(formatLocation).join(", ")
						: "<li>No locations set at the moment</li>"
				}
			</ul>

			<p><strong>Concert Dates:</strong></p>
			<ul>
				${
					concertDates.dates.length
						? concertDates.dates.map(formatDate).join(", ")
						: "<li>No concert dates set at the moment</li>"
				}
			</ul>

			<p><strong>Relations:</strong></p>
			<ul>
				${
					Object.entries(relations.datesLocations).length
						? Object.entries(relations.datesLocations)
								.map(
									([location, dates]) =>
										`<li>${formatLocation(location)}: ${dates
											.map(formatDate)
											.join(", ")}</li>`
								)
								.join("")
						: "<li>No relations set at the moment</li>"
				}
			</ul>

			<p><strong>GeoLocations:</strong></p>
			<div id="map" style="width: 100%; height: 400px;"></div>`;
}

function initMap(geoLocations) {
	// Set the center of the map to the first location or default to (0,0)
	const mapCenter =
		geoLocations.length > 0
			? { lat: geoLocations[0].latitude, lng: geoLocations[0].longitude }
			: { lat: 0, lng: 0 };

	// Initialize the map and attach it to the 'map' element
	const map = new google.maps.Map(document.getElementById("map"), {
		zoom: 4,
		center: mapCenter,
	});

	// Add markers for each location
	const markers = geoLocations.map((location) => {
		return new google.maps.Marker({
			position: { lat: location.latitude, lng: location.longitude },
			map: map,
			title: location.location,
		});
	});

	// Create the path for the polyline based on locations
	const pathCoordinates = geoLocations.map((location) => ({
		lat: location.latitude,
		lng: location.longitude,
	}));

	// Check if the pathCoordinates array has enough data to draw the polyline
	if (pathCoordinates.length > 1) {
		// Create and set the polyline on the map
		const artistPath = new google.maps.Polyline({
			path: pathCoordinates,
			geodesic: true,
			strokeColor: "#FF6347",
			strokeOpacity: 1.0,
			strokeWeight: 2,
		});

		// Display the polyline on the map
		artistPath.setMap(map);
	}
}

/**
 * Closes the modal and hides the modal content
 * @param {Element} modal - The modal element
 * @param {Element} modalContent - The modal content element
 */
function closeModal(modal, modalContent) {
	modal.classList.remove("show");
	modalContent.classList.remove("show");
}

/**
 * Formats the location string.
 * @param {string} location - The location string to format.
 * @returns {string} - The formatted location string.
 */
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

/**
 * Formats the date string into a long date format.
 * @param {string} date - The date string to format.
 * @returns {string} - The formatted date string.
 */
function formatDate(date) {
	const [day, month, year] = date.split("-");
	return new Date(`${year}-${month}-${day}`).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
