const { Sequelize } = require('sequelize');

require('dotenv').config();

// const sequelize = new Sequelize(process.env.KB_URL, {
//     //host: process.env.DARABASE_HOST,
//     //dialect: 'postgres',
//     dialectOptions: {
//      ssl: { sslmode: 'true', rejectUnauthorized: false },
//     },
//     //logging: false,
//   });

  const sequelize = new Sequelize('postgres', process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'postgres',
    port: process.env.PORT,
    //logging: false,
  });


module.exports = sequelize;
