require("dotenv").config({ path: ".env.test" });
const request = require("supertest");
const server = require("../server");
const Pothole = require("../models/pothole");
const sequelize = require("../sequalize");
const verifyToken = require("../firebase/authMiddleware");
const { getAllPotholes } = require("../routes/MapService");
const Report = require("../models/report");
jest.mock("../models/report");
// Setup mocks
jest.mock("../models/pothole");
jest.mock("../routes/MapService");
jest.mock("../firebase/authMiddleware", () =>
  jest.fn((req, res, next) => {
    req.user = { uid: "some-user-id" };
    next();
  })
);

// Everything required before the tests are run, like DB connection
beforeAll(async () => {
  // Suppress console logs
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});

  // Wait for DB connection
  await sequelize.authenticate();
});

// Close the DB and server connection after tests
afterAll(async () => {
  // Restore console logs after tests
  console.log.mockRestore();
  console.error.mockRestore();

  // Close the database connection and the server
  await sequelize.close();
  server.close();
});

// Tests for the map endpoint
describe("GET /protected/map", () => {
  // First test to check if the potholes are fetched successfully
  it("should return a list of potholes", async () => {
    const mockPotholes = [
        {
            Pothole_ID: 1,
            Size: "Large",
            latitude: 40.712776,
            longitude: -74.005974,
            Address: "123 Main St",
            NumberOfReports: 5,
            FirstReported: "2023-01-01",
            EstimatedFixDate: "2023-02-01",
          },
          {
            Pothole_ID: 2,
            Size: "Small",
            latitude: 34.052235,
            longitude: -118.243683,
            Address: "456 Elm St",
            NumberOfReports: 2,
            FirstReported: "2023-03-01",
            EstimatedFixDate: "2023-04-01",
          },
    ];

    getAllPotholes.mockResolvedValue(mockPotholes);
    //Pothole.findAll.mockResolvedValue(mockPotholes);

    const response = await request(server).get("/protected/map");

    console.log(response.body); 

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        Pothole_ID: 1,
        Size: "Large",
        latitude: 40.712776,
        longitude: -74.005974,
        Address: "123 Main St",
        NumberOfReports: 5,
        FirstReported: "2023-01-01",
        EstimatedFixDate: "2023-02-01",
      },
      {
        Pothole_ID: 2,
        Size: "Small",
        latitude: 34.052235,
        longitude: -118.243683,
        Address: "456 Elm St",
        NumberOfReports: 2,
        FirstReported: "2023-03-01",
        EstimatedFixDate: "2023-04-01",
      },
    ]);
  });

  // Second test to check if the response is 500 if there is an error
  it("should return 500 if there is an error fetching potholes", async () => {
    getAllPotholes.mockRejectedValue(new Error("Database error"));

    const response = await request(server).get("/protected/map");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Internal Server Error");
  });
});
