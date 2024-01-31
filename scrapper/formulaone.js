import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'fs';

async function getFormulaOneDrivers() {
    try {
        
        const response = await fetch('https://www.formula1.com/en/drivers.html');
        const body = await response.text();
        const $ = cheerio.load(body);

        // console.log($('.listing-items--wrapper').length);

        const items = [];
        $('.listing-items--wrapper > .row > .col-12').map((index, element) => {

            //const rank = $(element).find('.rank').text();
            //const points = $(element).find('.points > f1-wide--s').text();
            const FirstName = $(element).find('.listing-item--name span:first').text();
            const LastName = $(element).find('.listing-item--name span:last').text();
            const team = $(element).find('.listing-item--team').text();
            const photo = $(element).find('.listing-item--photo img').attr('data-src');
            
            items.push({
                FirstName,
                LastName,
                team,
                photo
            });
        });

        fs.writeFile('formulaOneDrivers.json', JSON.stringify(items), function(err){
            if (err) return console.log(err);
            console.log('File successfully written');
        });

    } catch (error) {
        console.log(error);
    }
}

getFormulaOneDrivers();