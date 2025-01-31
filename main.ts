import { scrapeWithPuppeteer } from "./_scrapping";

const oneDayInMillis = 24 * 60 * 60 * 1000; 

const departureDate = new Date('2025-02-03').getTime(); 
const finalDate = new Date('2025-02-07').getTime(); 
const daysIncrement = 1; 

async function runScrapingLoop() {
    let currentDate = departureDate; 

    while (currentDate <= finalDate) {
        console.log(`Scraping for date: ${new Date(currentDate).toISOString()}`); 
        await scrapeWithPuppeteer(currentDate);
        currentDate += daysIncrement * oneDayInMillis; 
    }
    console.log('Scraping finished. Final date reached.'); 
}


if (departureDate > finalDate) {
    console.error('Error: departureDate is greater than finalDate. Please check the dates.');
} else {
    runScrapingLoop();
}