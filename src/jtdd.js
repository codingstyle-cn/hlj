import { test, expect } from "./core.js";
const fileName = process.argv[2];

const runTest = async (fileName) => {
	global.test = test;
	global.expect = expect;
	await import("../" + fileName);
};

try {
	await runTest(fileName);
	console.log("PASS");
} catch (e) {
	console.log("ERROR");
}
