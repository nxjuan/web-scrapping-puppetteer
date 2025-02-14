import { Page } from 'puppeteer';

export async function clickOtherCompaniesButton(page: Page) {
    try {
        
        const otherCompaniesButton = await page.$('#SelectFlightHeader-ida-button-congener');
        if (otherCompaniesButton) {
            
            const isEnabled = await page.evaluate((button) => {
                return button.classList.contains('enabled'); 
            }, otherCompaniesButton);

            if (isEnabled) {
                await otherCompaniesButton.click();
                console.log('Botão "Outras companhias" clicado.');
            } else {
                console.log('Botão "Outras companhias" está desabilitado.');
            }
        } else {
            console.log('Botão "Outras companhias" não encontrado.');
        }
    } catch (error) {
        console.error('\x1b[31mErro ao interagir com o botão "Outras companhias":\x1b[0m', error);


    }
}