import fs from 'fs';
import puppeteer, { Page } from 'puppeteer';

import { buildUrl } from './_urlDefiner';  
import { fetchApi } from './_fetch';

const oneDayInMillis = 24 * 60 * 60 * 1000; // Milissegundos em um dia

// Defina as datas corretamente
const departureDate = new Date('2025-02-01').getTime(); // Data inicial em milissegundos
const finalDate = new Date('2025-02-10').getTime(); // Data final em milissegundos
const daysIncrement = 1; // Incremento de dias (por exemplo, 7 dias)

const originAirport = 'GRU';
const destinationAirport = 'MIA';

async function scrapeWithPuppeteer(departureDate: number) {
    const url = buildUrl(departureDate.toString(), '', originAirport, destinationAirport);
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('.select-flight-list-accordion-item.false');

    const flightData = await page.evaluate(() => {
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

async function runScrapingLoop() {
    let currentDate = departureDate; // Usamos uma variável separada para controlar a data atual

    while (currentDate <= finalDate) {
        console.log(`Scraping for date: ${new Date(currentDate).toISOString()}`); // Log para depuração
        await scrapeWithPuppeteer(currentDate);
        currentDate += daysIncrement * oneDayInMillis; // Incrementa a data atual
    }
    console.log('Scraping finished. Final date reached.'); // Log para depuração
}

// Verifica se a data inicial é válida
if (departureDate > finalDate) {
    console.error('Error: departureDate is greater than finalDate. Please check the dates.');
} else {
    runScrapingLoop();
}