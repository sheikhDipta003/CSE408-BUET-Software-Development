import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'fs';
import { table } from 'console';

async function getStartechDesktops(page = 1) {
    try {
        const url = `https://www.startech.com.bd/desktops?page=${page}`;
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);

        // console.log($('.bottom-bar').length);
        console.log(`Page ${page} data successfully parsed`);
        const items = [];
        const promises = $('.main-content > .p-item').map(async (index, element) => {
            const Name = $(element).find('.p-item-inner > .p-item-details > .p-item-name a').text();
            const Price = $(element).find('.p-item-inner > .p-item-details > .p-item-price span').text();

            // Get the product url and fetch the product information
            const producturl = $(element).find('.p-item-inner > .p-item-details > .p-item-name a').attr('href');
            const productAttributes = await getproductdetails(producturl);
            
            items.push({
                Name,
                Price,
                Attributes: productAttributes
            });
        });

        // Check if there is a next page and recursively call the function
        if ($('.pagination .active').length > 0) {
            const nextPageData = await getStartechDesktops(page + 1);
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
    const allDesktopData = await getStartechDesktops();
    
    fs.writeFile('startech_desktops.json', JSON.stringify(allDesktopData), function (err) {
        if (err) return console.log(err);
        console.log('All data successfully written to startech_desktops.json');
    });
}


async function getproductdetails(url) {
    try {
        
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);
        //console.log($('.pd-full > .container > .row ').length);

        const attributes = [];
        $('.pd-full > .container > .row > .col-lg-9 > .specification-tab > .data-table tbody tr').map((index, element) => {
            const name = $(element).find('td.name').text();
            const value = $(element).find('td.value').text().replace(/\n.*/, '');

            //console.log(name)
            if (name === 'Processor' || name === 'Motherboard' || name === 'RAM' || name === 'Storage' || name === 'Graphics' ){
                attributes.push({
                    name,
                    value
                });
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
