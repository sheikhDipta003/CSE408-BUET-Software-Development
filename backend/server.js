const express = require("express");
const cors = require("cors");
const path = require("path");
const corsOptions = require("./config/corsOptions");
const sequelize = require("./config/database");
// const User = require("./models/User");
// const Product = require("./models/Product");
// const Website = require("./models/Website");
// const ProductWebsite = require("./models/ProductWebsite");
// const Wishlist = require("./models/Wishlist");
// const Notification = require("./models/Notification");
// const Voucher = require("./models/Voucher");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");

require("dotenv").config();

const app = express();
const port = 5000;

async function main() {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully.",
    );

    // Synchronize models with the database
    await sequelize.sync({ force: false });

    // Start your Express app after successful database connection
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main();

app.use(credentials);
app.use(cors(corsOptions));
//app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "/public")));

//app.get('/', (request, response) => {
//  console.log("in first page");
//  return response.status(234).send('Welcome');
//})

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/products", require("./routes/api/products"));
// app.use(verifyJWT);

app.use("/users", require("./routes/api/users"));
app.use("/admin", require("./routes/api/admin"));
app.use("/collab", require("./routes/api/collab"));
