import { describe, it, expect, beforeEach, vi } from "vitest";
import ArtistApp from "./app"; // Adjust the import path as necessary

describe("ArtistApp", () => {
	let app;

	beforeEach(() => {
		// Mock services
		const services = {
			getAllArtists: vi
				.fn()
				.mockResolvedValue({ data: [{ id: 1, name: "Artist 1" }] }),
			getArtistById: vi.fn().mockResolvedValue({ name: "Artist 1" }), // Mocking the getArtistById method
			getCoordinates: vi.fn().mockResolvedValue({ latitude: 0, longitude: 0 }), // Mocking the getCoordinates method
		};

		// Create an instance of ArtistApp
		app = new ArtistApp(services);
	});

	it("should fetch all artist data", async () => {
		// Call the method directly that assigns artistsData
		app.artistsData = await app.getAllArtists();

		// Check if artistsData has data
		expect(app.artistsData).toBeDefined();
		expect(app.artistsData.data).toBeDefined();
		expect(app.artistsData.data.length).toBeGreaterThan(0); // Ensure there is at least one artist
	});
});
