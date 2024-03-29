import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'fs';

async function getStartechMice(page = 1) {
    try {
        const url = `https://www.startech.com.bd/accessories/mouse?page=${page}`;
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);

        console.log(`Page ${page} data successfully parsed`);
        const items = [];
        const promises = $('.main-content > .p-item').map(async (index, element) => {
            const Name = $(element).find('.p-item-inner > .p-item-details > .p-item-name a').text();
            const PriceText = $(element).find('.p-item-inner > .p-item-details > .p-item-price span:first').text();
            const Price = parseFloat(PriceText.replace(/[^\d.৳]/g, '').replace(',', ''));
            const ImageUrl = $(element).find('.p-item-inner > .p-item-img > a > img').attr('src');
            const BrandName = Name.split(' ')[0];

            // Get the product url and fetch the product information
            const ProductUrl = $(element).find('.p-item-inner > .p-item-details > .p-item-name a').attr('href');
            const productAttributes = await getproductdetails(ProductUrl);
            
            if(Price){
                items.push({
                    Name,
                    Price,
                    BrandName,
                    ProductUrl,
                    ImageUrl,
                    Attributes: productAttributes
                });
            }
        });

        // Check if there is a next page and recursively call the function
        // if ($('.pagination .active').length > 0) {
        //     const nextPageData = await getStartechMice(page + 1);
        //     items.push(...nextPageData);
        // }
        // Wait for all promises to resolve
        await Promise.all(promises);
        // console.log(items);
        return items;

    } catch (error) {
        console.log(error);
        return [];
    }
}

async function scrapeAndStoreData() {
    const allMouseData = await getStartechMice();
    
    fs.writeFile('startech_mice.json', JSON.stringify(allMouseData), function (err) {
        if (err) return console.log(err);
        console.log('All data successfully written to startech_mice.json');
    });
}

async function getproductdetails(url) {
    try {
        
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);
        //console.log($('.pd-full > .container > .row ').length);
        
        const MPN = $('.pd-summary ul li:contains("MPN")').text().replace('MPN: ', '');
        const Model = $('.pd-summary ul li:contains("Model")').text().replace('Model: ', '');

        const attributes = [];
        attributes.push({name: 'MPN', value: MPN});
        attributes.push({name: 'Model', value: Model});

        $('.pd-full > .container > .row > .col-lg-9 > .specification-tab > .data-table tbody tr').map((index, element) => {
            const name = $(element).find('td.name').text();
            const value = $(element).find('td.value').text().replace(/\n.*/, '');

            //console.log(name)
            if (name === 'Connection Type' || name === 'Number of Keys' || name === 'Resolution' || name === 'Optical Sensor' || name === 'Weight' ){
                if(name === 'Number of Keys'){
                    const numericValue = value.match(/\d+/);
                    attributes.push({
                        name,
                        value: numericValue ? numericValue[0] : '' // Use the extracted numeric value or an empty string if not found
                    });
                } else {
                    attributes.push({
                        name,
                        value
                    });
                }               
                // console.log(name + " : " + value + "\n");
            }
        });
        // console.log(attributes);
        return attributes;
    } catch (error) {
        console.log(`Error fetching product details for URL ${url}: ${error}`);
        return [];
    }
}

scrapeAndStoreData();
