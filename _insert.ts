import { FlightData } from "./Flight";
import { pool } from "./db";

export async function insertFlightData(flightData: FlightData[]) {
    const query = `
        INSERT INTO Voos (company, seat, departureTime, arrivalTime, origin, destination, duration, price, flightType, date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    try {
        for (const flight of flightData) {
            const values = [
                flight.company,
                flight.seat,
                flight.departureTime,
                flight.arrivalTime,
                flight.origin,
                flight.destination,
                flight.duration,
                flight.price,
                flight.flightType,
                flight.date,
            ];
            await pool.query(query, values);
        }

        console.log("Dados inseridos no banco com sucesso!");
    } catch (error) {
        console.error("Erro ao inserir dados no banco:", error);
    }
}