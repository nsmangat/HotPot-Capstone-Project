require("dotenv").config({ path: ".env.test" });
const request = require("supertest");
const server = require("../server");
const Pothole = require("../models/pothole");
const Report = require("../models/report");
const sequelize = require("../sequalize");
const verifyToken = require("../firebase/authMiddleware");

//Setup mocks, mocks for the models so not actually writing to the db
jest.mock("../models/pothole");
jest.mock("../models/report");
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

//Tests for the report endpoint
describe("POST /protected/report", () => {
  //First test to check if new pothole and report made successfully
  it("should create a new pothole and report", async () => {
    const newPothole = {
      pothole_id: 1,
      pothole_size: "medium test",
      description: "Pothole unit test",
      coordinates: "Test coordinates",
      address: "whatever st",
      number_of_reports: 1,
      is_fixed: false,
      first_reported_date: new Date(),
      updated_at: new Date(),
      is_reported: false,
    };

    const newReport = {
      report_id: 1,
      pothole_id: 1,
      firebase_uid: "some-user-id",
      report_date: newPothole.first_reported_date,
    };

    //Making the mocks for the create method of the models to return the new pothole and report
    Pothole.create.mockResolvedValue(newPothole);
    Report.create.mockResolvedValue(newReport);

    //Making a request to the server using this package called supertest, basically just mocking a post request to the /protected/report endpoint
    const response = await request(server)
      .post("/protected/report")
      .send({
        description: "medium test",
        details: "Pothole unit test",
        coordinates: "Test coordinates",
        address: "whatever st",
      })
      .set("Accept", "application/json");

    //Assertions to check if the response is as expected
    expect(response.status).toBe(201);
    expect(response.body).toEqual([
      expect.objectContaining({
        pothole_id: 1,
        pothole_size: "medium test",
        description: "Pothole unit test",
        coordinates: "Test coordinates",
        address: "whatever st",
        number_of_reports: 1,
        is_fixed: false,
        is_reported: false,
      }),
      expect.objectContaining({
        report_id: 1,
        pothole_id: 1,
        firebase_uid: "some-user-id",
      }),
    ]);
  });

  //Second test to check if the response is 500 if there is an error creating the pothole
  it("should return 500 if there is an error creating the pothole", async () => {
    // Mocking the create method of the Pothole model to throw an error
    Pothole.create.mockRejectedValue(new Error("Error creating pothole"));

    const response = await request(server)
      .post("/protected/report")
      .send({
        description: "medium test",
        details: "Pothole unit test",
        coordinates: "Test coordinates",
        address: "whatever st",
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error reporting pothole");
  });

  //Third test check if an existing pothole will get its report count incremented if same pothole address is reported
  it("should increment the report count for an existing pothole", async () => {
    const existingPothole = {
      pothole_id: 1,
      pothole_size: "medium test",
      description: "Pothole unit test",
      coordinates: "Test coordinates",
      address: "whatever st",
      number_of_reports: 1,
      is_fixed: false,
      first_reported_date: new Date(),
      updated_at: new Date(),
      is_reported: false,
      save: jest.fn().mockResolvedValue(true), // Mock save method
    };

    const newReport = {
      report_id: 1,
      pothole_id: 1,
      firebase_uid: "some-user-id",
      report_date: new Date(),
    };

    //Mocking findOne and create methods for an existing pothole and new report
    Pothole.findOne.mockResolvedValue(existingPothole);
    Report.create.mockResolvedValue(newReport);

    const response = await request(server)
      .post("/protected/report")
      .send({
        description: "medium test",
        details: "Pothole unit test",
        coordinates: "Test coordinates",
        address: "whatever st",
      })
      .set("Accept", "application/json");

    //Assertions
    expect(response.status).toBe(200);
    expect(existingPothole.save).toHaveBeenCalled();
    expect(response.body).toEqual([
      expect.objectContaining({
        pothole_id: 1,
        pothole_size: "medium test",
        description: "Pothole unit test",
        coordinates: "Test coordinates",
        address: "whatever st",
        number_of_reports: 2, // Check if the number of reports is incremented
        is_fixed: false,
        is_reported: false,
      }),
      expect.objectContaining({
        report_id: 1,
        pothole_id: 1,
        firebase_uid: "some-user-id",
      }),
    ]);
  });
});
