import fs from 'fs';
import puppeteer, { Page } from 'puppeteer';

import { buildUrl } from './_urlDefiner';  
import { insertFlightData } from './_insert';
import { showMoreButton } from './_showMore';

const originAirport = 'GRU';
const destinationAirport = 'MIA';

async function extractFlightData(page: Page, departureDate: number) {
    return await page.evaluate((departureDate) => {
        const flights: any[] = [];
        const items = document.querySelectorAll('.select-flight-list-accordion-item.false');
        
        items.forEach((item) => {
            const company = item.querySelector('.company')?.textContent?.trim();
            const seat = item.querySelector('.seat')?.textContent?.trim();
            const departureTime = item.querySelector('.iata-code strong')?.textContent?.trim();
            const arrivalTime = item.querySelectorAll('.iata-code strong')[1]?.textContent?.trim();
            const origin = item.querySelectorAll('.city')[0]?.textContent?.trim();
            const destination = item.querySelectorAll('.city')[1]?.textContent?.trim();
            const duration = item.querySelector('.scale-duration__time')?.textContent?.trim();
            const price = item.querySelector('.miles')?.textContent?.trim();
            const flightType = item.querySelector('.scale-duration__type-flight')?.textContent?.trim();
            
            if (company && price) {
                flights.push({
                    company,
                    seat,
                    departureTime,
                    arrivalTime,
                    origin,
                    destination,
                    duration,
                    price,
                    flightType,
                    date: new Date(departureDate).toISOString()
                });
            }
        });

        return flights;
    }, departureDate);
}

export async function scrapeWithPuppeteer(departureDate: number) {
    try {
        const url = buildUrl(departureDate.toString(), '', originAirport, destinationAirport);
        
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        await page.waitForSelector('.select-flight-list-accordion-item.false');

        let flightData = await extractFlightData(page, departureDate);

        const otherCompaniesButton = await page.$('#SelectFlightHeader-ida-button-congener');
        if (otherCompaniesButton) {
            await otherCompaniesButton.click();
            console.log('Botão "Outras companhias" clicado.');


            const additionalFlightData = await extractFlightData(page, departureDate);
            flightData = flightData.concat(additionalFlightData); 
        } else {
            console.log('Botão "Outras companhias" não encontrado.');
        }

        await showMoreButton(page);

        fs.writeFileSync('output.json', JSON.stringify(flightData, null, 2), 'utf-8');
        
        insertFlightData(flightData);

        console.log(flightData);
        console.log("    :)    ");
        await browser.close();
    } catch (error) {
        console.error('Erro durante o scraping:', error);
    }
}