import { FlightData } from "./Flight";

export async function fetchApi(flightData: FlightData[]){
    try {
        const response = await fetch('http://localhost:8080/api/Voo/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(flightData),
        });
    
        if (response.ok) {
            console.log('Dados enviados com sucesso!');
        } else {
            console.error('Erro ao enviar dados:', response.statusText);
        }
    } catch (error) {
        console.error('Erro na requisição HTTP:', error);
    }
}