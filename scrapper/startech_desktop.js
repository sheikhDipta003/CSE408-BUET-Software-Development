import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'fs';

async function getStartechDesktops(page = 1) {
    try {
        const url = `https://www.startech.com.bd/desktops?page=${page}`;
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);

        // console.log($('.bottom-bar').length);
        console.log(`Page ${page} data successfully parsed`);
        const items = [];
        $('.main-content > .p-item').map((index, element) => {
            const Name = $(element).find('.p-item-inner > .p-item-details > .p-item-name a').text();
            const Price = $(element).find('.p-item-inner > .p-item-details > .p-item-price span').text();

            items.push({
                Name,
                Price
            });
        });

        // Check if there is a next page and recursively call the function
        if ($('.pagination .active').length > 0) {
            const nextPageData = await getStartechDesktops(page + 1);
            items.push(...nextPageData);
        }

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

scrapeAndStoreData();
