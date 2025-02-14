import fs from 'fs';
import puppeteer, { Page } from 'puppeteer';

import { buildUrl } from './_urlDefiner';  
import { insertFlightData } from './_insert';
import { showMoreButton } from './_showMore';



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

export async function scrapeWithPuppeteer(departureDate: number, originAirport: string, destinationAirport: string) {
    const maxRefreshAttempts = 2;
    let refreshCount = 0;
    const url = buildUrl(departureDate.toString(), '', originAirport, destinationAirport);
    console.log('\x1b[35m', url, '\x1b[0m');

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        const waitForSelectorWithRefresh = async () => {
            while (refreshCount <= maxRefreshAttempts) {
                try {
                    await page.waitForSelector('.select-flight-list-accordion-item.false', { timeout: 30000 });
                    return; 
                } catch (error) {
                    if (refreshCount < maxRefreshAttempts) {
                        console.log(`Seletor não encontrado. Recarregando a página... Tentativa ${refreshCount + 1}/${maxRefreshAttempts}`);
                        await page.reload({ waitUntil: 'domcontentloaded' });
                        refreshCount++;
                    } else {
                        throw new Error(`Seletor não encontrado após ${maxRefreshAttempts} tentativas de refresh.`);
                    }
                }
            }
        };

        await page.goto(url, { waitUntil: 'domcontentloaded' });

        await waitForSelectorWithRefresh();

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

        flightData.forEach(flight => {
            console.log(`${flight.company}, ${flight.seat}, ${flight.date}, ${flight.price}`);
        });

        console.log("    :)    \n\n");
        await browser.close();
    } catch (error) {
        console.error('Erro durante o scraping:', error);
        await browser.close(); 
    }
}