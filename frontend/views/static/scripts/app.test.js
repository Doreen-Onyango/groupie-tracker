import { describe, it, expect, beforeEach, vi } from "vitest";
import ArtistApp from "./app";

// instantiate app test
describe("ArtistApp", () => {
	let app;

	beforeEach(() => {
		const services = {
			getAllArtists: vi
				.fn()
				.mockResolvedValue({ data: [{ id: 1, name: "Artist 1" }] }),
			getArtistById: vi.fn().mockResolvedValue({ name: "Artist 1" }),
		};

		app = new ArtistApp(services);
	});

	it("should fetch all artist data", async () => {
		app.artistsData = await app.getAllArtists();

		expect(app.artistsData).toBeDefined();
		expect(app.artistsData.data).toBeDefined();
		expect(app.artistsData.data.length).toBeGreaterThan(0); 
	});
});
