import { JSDOM } from "jsdom";

const dom = new JSDOM();
global.window = dom.window;
global.document = dom.window.document;

// Mock other browser APIs if needed
global.localStorage = {
	getItem: vi.fn(),
	setItem: vi.fn(),
};
