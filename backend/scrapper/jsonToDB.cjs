const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = 'https://rslcvahskttpbirlaoqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzbGN2YWhza3R0cGJpcmxhb3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYxMDExMjYsImV4cCI6MjAyMTY3NzEyNn0.t4n9De5C1ffBLX618AeiM8SLJClZLQWZOmIiUMwngQw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to read JSON data from file
function readJsonFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', error.message);
    return null;
  }
}

// Function to insert data into a table
async function insertDataIntoTable(tableName, data) {
  try {
    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert(data);

    if (error) {
      throw new Error(`Error inserting data into ${tableName}: ${error.message}`);
    }

    console.log(`Data inserted successfully into ${tableName}:`, insertedData);
  } catch (error) {
    console.error(`Error inserting data into ${tableName}:`, error.message);
  }
}

// Function to process data from JSON file and insert into tables
async function processJsonData(filePath, websiteId, Category, Subcategory) {
  try {
    // Read JSON data from file
    const jsonData = readJsonFromFile(filePath);
    if (!jsonData) return;

    for (const item of jsonData) {
      const productName = item.Name;
      const productModel = item.Attributes.find(attr => attr.name === 'Model').value;
      
      // Check if the product model is present in the product table
      const { data: productData, error: productError } = await supabase
        .from('Products_duplicate')
        .select('productId')
        .eq('model', productModel);

      if (productError) {
        console.error(`Error checking product existence for ${productName}: ${productError.message}`);
        continue;
      }

      let productId = null;

      if (productData && productData.length > 0) {
        // Product exists in the product table, retrieve its productId
        productId = productData[0].productId;

        // Check if the product-website is present in the product website table
        const { data: websiteData, error: websiteError } = await supabase
          .from('ProductWebsites_duplicate')
          .select('pwURL')
          .eq('productId', productId);

        if (websiteError) {
          console.error(`Error checking website existence for ${productName}: ${websiteError.message}`);
          continue;
        }

        let urlExists = false;

        for (const website of websiteData) {
          if (website.pwURL === item.ProductUrl) {
            urlExists = true;
            break;
          }
        }

        if (!urlExists) {
          console.log('Product-website not present, add to ProductWebsite table');
          // Product-website not present, add to ProductWebsite table
          const { data: insertedWebsite, error: websiteInsertError } = await supabase
            .from('ProductWebsites_duplicate')
            .insert([{ productId, pwURL: item.ProductUrl, websiteId }]);

          if (websiteInsertError) {
            console.error(`Error inserting product website for ${productName}: ${websiteInsertError.message}`);
            continue;
          }

          // Iterate through each product to insert specifications
         const formattedDataForProductSpecs = [];
         if (productId !== null) {
           // Exclude 'MPN' and 'Model' attributes from specifications
           if(Subcategory === 'Desktop'){
              if(websiteId === 2) {
                const Processor = item.Attributes.find(attr => attr.name === 'Processor');
                const RAM = item.Attributes.find(attr => attr.name === 'RAM');
                const Storage = item.Attributes.find(attr => attr.name === 'Storage');
                const Motherboard = item.Attributes.find(attr => attr.name === 'Motherboard');
    
                formattedDataForProductSpecs.push({ productId, specName: 'Processor', value: Processor ? Processor.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'RAM', value: RAM ? RAM.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'Storage', value: Storage ? Storage.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'Motherboard', value: Motherboard ? Motherboard.value : '' });
              } else {
                const Processor = item.Attributes.find(attr => attr.name === 'Processor Type');
                const RAM = item.Attributes.find(attr => attr.name === 'RAM');
                const Storage = item.Attributes.find(attr => attr.name === 'Hard Disk Drive (HDD) ');
                const Graphics = item.Attributes.find(attr => attr.name === 'Graphics Chipset');
    
                formattedDataForProductSpecs.push({ productId, specName: 'Processor', value: Processor ? Processor.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'RAM', value: RAM ? RAM.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'Storage', value: Storage ? Storage.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'Graphics', value: Graphics ? Graphics.value : '' });
              }
            } else if(Subcategory === 'Laptop'){
              if (websiteId === 2) {
                const Processor = item.Attributes.find(attr => attr.name === 'Processor Model');
                const RAM = item.Attributes.find(attr => attr.name === 'RAM');
                const Storage = item.Attributes.find(attr => attr.name === 'Storage Type');
                const Graphics = item.Attributes.find(attr => attr.name === 'Graphics Model');
              
                formattedDataForProductSpecs.push({ productId, specName: 'Processor', value: Processor ? Processor.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'RAM', value: RAM ? RAM.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'Storage', value: Storage ? Storage.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'Graphics', value: Graphics ? Graphics.value : '' });
              } else {
                const Processor = item.Attributes.find(attr => attr.name === 'Processor Type');
                const RAM = item.Attributes.find(attr => attr.name === 'RAM');
                const Storage = item.Attributes.find(attr => attr.name === 'Storage');
                const Graphics = item.Attributes.find(attr => attr.name === 'Graphics Chipset');
              
                formattedDataForProductSpecs.push({ productId, specName: 'Processor', value: Processor ? Processor.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'RAM', value: RAM ? RAM.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'Storage', value: Storage ? Storage.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'Graphics', value: Graphics ? Graphics.value : '' });
              }
           } else if(Subcategory === 'Keyboard'){
              if (websiteId === 2) {
                const Interface = item.Attributes.find(attr => attr.name === 'Interface');
                const CableLength = item.Attributes.find(attr => attr.name === 'Cable Length');
                const Dimensions = item.Attributes.find(attr => attr.name === 'Dimensions');
            
                formattedDataForProductSpecs.push({ productId, specName: 'Interface', value: Interface ? Interface.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'Cable Length', value: CableLength ? CableLength.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'Dimensions', value: Dimensions ? Dimensions.value : '' });
              } else {
                const Type = item.Attributes.find(attr => attr.name === 'Type');
                const Interface = item.Attributes.find(attr => attr.name === 'Interface');
                const Dimensions = item.Attributes.find(attr => attr.name === 'Dimensions');
                const CableLength = item.Attributes.find(attr => attr.name === 'Cable Length (Meter)');
            
                formattedDataForProductSpecs.push({ productId, specName: 'Type', value: Type ? Type.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'Interface', value: Interface ? Interface.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'Dimensions', value: Dimensions ? Dimensions.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'Cable Length', value: CableLength ? CableLength.value : '' });
              }          
            } else if(Subcategory === 'Mouse'){
              if (websiteId === 2) {
                const NumberOfKeys = item.Attributes.find(attr => attr.name === 'Number of Keys');
                const ConnectionType = item.Attributes.find(attr => attr.name === 'Connection Type');
                const OpticalSensor = item.Attributes.find(attr => attr.name === 'Optical Sensor');
                const Weight = item.Attributes.find(attr => attr.name === 'Weight');
            
                formattedDataForProductSpecs.push({ productId, specName: 'Number of Keys', value: NumberOfKeys ? NumberOfKeys.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'Connection Type', value: ConnectionType ? ConnectionType.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'Optical Sensor', value: OpticalSensor ? OpticalSensor.value : '' });
                formattedDataForProductSpecs.push({ productId, specName: 'Weight', value: Weight ? Weight.value : '' });
              } else {
              const Type = item.Attributes.find(attr => attr.name === 'Type');
              const Interface = item.Attributes.find(attr => attr.name === 'Interface');
              const Resolution = item.Attributes.find(attr => attr.name === 'Resolution');
              const NumberOfButtons = item.Attributes.find(attr => attr.name === 'Number of Button');
          
              formattedDataForProductSpecs.push({ productId, specName: 'Type', value: Type ? Type.value : '' });
              formattedDataForProductSpecs.push({ productId, specName: 'Interface', value: Interface ? Interface.value : '' });
              formattedDataForProductSpecs.push({ productId, specName: 'Resolution', value: Resolution ? Resolution.value : '' });
              formattedDataForProductSpecs.push({ productId, specName: 'Number of Buttons', value: NumberOfButtons ? NumberOfButtons.value : '' });
             }          
          }
           const { error: specsInsertError } = await supabase
           .from('ProductSpecs_duplicate')
           .insert(formattedDataForProductSpecs);
         }
        }

        // Update product price table
        const { data: updatedPrice, error: priceUpdateError } = await supabase
          .from('ProductPrices_duplicate')
          .upsert([{ pwId: productId, price: item.Price, date: new Date().toISOString().split('T')[0] }]);

        if (priceUpdateError) {
          console.error(`Error updating product price for ${productName}: ${priceUpdateError.message}`);
          continue;
        }   
      } else {
        // Product does not exist in the product table, add to all tables
        console.log('Product does not exist in the product table, add to all tables');
        const mpnAttribute = item.Attributes.find(attr => attr.name === 'MPN' || attr.name === 'Part No');
        const mpnValue = mpnAttribute ? mpnAttribute.value : null;
        // Insert data into 'Products_duplicate' table
        const formattedDataForProduct = {
          productName,
          imagePath: item.ImageUrl,
          model: productModel,
          brand: item.BrandName,
          subcategory: Subcategory,
          category: Category,
          mpn: mpnValue
        };

        const { data: insertedProduct, error: productInsertError } = await supabase
          .from('Products_duplicate')
          .insert([formattedDataForProduct]);
        
        if (productInsertError) {
          console.error(`Error inserting product ${productName}: ${productInsertError.message}`);
          continue;
        }
        
        if (Array.isArray(insertedProduct) && insertedProduct[0] && insertedProduct[0].productId) {
          productId = insertedProduct[0].productId;
        } else {
          console.error('Error: Failed to insert product or retrieve productId:', insertedProduct);
          continue;
        }

        // Insert data into 'ProductWebsite' table
        const { error: websiteInsertError } = await supabase
          .from('ProductWebsites_duplicate')
          .insert([{ productId, pwURL: item.ProductUrl, websiteId }]);

        if (websiteInsertError) {
          console.error(`Error inserting product website for ${productName}: ${websiteInsertError.message}`);
          continue;
        }

        // Insert data into 'ProductPrices_duplicate' table
        const { error: priceInsertError } = await supabase
          .from('ProductPrices_duplicate')
          .insert([{ pwId: productId, price: item.Price, date: new Date().toISOString().split('T')[0] }]);

        if (priceInsertError) {
          console.error(`Error inserting product price for ${productName}: ${priceInsertError.message}`);
          continue;
        } 
      }
      console.log(`Data processed successfully for ${productName}`);
    }
  } catch (error) {
    console.error('Error processing data:', error.message);
  }
}

