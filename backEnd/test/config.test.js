require("dotenv").config(); 
const mongoose = require("mongoose");
const ConnectDB = require("../config"); 

describe("Database Connection", () => {
  beforeAll(async () => {
    await ConnectDB();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should connect to MongoDB successfully", () => {
    expect(mongoose.connection.readyState).toBe(1); 
  });
});

describe("Database Connection Failure", () => {
    const originalExit = process.exit;
  
    beforeEach(() => {
      process.exit = jest.fn(); 
    });
  
    afterEach(() => {
      process.exit = originalExit; 
      jest.clearAllMocks();
    });
  
    it("should exit the process if connection fails", async () => {
      jest.spyOn(mongoose, "connect").mockImplementationOnce(() => {
        throw new Error("Connection Failed");
      });
  
      await ConnectDB();
  
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });