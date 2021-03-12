export const test = (name, callback) => {
	callback();
};

const getToBe = (actual) => (expected) => {
	if (actual !== expected) {
		throw new Error("");
	}
};

export const expect = (actual) => {
	return { toBe: getToBe(actual) };
};
