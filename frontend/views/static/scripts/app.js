import { getAllArtists } from "/static/scripts/getallartists.js";
import { handleData } from "/static/scripts/helpers.js";

document.addEventListener("DOMContentLoaded", async function () {
	try {
		const data = await getAllArtists();
		handleData(data.data);
	} catch (err) {
		console.log(err);
	}
});
