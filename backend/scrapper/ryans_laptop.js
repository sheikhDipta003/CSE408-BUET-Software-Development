import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'fs';
import { table } from 'console';

async function getRyansLaptops(page = 1) {
    try {
        const url = `https://www.ryanscomputers.com/category/laptop-all-laptop?page=${page}`;
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);

        // console.log($('.bottom-bar').length);
        console.log(`Page ${page} data successfully parsed`);
        const items = [];
        const promises = $('.cus-col-2').map(async (index, element) => {

            // Get the product url and fetch the product information
            const producturl = $(element).find('.h-100 > .card-body a').attr('href');
            //console.log(producturl);
            const productAttributes = await getproductdetails(producturl);
            
            items.push(...productAttributes);
            
        });

        // Check if there is a next page and recursively call the function
        if ($('.pagination .active').length > 0) {
            const nextPageData = await getRyansLaptops(page + 1);
            items.push(...nextPageData);
        }
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
    const allLaptopData = await getRyansLaptops();
    
    fs.writeFile('ryans_laptops.json', JSON.stringify(allLaptopData), function (err) {
        if (err) return console.log(err);
        console.log('All data successfully written to ryans_laptops.json');
    });
}


// async function getproductdetails(url) {
//     try {
        
//         const response = await fetch(url);
//         const body = await response.text();
//         const $ = cheerio.load(body);

//         const items = [];

//         const Name = $('.product_content > h1').text();
//         const Price = $('meta[itemprop="price"]').attr('content');

//         const Model = $('.table-hr-remove:contains("Model") .col-lg-8 span').text().split(' ').slice(1).join(' ');
//         const MPN = $('.table-hr-remove:contains("Part No") .col-lg-8 span').text();
//         const Processor = $('.table-hr-remove:contains("Processor Type.") .col-lg-8 span').text();
//         const RAM = $('.table-hr-remove:contains("RAM") .col-lg-8 span').text();
//         const Storage = $('.table-hr-remove:contains("Storage") .col-lg-8 span').text();
//         const Graphics = $('.table-hr-remove:contains("Graphics Chipset") .col-lg-8 span').text();

//         items.push({
//             Name,
//             Price,
//             Model,
//             MPN,
//             Processor,
//             RAM,
//             Storage,
//             Graphics
//         });

//         return items;
//     } catch (error) {
//         console.log(`Error fetching product details for URL ${url}: ${error}`);
//         return [];
//     }
// }

async function getproductdetails(url) {
    try {
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);
        
        const items = [];
        const Name = $('.product_content > h1').text();
        const Price = $('meta[itemprop="price"]').attr('content');
        const BrandName = Name.split(' ')[1];

        const attributes = [];
        $('.table-hr-remove').map((index, element) => {
            const name = $(element).find('.col-lg-4 span').text().replace(/\n.*/, '');
            let value = $(element).find('.col-lg-8 span').text();
            
            // Remove the first word from the value if name is "Model"
            if (name === 'Model') {
                const words = value.split(' ');
                if (words.length > 1) {
                    // Remove the first word
                    words.shift();
                    // Join the remaining words back into a string
                    value = words.join(' ');
                }
            }
        
            if (name === 'Part No' || name === 'Processor Type.' || name === 'RAM' || name === 'Storage' || name === 'Graphics Chipset' ) {
                attributes.push({
                    name,
                    value
                });
                // console.log(name + " : " + value + "\n");
            }
        });
        items.push({
            Name,
            Price,
            BrandName,
            Attributes: attributes
        });
        return items;
    } catch (error) {
        console.log(`Error fetching product details for URL ${url}: ${error}`);
        return [];
    }
}

scrapeAndStoreData();
