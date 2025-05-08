const mongoose = require("mongoose");
require("dotenv").config();
async function ConnectDB() {
  try {
    await mongoose.connect(
      process.env.URL.replace("<db_password>", process.env.db_password).replace(
        "${DB_NAME}",
        process.env.DB_NAME
      )
    );
    console.log(`connect to DB 😁 on ${process.env.DB_NAME}`);
  } catch (error) {
    // console.log(error);
    process.exit(1);
  }
}
module.exports = ConnectDB;
