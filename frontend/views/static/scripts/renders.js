// Function to render all artists
export const renderAllArtists = (artists) => {
	const container = document.querySelector("#artistsContainer");
	const template = document.getElementById("artistCardTemplate");

	container.innerHTML = ""; // Clear existing cards

	artists.forEach((artist) => {
		const card = template.content.cloneNode(true);

		card
			.querySelector(".artist-card")
			.setAttribute("data-artist-id", artist.id);

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

export function showModal(artistData) {
	const artistDetailsSection = document.querySelector("#artistDetails");
	artistDetailsSection.innerHTML = "";
	artistDetailsSection.innerHTML = `
		<h2>${artistData.artist.name}</h2>
		<p><strong>Creation Date:</strong> ${artistData.artist.creationDate}</p>
		<p><strong>First Album:</strong> ${artistData.artist.firstAlbum}</p>
		<p><strong>Locations:</strong> ${artistData.locations.join(", ")}</p>
		<p><strong>Concert Dates:</strong> ${artistData.concertDates.join(", ")}</p>
		<p><strong>Relations:</strong> ${artistData.relations.join(", ")}</p>
	`;
}
