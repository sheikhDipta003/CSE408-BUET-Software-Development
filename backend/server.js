const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require("./models/User");
const Product = require("./models/Product");
const Website = require("./models/Website")
const ProductWebsite = require("./models/ProductWebsite");
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');


require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

async function main(){
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  
    // Synchronize models with the database
    await sequelize.sync({ force: true });
  
    // Start your Express app after successful database connection
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

main();

app.get('/', (request, response) => {
  console.log("in first page");
  return response.status(234).send('Welcome');
})
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
