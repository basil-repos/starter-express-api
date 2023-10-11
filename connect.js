import mysql from "mysql";
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createConnection({
    host: "68.178.147.171",
    user: "saleel",
    password: "saleel@123",
    database: "HOD",
    reconnect: true
});
