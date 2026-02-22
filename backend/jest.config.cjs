module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests/unit", "<rootDir>/tests/integration"],
  testMatch: ["**/*.test.js"],
  collectCoverageFrom: ["src/**/*.js"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/server.js",
    "/src/config/db.js",
  ],
};
