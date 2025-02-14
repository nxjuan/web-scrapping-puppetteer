import { Page } from 'puppeteer';

export async function showMoreButton(page: Page) {
    try {
        while (true) {
            const button = await page.$('#SelectFlightList-ida-more');
            if (!button) return;
            await button.click();
            console.log('botão clicado');
        }
    } catch (error) {
        console.error('\x1b[31mErro ao clicar no botão:\x1b[0m ', error);
    }
}