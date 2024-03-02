const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = 'https://rslcvahskttpbirlaoqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzbGN2YWhza3R0cGJpcmxhb3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYxMDExMjYsImV4cCI6MjAyMTY3NzEyNn0.t4n9De5C1ffBLX618AeiM8SLJClZLQWZOmIiUMwngQw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to delete all existing data from the table
// Function to delete all existing data from the table
async function deleteAllDataFromTable(tableName) {
  try {
    // Fetch all primary keys
    const { data: allData, error: selectError } = await supabase
      .from(tableName)
      .select('productId');

    if (selectError) {
      throw new Error(`Error fetching primary keys: ${selectError.message}`);
    }

    // Delete each row individually
    for (const row of allData) {
      const { error: deleteError } = await supabase
        .from('Products_duplicate')
        .delete()
        .eq('productId', row.productId); // Delete row by primary key

      if (deleteError) {
        throw new Error(`Error deleting row with ID ${row.productId}: ${deleteError.message}`);
      }
    }

    console.log('All existing data deleted successfully.');
  } catch (error) {
    console.error('Error deleting existing data:', error.message);
  }
}


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

// Function to retrieve productId from the database based on product details
async function getProductIDFromDatabase(item) {
  // Perform a database query to find the productId based on product details
  // Example: Query the database to find the productId for a product with the same name and brand
  // Replace this with your actual database query logic
  const productName = item.Name;
  
  const brand = item.BrandName;

  // Example query using Supabase client
  const { data, error } = await supabase
    .from('Products_duplicate')
    .select('productId')
    .eq('productName', productName); // Assuming the query returns a single result

  if (error) {
    console.error('Error fetching productId from database:', error.message);
    return null;
  }

  if (!data) {
    console.error('Product not found in the database.');
    return null;
  }

  return data[0].productId;
}


// Get the absolute file path
const jsonFileName = 'startech_desktops.json';
const jsonFilePath = path.resolve(__dirname, jsonFileName);

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


// Main function to insert data into all tables
async function insertDataIntoAllTables() {
  try {
    // Read JSON data from file
    const jsonData = readJsonFromFile(jsonFilePath);
    if (!jsonData) return;

    // Delete existing data from all tables
    await deleteAllDataFromTable('Products_duplicate');
    await deleteAllDataFromTable('ProductPrices_duplicate');
    await deleteAllDataFromTable('ProductSpecs_duplicate');
    // Add more delete statements for other tables if needed

    // Format data for each table
    const formattedDataForProductsDuplicate = jsonData.map(item => ({
      productName: item.Name,
      imagePath: item.ImageUrl,
      model: item.Attributes.find(attr => attr.name === 'Model').value,
      brand: item.BrandName,
      subcategory: 'desktop',
      category: 'computer',
      mpn: item.Attributes.find(attr => attr.name === 'MPN').value
    }));

    await insertDataIntoTable('Products_duplicate', formattedDataForProductsDuplicate);
    // Format data for 'ProductPrices_duplicate' table
    const formattedDataForProductPrices = [];
    for (const item of jsonData) {
      const productId = await getProductIDFromDatabase(item); // Wait for productId retrieval
      
      if (productId !== null) {
        const price = item.Price;        
        const currentDate = new Date().toISOString().split('T')[0]; // Current date
        formattedDataForProductPrices.push({ pwId: productId, price, date: currentDate });        
      } else {
        console.error('ProductId not found for item:', item.Name);
      }
    }

    // Insert data into 'ProductPrices_duplicate' table
    await insertDataIntoTable('ProductPrices_duplicate', formattedDataForProductPrices);

    // Iterate through each product to insert specifications
    const formattedDataForProductSpecs = [];
    for (const item of jsonData) {
      const productId = await getProductIDFromDatabase(item);
      if (productId !== null) {
        // Exclude 'MPN' and 'Model' attributes from specifications
        const Processor = item.Attributes.find(attr => attr.name === 'Processor');
        const RAM = item.Attributes.find(attr => attr.name === 'RAM');
        const Storage = item.Attributes.find(attr => attr.name === 'Storage');
        const Motherboard = item.Attributes.find(attr => attr.name === 'Motherboard');
       
        formattedDataForProductSpecs.push({ productId, specName: 'Processor', value: Processor ? Processor.value : '' });
        formattedDataForProductSpecs.push({ productId, specName: 'RAM', value: RAM ? RAM.value : '' });
        formattedDataForProductSpecs.push({ productId, specName: 'Storage', value: Storage ? Storage.value : '' });
        formattedDataForProductSpecs.push({ productId, specName: 'Motherboard', value: Motherboard ? Motherboard.value : '' });
      }
    }
    await insertDataIntoTable('ProductSpecs_duplicate', formattedDataForProductSpecs);

  } catch (error) {
    console.error('Error inserting data into tables:', error.message);
  }
}

// Call the main function to insert data into all tables
insertDataIntoAllTables();
