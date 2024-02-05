const { Sequelize, DataTypes, Op } = require("sequelize");
const sequelize = require("../config/database");
const fs = require('fs');

//const jsonData = JSON.parse(fs.readFileSync('./startech_desktops.json', 'utf-8'));
const jsonData ={
    "Name": "ASUS ExpertCenter D700MD Core i5 12th Gen Desktop PC",
    "Price": "67,000৳"
};

require("dotenv").config();

const Test = sequelize.define(
    "Test",
    {
        name: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.STRING,
        }
    }
);

async function main() {
    try {
      await sequelize.authenticate();
      console.log(
        "Connection to the database has been established successfully.",
      );
  
      // Synchronize models with the database
      //await Test.sync({ force: false });
  
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  };

  async function insertData() {
    try {
      
      for (const item of jsonData) {
        // const priceString = jsonData.Price;
        // const priceWithoutSymbol = priceString.replace(/[^\d]/g, ''); // Remove non-digit characters
        // const price = parseInt(priceWithoutSymbol, 10); // Convert to integer

        await Test.create({
          name: item.Name,
          price: item.Price,
        });
        //console.log({item});
      }
      
      console.log('Data inserted successfully');
    } catch (error) {
      console.error('Error inserting data:', error);
    } finally {
      // Close the Sequelize connection
      //await sequelize.close();
    }
  }
  // const getProductByQuery = async (req, res) => {
  //   try{
  //     const { keyword, page, limit } = req.params;
  //     const offset = (page-1)*limit;
  
  //     console.log(keyword);
  
  //     const products = await Product.findAll({
  //       where:
  //        {
  //         name: {
  //           //[Op.substring] : keyword,
  //           [Op.iLike]: '%'+keyword+'%',
  //         }
  //       },
  //       // where: sequelize.where(
  //       //   sequelize.fn('lower', sequelize.col('name')), 
  //       //   sequelize.fn('to_tsquery', keyword)
  //       // ),
  //       offset: offset,
  //       limit: limit,
  //     });
  //     res.status(200).json({ products });
  //   }catch(error){
  //     console.error("Error getting products:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // };

  async function getProductByQuery(keyword, page, limit){
    try{
      //const { keyword, page, limit } = req.params;
      const offset = (page-1)*limit;
  
      console.log(keyword);
  
      const products = await Test.findAll({
        where: {
          name: {
            //[Op.substring] : keyword,
            //[Op.iLike]: '%'+keyword+'%',
            [Op.match] : Sequelize.fn('plainto_tsquery', keyword),
          }
        },
        offset: offset,
        limit: limit,
      });
      //res.status(200).json({ products });
      const result = JSON.stringify(products);
      console.log({result});
    }catch(error){
      console.error("Error getting products:", error);
      //res.status(500).json({ error: "Internal server error" });
    }
  };
// const priceString = jsonData.Price;
// const priceWithoutSymbol = priceString.replace(/[^\d]/g, ''); // Remove non-digit characters
// const price = parseInt(priceWithoutSymbol, 10); // Convert to integer

//console.log(price);

main();
//const que = 'Dell CORE i7';
//const queL = que.toLowerCase();
getProductByQuery('core i7', 1, 10);



