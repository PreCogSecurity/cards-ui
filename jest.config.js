module.exports = {
    testEnvironment: "node",
    collectCoverageFrom: ["src/cards.js"],
    coverageThreshold: {
        global: {
            statements: 70,
            branches: 60,
            functions: 70,
            lines: 70
        }
    }
};
