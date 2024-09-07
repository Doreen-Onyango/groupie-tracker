// Functions to render different types of data
export const renderAllArtists = (artists) => {
	const container = document.querySelector("#artistsContainer");
	const template = document.getElementById("artistCardTemplate");

	container.innerHTML = "";

	artists.forEach((artist) => {
		const card = template.content.cloneNode(true);

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

		container.appendChild(card);
	});
};

const renderLocations = (locations) => {
	console.log("Rendering locations:", locations);
	// TODO: Update the DOM with locations data
};

const renderDates = (dates) => {
	console.log("Rendering dates:", dates);
	// TODO: Update the DOM with dates data
};

const renderMembers = (members) => {
	console.log("Rendering members:", members);
	// TODO: Update the DOM with members data
};
