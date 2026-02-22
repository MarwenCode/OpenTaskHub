module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/tests/unit", "<rootDir>/tests/integration"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup/setupTests.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^.+\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/tests/setup/fileMock.ts",
  },
  testMatch: ["**/*.test.ts", "**/*.test.tsx", "**/*.test.js", "**/*.test.jsx"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
};
