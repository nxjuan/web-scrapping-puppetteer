import { Page } from 'puppeteer';

export async function showMoreButton(page: Page) {
    try {
        while (true) {
            const button = await page.$('#SelectFlightList-ida-more');
            if (!button) return;
            await button.click();
            console.log('botão clicado')
        }
    } catch (error) {
        console.error('Erro ao clicar no botão:', error);
    }
}