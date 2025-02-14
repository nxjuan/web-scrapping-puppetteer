import { Cluster } from 'puppeteer-cluster';
import { scrapeWithPuppeteer } from './_scrapping';

const oneDayInMillis = 24 * 60 * 60 * 1000;

const departureDate = new Date('2025-02-17').getTime();
const finalDate = new Date('2025-02-22').getTime();
const daysIncrement = 1;

const originAirport = 'GRU';
const destinationAirport = 'MIA';

if (departureDate > finalDate) {
    console.error('Error: departureDate is greater than finalDate. Please check the dates.');
    process.exit(1); 
}

(async () => {

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_BROWSER, 
        maxConcurrency: 4, 
        puppeteerOptions: { headless: true }, 
    });
    await cluster.task(async ({ page, data: date }) => {
        console.log(`Iniciando scraping para a data: \x1b[34m${new Date(date).toISOString()}\x1b[0m`);
        await scrapeWithPuppeteer(date, originAirport, destinationAirport);
        console.log(`Scraping concluído para a data: \x1b[32m${new Date(date).toISOString()}\x1b[0m`);
    });
    let currentDate = departureDate;
    while (currentDate <= finalDate) {
        cluster.queue(currentDate); 
        currentDate += daysIncrement * oneDayInMillis;
    }
    await cluster.idle();
    await cluster.close();

    console.log('Scraping finalizado para todas as datas.');
})();