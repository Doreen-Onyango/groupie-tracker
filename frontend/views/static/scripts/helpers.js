import { renderAllArtists } from "./renders.js";

const determineDataType = (data) => {
	if (data.locations) return "locations";
	if (data.dates) return "dates";
	if (data.members) return "members";
	return "artists";
};

export const handleData = (data) => {
	const dataType = determineDataType(data);

	switch (dataType) {
		case "artists":
			renderAllArtists(data);
			break;
		case "locations":
			renderLocations(data.locations); // Define renderLocations similarly
			break;
		case "dates":
			renderDates(data.dates); // Define renderDates similarly
			break;
		case "members":
			renderMembers(data.members); // Define renderMembers similarly
			break;
		default:
			console.log("Unknown data type");
	}
};

export function showModal(artistData) {
	// Assuming you have a section in your HTML to display artist details
	const artistDetailsSection = document.querySelector("#artistDetails");

	// Clear any existing content
	artistDetailsSection.innerHTML = "";

	// Populate the section with the artist's details
	artistDetailsSection.innerHTML = `
		<h2>${artistData.artist.name}</h2>
		<p><strong>Creation Date:</strong> ${artistData.artist.creationDate}</p>
		<p><strong>First Album:</strong> ${artistData.artist.firstAlbum}</p>
		<p><strong>Locations:</strong> ${artistData.locations.join(", ")}</p>
		<p><strong>Concert Dates:</strong> ${artistData.concertDates.join(", ")}</p>
		<p><strong>Relations:</strong> ${artistData.relations.join(", ")}</p>
	`;
}
