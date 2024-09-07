const updateHomePage = async (queryParams) => {
	const { error, message, data } = await getAllArtists(queryParams);
	return {
		err: error,
		msg: message,
		data: data,
	};
};

const searchForm = document.querySelector("form");

searchForm.addEventListener("submit", async function (e) {
	e.preventDefault();

	const queryParams = document.getElementById("search").value.trim();
	searchForm.reset();

	updateHomePage(queryParams)
		.then(({ data }) => {
			console.log(data);
		})
		.catch((err) => console.log(err));
});
