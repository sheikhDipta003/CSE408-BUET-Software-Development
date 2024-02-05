import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'fs';

async function getRyansOffers() {
    try {
        const url = `https://www.ryanscomputers.com/offers`;
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);

        console.log(`Offer page successfully parsed`);
        const items = [];
        const promises = $('.offers').map(async (index, element) => {
            const offerurl = $(element).find('a').attr('href');
            //console.log(offerurl);
            const offerAttributes = await getOfferDetails(offerurl);
            items.push(...offerAttributes);
        });

        await Promise.all(promises);
        return items;

    } catch (error) {
        console.log(error);
        return [];
    }
}

async function scrapeAndStoreData() {
    const allOfferData = await getRyansOffers();
    
    fs.writeFile('ryans_offers.json', JSON.stringify(allOfferData), function (err) {
        if (err) return console.log(err);
        console.log('All data successfully written to ryans_offers.json');
    });
}

async function getOfferDetails(url) {
    try {
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);

        const attributes = [];
        const title = $('h1').text().replace(/\(.*/, '').trim();
        const image = $('.col-12 img').attr('src');
        // console.log(image);

        if (title !== '') {
            attributes.push({
                title,
                image,
                url
            });
        }

        return attributes;
    } catch (error) {
        console.log(`Error fetching product details for URL ${url}: ${error}`);
        return [];
    }
}

scrapeAndStoreData();
