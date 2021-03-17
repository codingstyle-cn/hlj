const sum = require("./sum");

test("1 plus 1 is not 3", () => {
  expect(sum(1, 1)).not.toBe(3);
});

const can1 = {
  flavor: "grapefruit",
  ounces: 12,
};
const can2 = {
  flavor: "grapefruit",
  ounces: 12,
};

test("have all the same properties", () => {
  expect(can1).toEqual(can2);
});
test("are not the exact same can", () => {
  expect(can1).not.toBe(can2);
});
