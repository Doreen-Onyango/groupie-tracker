// Functions to render different types of data
const renderAllArtists = (artists) => {
	const tableBody = document.querySelector("#artistsTable tbody");
	tableBody.innerHTML = ""; // Clear the table body

	artists.forEach((artist) => {
		const row = document.createElement("tr");

		const nameCell = document.createElement("td");
		nameCell.textContent = artist.name;

		const imageCell = document.createElement("td");
		const img = document.createElement("img");
		img.src = artist.image;
		img.alt = `${artist.name} image`;
		img.width = 100;
		imageCell.appendChild(img);

		const membersCell = document.createElement("td");
		const ul = document.createElement("ul");
		artist.members.forEach((member) => {
			const li = document.createElement("li");
			li.textContent = member;
			ul.appendChild(li);
		});
		membersCell.appendChild(ul);

		row.appendChild(nameCell);
		row.appendChild(imageCell);
		row.appendChild(membersCell);

		tableBody.appendChild(row);
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
