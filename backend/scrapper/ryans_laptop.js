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


async function getproductdetails(url) {
    try {
        
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);
        
        const items = [];
        const Name = $('.product_content > h1').text();
        const Price = $('meta[itemprop="price"]').attr('content');
        //console.log(Name + " : " + Price + "\n");
        
        const attributes = [];
        $('.table-hr-remove').map((index, element) => {
            const name = $(element).find('.col-lg-4 span').text().replace(/\n.*/, '');
            const value = $(element).find('.col-lg-8 span').text();
           
            //console.log(name + " : " + value + "\n"); 
            if (name === 'Part No' || name === 'Processor Type.' || name === 'RAM' || name === 'Storage' || name === 'Graphics Chipset' || name === 'Display Size (Inch)'){
                attributes.push({
                    name,
                    value
                });
                // console.log(name + " : " + value + "\n");
            }
        });
        // console.log(attributes);
        items.push({
            Name,
            Price,
            Attributes: attributes
        });

        return items;
    } catch (error) {
        console.log(`Error fetching product details for URL ${url}: ${error}`);
        return [];
    }
}

scrapeAndStoreData();
