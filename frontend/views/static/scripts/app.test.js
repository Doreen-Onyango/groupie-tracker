import { describe, it, expect, vi } from "vitest";
import ArtistApp from "./app.js";
import { getAllArtists, getArtistById, getCoordinates } from "@/helpers.js";

// Mock the helpers module
vi.mock("@/helpers.js", () => ({
	getAllArtists: vi.fn(),
	getArtistById: vi.fn(),
	getCoordinates: vi.fn(),
}));

// fetchAllArtistDetails test
describe("ArtistApp Critical Tests", () => {
	let app;

	beforeEach(() => {
		app = new ArtistApp();
	});

	it("should fetch all artist details correctly", async () => {
		const mockArtists = {
			data: [{ id: 1 }, { id: 2 }],
		};
		const mockArtistDetails = { id: 1, name: "Artist 1" };
		const mockCoordinates = { lat: 0, long: 0 };

		// Mock return values for the helper functions
		getAllArtists.mockResolvedValue(mockArtists);
		getArtistById.mockResolvedValue(mockArtistDetails);
		getCoordinates.mockResolvedValue(mockCoordinates);

		// Execute the function
		const details = await app.fetchAllArtistDetails();

		// Assertions
		expect(details.length).toBe(2);
		expect(details[0]).toHaveProperty("artistData", mockArtistDetails);
		expect(details[0]).toHaveProperty("geoLocations", mockCoordinates);
	});
});

// // searchbyname filter test
// describe('applySearchByNameFilter', () => {
//   it('should filter artists by name', () => {
//     const filteredData = [
//       { name: 'Pink Floyd' },
//       { name: 'Queen' },
//       { name: 'Gorillaz' },
//     ];

//     const result = app.applySearchByNameFilter(filteredData, 'beatles');
//     expect(result.length).toBe(1);
//     expect(result[0].name).toBe('The Beatles');
//   });
// });
