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

	data.forEach((artist) => {
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
			artist.firstAlbum || "Unknown First Album";
		container.appendChild(card);
	});
};

/**
 * Displays a modal with detailed information about an artist
 * @param {Object} artistData - Contains details about the artist and associated data
 * This function updates the modal's content with the artist's image, name, creation date, first album, members, locations, concert dates, and relations.
 */
export function showModal(artistData) {
	const modal = document.getElementById("artistDetailsModal");
	const artistDetailsSection = document.querySelector("#artistDetails");

	artistDetailsSection.innerHTML = generateArtistDetailsHTML(artistData);

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
 * Generates HTML content for artist details.
 * @param {Object} artistData - Contains details about the artist and associated data
 * @returns {string} - The HTML string to be inserted into the modal
 */
function generateArtistDetailsHTML(artistData) {
	return `
		<div>
			<img src="${artistData.artist.image}" alt="${artistData.artist.name} image" />
			<h2>${artistData.artist.name}</h2>
			<p><strong>Creation Date:</strong> ${
				artistData.artist.creationDate || "Unknown"
			}</p>
			<p><strong>First Album:</strong> ${
				artistData.artist.firstAlbum || "Unknown"
			}</p>
		</div>
		<div>
			<strong>Members:</strong>
			<ul id="artistMembersList">
				${artistData.artist.members.map((member) => `<li>${member}</li>`).join("")}
			</ul>
			<p><strong>Locations:</strong>
				${
					artistData.locations.locations
						.map((location) => {
							let formattedLocation = location
								.split("-")
								.map((part) =>
									part
										.split("_")
										.map(
											(word) =>
												word.charAt(0).toUpperCase() +
												word.slice(1).toLowerCase()
										)
										.join(" ")
								)
								.join(" in ");
							return `<li>${formattedLocation}</li>`;
						})
						.join("") || "<li>Come down. No locations set at the moment</li>"
				}
			</p>

			<p><strong>Concert Dates:</strong></p>
			<ul>
				${
					artistData.concertDates.dates
						.map((date) => {
							const [day, month, year] = date.split("-");
							const longDate = new Date(
								`${year}-${month}-${day}`
							).toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							});
							return `<li>${longDate}</li>`;
						})
						.join("") ||
					"<li>Come down. No concert dates set at the moment</li>"
				}
			</ul>

			<p><strong>Relations:</strong></p>
			<ul>
				${
					Object.entries(artistData.relations.datesLocations)
						.map(([location, dates]) => {
							let formattedLocation = location
								.split("-")
								.map((part) =>
									part
										.split("_")
										.map(
											(word) =>
												word.charAt(0).toUpperCase() +
												word.slice(1).toLowerCase()
										)
										.join(" ")
								)
								.join(" in ");
							return `<li>${formattedLocation}: ${dates
								.map((date) => {
									const [day, month, year] = date.split("-");
									const longDate = new Date(
										`${year}-${month}-${day}`
									).toLocaleDateString("en-US", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									});
									return longDate;
								})
								.join(", ")}</li>`;
						})
						.join("") || "<li>No concert dates set at the moment</li>"
				}
			</ul>
		</div>
	`;
}
