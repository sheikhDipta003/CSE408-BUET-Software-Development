const express = require("express");
const cors = require("cors");
const path = require("path");
const corsOptions = require("./config/corsOptions");
const sequelize = require("./config/database");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

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
app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/products", require("./routes/api/products"));
app.use(verifyJWT);

app.use("/users", require("./routes/api/users"));
app.use("/admin", require("./routes/api/admin"));
app.use("/collab", require("./routes/api/collab"));
