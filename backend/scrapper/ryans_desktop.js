import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'fs';

async function getRyansDesktops(page = 1) {
    try {
        const url = `https://www.ryanscomputers.com/category/desktop-pc-brand-desktop-pc?page=${page}`;
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);

        console.log(`Page ${page} data successfully parsed`);
        const items = [];
        const promises = $('.cus-col-2').map(async (index, element) => {
            const producturl = $(element).find('.h-100 > .card-body a').attr('href');
            const productAttributes = await getproductdetails(producturl);
            items.push(...productAttributes);
        });

        // if ($('.pagination .active').length > 0) {
        //     const nextPageData = await getRyansDesktops(page + 1);
        //     items.push(...nextPageData);
        // }

        await Promise.all(promises);
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
        const PriceText = $('meta[itemprop="price"]').attr('content');
        const Price = parseFloat(PriceText.replace(/[^\d.৳]/g, '').replace(',', ''));
        const ProductUrl = url;
        const ImageUrl = $('.product-info-section img').attr('src');
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
        
            if (name === 'Part No' || name === 'Model' || name === 'Processor Type' || name === 'RAM' || name === 'Hard Disk Drive (HDD)' || name === 'Solid-State Drive (SSD)' || name === 'Graphics Chipset' || name === 'Display Size (Inch)') {
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
            ProductUrl,
            ImageUrl,
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
