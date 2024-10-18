import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		include: ["views/static/scripts/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
		exclude: [
			"**/node_modules/**",
			"**/.{idea,git,cache,output,temp}/**",
			"**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
		],
		setupFiles: ["./setupTests.js"],
	},
	resolve: {
		alias: {
			"@": "/views/static/scripts",
		},
	},
});
