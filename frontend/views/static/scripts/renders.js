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

	artistDetailsSection.innerHTML = "";

	artistDetailsSection.innerHTML = `
		<div>
			<img src="${artistData.image}" alt="${artistData.name} image" />
			<h2>${artistData.name}</h2>
			<p><strong>Creation Date:</strong> ${artistData.creationDate || "Unknown"}</p>
			<p><strong>First Album:</strong> ${artistData.firstAlbum || "Unknown"}</p>
		</div>
		<div>
			<strong>Members:</strong>
			<ul id="artistMembersList">
				${artistData.members.map((member) => `<li>${member}</li>`).join("")}
			</ul>
			<p><strong>Locations:</strong> ${artistData.locations || "No Locations"}</p>
			<p><strong>Concert Dates:</strong> 
				${artistData.concertDates || "No Concert Dates"}
			</p>
			<p><strong>Relations:</strong> ${artistData.relations || "No Relations"}</p>
		</div>
	`;

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
