import { exec } from "child_process";
import { resolve } from "path";

// Path to the Go source files
const goMainPath = resolve("./cmd/server.go");

// Command to run the Go program
const goRunCommand = `go run ${goMainPath}`;

// Execute the Go program
exec(goRunCommand, (error, stdout, stderr) => {
	if (error) {
		console.error(`Error running Go program: ${error.message}`);
		return;
	}
	if (stderr) {
		console.error(`Go stderr: ${stderr}`);
		return;
	}

	console.log("Server successfully fired @localhost:8040");
});
