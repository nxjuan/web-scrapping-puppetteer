import { Pool } from "pg";

export const pool = new Pool({
  user: "usuario",
  host: "localhost", 
  database: "meu_banco",
  password: "senha",
  port: 5432, 
});