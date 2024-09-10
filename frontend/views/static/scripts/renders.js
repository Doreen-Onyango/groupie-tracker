/**
 * Renders all artists or displays an error message if there's an issue
 * @param {Object} artistsData - The data object containing artists, message, and error status
 */
export const renderAllArtists = (artistsData) => {
	const { data, message, error } = artistsData;
	const container = document.querySelector("#artistsContainer");
	const template = document.getElementById("artistCardTemplate");

	container.innerHTML = "";

	if (error) {
		container.innerHTML = `
			<div class="error-message">
				<h2>Oops, there is a network issue!</h2>
				<p>${message}</p>
			</div>
		`;
		return;
	}

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
 * This function updates the modal's content with the artist's image, name, creation date, first album, members, locations, concert dates, and relations.
 */
export function showModal(artistData) {
	const { data, message, error } = artistData;
	const modal = document.getElementById("artistDetailsModal");
	const artistDetailsSection = document.querySelector("#artistDetails");

	if (error) {
		artistDetailsSection.innerHTML = `
			<div class="error-message">
				<h2>Oops, there is a network issue!</h2>
				<p>${message}</p>
			</div>
		`;
	} else {
		artistDetailsSection.innerHTML = generateArtistDetailsHTML(data);
	}

	modal.classList.add("show");

	const modalContent = document.querySelector(".modal-content");
	modalContent.classList.add("show");

	const closeButton = document.querySelector(".close-button");
	closeButton.onclick = function () {
		modal.classList.remove("show");
		modalContent.classList.remove("show");
	};

	window.onclick = function (event) {
		if (event.target == modal) {
			modal.classList.remove("show");
			modalContent.classList.remove("show");
		}
	};
}

/**
 * Generates the HTML content for artist details.
 * @param {Object} artist - The artist data to display.
 * @returns {string} - The generated HTML string.
 */
function generateArtistDetailsHTML(data) {
	return `
		<div>
			<img src="${data.artist.image}" alt="${data.artist.name} image" />
			<h2>${data.artist.name}</h2>
			<p><strong>Creation Date:</strong> ${data.artist.creationDate || "Unknown"}</p>
			<p><strong>First Album:</strong> ${
				formatDate(data.artist.firstAlbum) || "Unknown"
			}</p>
		</div>
		<div>
			<strong>Members:</strong>
			<ul id="artistMembersList">
				${data.artist.members.map((member) => `<li>${member}</li>`).join("")}
			</ul>
			<p><strong>Locations:</strong>
				${
					data.locations.locations
						.map((location) => formatLocation(location))
						.join("") || "<li>No locations set at the moment</li>"
				}
			</p>
			<p><strong>Concert Dates:</strong></p>
			<ul>
				${
					data.concertDates.dates.map((date) => formatDate(date)).join("") ||
					"<li>No concert dates set at the moment</li>"
				}
			</ul>
			<p><strong>Relations:</strong></p>
			<ul>
				${
					Object.entries(data.relations.datesLocations)
						.map(([location, dates]) => {
							return `<li>${formatLocation(location)}: ${dates
								.map((date) => formatDate(date))
								.join(", ")}</li>`;
						})
						.join("") || "<li>No relations set at the moment</li>"
				}
			</ul>
		</div>
	`;
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
	const longDate = new Date(`${year}-${month}-${day}`).toLocaleDateString(
		"en-US",
		{
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		}
	);
	return longDate;
}

/**
 * Sorts an array of objects by the 'id' property.
 * @param {Array<Object>} items - The array of objects to be sorted.
 * @returns {Array<Object>} - The sorted array.
 */
function sortById(items) {
	return items.sort((a, b) => a.id - b.id);
}
