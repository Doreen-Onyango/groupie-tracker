// Helper function to determine the type of data returned
const determineDataType = (data) => {
	if (data.locations) return "locations";
	if (data.dates) return "dates";
	if (data.members) return "members";
	if (data) return "artists";
};

const handleData = (data) => {
	const dataType = determineDataType(data);

	switch (dataType) {
		case "artists":
			renderAllArtists(data);
			break;
		case "locations":
			renderLocations(data.locations);
			break;
		case "dates":
			renderDates(data.dates);
			break;
		case "members":
			renderMembers(data.members);
			break;
		default:
			console.log("Unknown data type");
	}
};
