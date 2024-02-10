import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'fs';

async function getStartechOffers() {
    try {
        const url = `https://www.startech.com.bd/information/offer`;
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);   

        // console.log($('.bottom-bar').length);
        console.log(`Offer page successfully parsed`);
        const items = [];
        const promises = $('.offer-content').map(async (index, element) => {
            // Get the offer url and fetch the product information
            const offerurl = $(element).find(' a').attr('href');
            const offerAttributes = await getofferdetails(offerurl);
            //console.log(producturl);
            
            items.push(...offerAttributes);
        });

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
    const allOfferData = await getStartechOffers();
    
    fs.writeFile('startech_offers.json', JSON.stringify(allOfferData), function (err) {
        if (err) return console.log(err);
        console.log('All data successfully written to startech_offers.json');
    });
}


async function getofferdetails(url) {
    try {
        
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);
        //console.log($('.pd-full > .container > .row ').length);

        const attributes = [];
        const Name = $('.body > h1').text();
        // Extracting the date range
        const dateRange = $('.offer-info span:has(i.material-icons:contains("date_range"))').text().trim().replace('date_range', '');
        // Extracting the location information
        const location = $('.offer-info span:has(i.material-icons:contains("store"))').text().trim().replace('store', '');
        // Extracting the 3rd <p> text content
        const p1 = $('.description p').eq(0).text().trim();
        const p2 = $('.description p').eq(1).text().trim();
        const p3 = $('.description p').eq(2).text().trim();

        const description = p1 + p2 + p3;
        //console.log(description);

        if(Name != '' ) {
            attributes.push({
            Name,
            dateRange,
            location,
            description
            });
        }
        
        
        return attributes;
    } catch (error) {
        console.log(`Error fetching product details for URL ${url}: ${error}`);
        return [];
    }
}

scrapeAndStoreData();
