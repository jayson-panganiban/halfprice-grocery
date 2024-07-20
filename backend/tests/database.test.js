const mongoose = require("mongoose");
const connectDB = require("../src/config/database");

describe("Database Connection", () => {
  jest.setTimeout(30000);
  beforeAll(async () => {
    try {
      await connectDB();
    } catch (error) {
      console.error("Failed to connect to the database:", error);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should connect to the database", () => {
    console.log("MongoDB connection state:", mongoose.connection.readyState);
    expect(mongoose.connection.readyState).toBe(1);
  });
});
