// Function to render all artists
export const renderAllArtists = (artists) => {
	const container = document.querySelector("#artistsContainer");
	const template = document.getElementById("artistCardTemplate");

	container.innerHTML = ""; // Clear existing cards

	artists.forEach((artist) => {
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

		card.querySelector(".artist-locations").textContent = artist.locations
			.length
			? artist.locations
			: "No Locations";
		card.querySelector(".artist-concertDates").textContent = artist.concertDates
			.length
			? artist.concertDates
			: "No Concert Dates";
		card.querySelector(".artist-relations").textContent = artist.relations
			.length
			? artist.relations
			: "No Relations";

		container.appendChild(card);
	});
};

export function showModal(artistData) {
	const modal = document.getElementById("artistDetailsModal");
	const artistDetailsSection = document.querySelector("#artistDetails");

	// Clear any existing content
	artistDetailsSection.innerHTML = "";

	// Populate the modal with artist details
	artistDetailsSection.innerHTML = `
		<h2>${artistData.name}</h2>
		<p><strong>Creation Date:</strong> ${artistData.creationDate || "Unknown"}</p>
		<p><strong>First Album:</strong> ${artistData.firstAlbum || "Unknown"}</p>
		<p><strong>Locations:</strong> ${artistData.locations || "No Locations"}</p>
		<p><strong>Concert Dates:</strong> ${
			artistData.concertDates || "No Concert Dates"
		}</p>
		<p><strong>Relations:</strong> ${artistData.relations || "No Relations"}</p>
	`;

	// Show the modal
	modal.style.display = "block";

	// Close the modal when the close button is clicked
	const closeButton = document.querySelector(".close-button");
	closeButton.onclick = function () {
		modal.style.display = "none";
	};

	// Close the modal when clicking outside of it
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	};
}
