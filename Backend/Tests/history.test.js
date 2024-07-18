require("dotenv").config({ path: ".env.test" });
const request = require("supertest");
const server = require("../server");
const { getUserReportHistory } = require("../routes/history");
const sequelize = require("../sequalize");
const verifyToken = require("../firebase/authMiddleware");

jest.mock("../routes/history");
jest.mock("../firebase/authMiddleware", () =>
jest.fn((req, res, next) => {
  req.user = { uid: "some-user-id" };
  next();
})
);

//Everything required before the tests are ran like db connection
beforeAll(async () => {
//Suppress console logs, this doesn't affect the actual tests but makes the output cleaner since the console logs are throwing errors
jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

//Wait for db connection
await sequelize.authenticate();
});

//Close the db and server connection after tests
afterAll(async () => {
// Restore console logs after tests, basically for the beforeAll console log stuff
console.log.mockRestore();
console.error.mockRestore();

// Close the database connection and the server
await sequelize.close();
server.close();
});

describe("GET /protected/history", () => {
  it("should return list of report history", async () => {
    const mockHistory = [
      {
        description: "Pothole 1",
        dateTime: new Date("2024-01-01T12:00:00Z"),
        is_fixed: true,
        address: "123 Street",
        size: "large",
      },
      {
        description: "Pothole 2",
        dateTime: new Date("2024-01-02T12:00:00Z"),
        is_fixed: false,
        address: "456 Avenue",
        size: "small",
      },
    ];

    getUserReportHistory.create.mockResolvedValue(mockHistory);
    const response = await request(server).get("/protected/history");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        description: "Pothole 1",
        dateTime: new Date("2024-01-01T12:00:00Z"),
        is_fixed: true,
        address: "123 Street",
        size: "large",
      },
      {
        description: "Pothole 2",
        dateTime: new Date("2024-01-02T12:00:00Z"),
        is_fixed: false,
        address: "456 Avenue",
        size: "small",
      },
    ]);
  });

  it("should handle errors when fetching user report history", async () => {
    getUserReportHistory.mockRejectedValue(new Error("Database error"));

    const res = await request(app).get("/protected/history");

    expect(res.status).toBe(500);
    expect(res.text).toBe("Internal Server Error");
  });
});
