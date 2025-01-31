import { scrapeWithPuppeteer } from "./_scrapping";

const oneDayInMillis = 24 * 60 * 60 * 1000; // Milissegundos em um dia

// Defina as datas corretamente
const departureDate = new Date('2025-02-01').getTime(); // Data inicial em milissegundos
const finalDate = new Date('2025-02-10').getTime(); // Data final em milissegundos
const daysIncrement = 1; // Incremento de dias (por exemplo, 7 dias)

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