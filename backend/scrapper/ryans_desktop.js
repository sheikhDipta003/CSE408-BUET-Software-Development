import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'fs';
import { table } from 'console';

async function getRyansDesktops(page = 1) {
    try {
        const url = `https://www.ryanscomputers.com/category/desktop-pc-brand-desktop-pc?page=${page}`;
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
            // if(Price != "TBA"){
            //     items.push({
            //         Name,
            //         Price,
            //         Attributes: productAttributes
            //     });
            // }
            
        });

        // Check if there is a next page and recursively call the function
        if ($('.pagination .active').length > 0) {
            const nextPageData = await getRyansDesktops(page + 1);
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
    const allDesktopData = await getRyansDesktops();
    
    fs.writeFile('ryans_desktops.json', JSON.stringify(allDesktopData), function (err) {
        if (err) return console.log(err);
        console.log('All data successfully written to ryans_desktops.json');
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

        const Model = $('.table-hr-remove:contains("Model") .col-lg-8 span').text().split(' ').slice(1).join(' ');
        const MPN = $('.table-hr-remove:contains("Part No") .col-lg-8 span').text();
        const Processor = $('.table-hr-remove:contains("Processor Type") .col-lg-8 span').text();
        const RAM = $('.table-hr-remove:contains("RAM") .col-lg-8 span').text();
        const HDD = $('.table-hr-remove:contains("Hard Disk Drive (HDD)") .col-lg-8 span').text();
        const SSD = $('.table-hr-remove:contains("Solid-State Drive (SSD)") .col-lg-8 span').text();
        const Graphics = $('.table-hr-remove:contains("Graphics Chipset") .col-lg-8 span').text();

        items.push({
            Name,
            Price,
            Model,
            MPN,
            Processor,
            RAM,
            HDD,
            SSD,
            Graphics
        });

        return items;
    } catch (error) {
        console.log(`Error fetching product details for URL ${url}: ${error}`);
        return [];
    }
}

scrapeAndStoreData();
