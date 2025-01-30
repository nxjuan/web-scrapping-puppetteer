import fs from 'fs';
import puppeteer, { Page } from 'puppeteer';

import { buildUrl } from './_urlDefiner';  // Importando a função buildUrl
import { fetchApi } from './_fetch';



const oneDayInMillis = 24 * 60 * 60 * 1000;

const finalDate = new Date('2025-01-10').getTime();


const departureDate = '1738681200000';
const returnDate = ''
const originAirport ='GRU'
const destinationAirport = 'MIA'



async function scrapeWithPuppeteer() {

    const url = buildUrl(departureDate, returnDate, originAirport, destinationAirport);
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('.select-flight-list-accordion-item.false');

    const flightData = await page.evaluate(() => {
        const flights: any[] = [];
        const items = document.querySelectorAll('.select-flight-list-accordion-item.false');
        
        //quero que o metodo fique aqui

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
                });
            }
        });

        return flights;
    });

    // Salvar em arquivo
    fs.writeFileSync('output.json', JSON.stringify(flightData, null, 2), 'utf-8');
    
    // Enviar dados para API
    fetchApi(flightData);

    console.log(flightData);
    await browser.close();
}
scrapeWithPuppeteer();