// Get the absolute file paths
const DesktopjsonFilePathStartech = path.resolve(__dirname, 'startech_desktops.json');
const DesktopjsonFilePathRyans = path.resolve(__dirname, 'ryans_desktops.json');

const LaptopjsonFilePathStartech = path.resolve(__dirname, 'startech_laptops.json');
const LaptopjsonFilePathRyans = path.resolve(__dirname, 'ryans_laptops.json');

const KeyboardjsonFilePathStartech = path.resolve(__dirname, 'startech_keyboards.json');
const KeyboardjsonFilePathRyans = path.resolve(__dirname, 'ryans_keyboards.json');

const MousejsonFilePathStartech = path.resolve(__dirname, 'startech_mice.json');
const MousejsonFilePathRyans = path.resolve(__dirname, 'ryans_mice.json');


// Call the function to insert data from the Startech file
processJsonData(DesktopjsonFilePathStartech, 2, 'Computer', 'Desktop'); // Pass 2 as the websiteId for Startech


// Call the function to insert data from the Ryans file
processJsonData(DesktopjsonFilePathRyans, 3, 'Computer', 'Desktop'); // Pass 3 as the websiteId for Ryans
processJsonData(DesktopjsonFilePathRyans, 3, 'Computer', 'Desktop');

processJsonData(LaptopjsonFilePathStartech, 2, 'Computer', 'Laptop'); // Pass 2 as the websiteId for Startech

processJsonData(LaptopjsonFilePathRyans, 3, 'Computer', 'Laptop'); // Pass 3 as the websiteId for Ryans
processJsonData(LaptopjsonFilePathRyans, 3, 'Computer', 'Laptop');

processJsonData(KeyboardjsonFilePathStartech, 2, 'Accessesories', 'Keyboard'); // Pass 2 as the websiteId for Startech


processJsonData(KeyboardjsonFilePathRyans, 3, 'Accessesories', 'Keyboard'); // Pass 3 as the websiteId for Ryans
processJsonData(KeyboardjsonFilePathRyans, 3, 'Accessesories', 'Keyboard');

processJsonData(MousejsonFilePathStartech, 2, 'Accessesories', 'Mouse'); // Pass 2 as the websiteId for Startech


processJsonData(MousejsonFilePathRyans, 3, 'Accessesories', 'Mouse'); // Pass 3 as the websiteId for Ryans
processJsonData(MousejsonFilePathRyans, 3, 'Accessesories', 'Mouse');

