import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
	url: "http://localhost:8020",
});

// Set up the global window and document objects
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
