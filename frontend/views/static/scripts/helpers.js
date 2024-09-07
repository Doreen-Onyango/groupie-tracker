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
