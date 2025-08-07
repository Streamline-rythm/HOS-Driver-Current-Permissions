import pool from './db.js';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const envVarsList = [
    'PORT',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'INSTANCE_CONNECTION_NAME'
]

const missingVars = envVarsList.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
    console.log(
        `❌ missing required environment values: ${missingVars.join(",")}`
    );
    process.exit(1);
}

app.get('/driver/permission', async (req, res) => {
    try {
        const userId = req.query.userId?.trim();

        if (!userId) {
            return res.status(400).json({ error: 'Missing required parameter: userId' });
        }

        const [rows] = await pool.query(
            `SELECT driverId, status, firstName, lastName, phoneNumber, globalDnd, safetyCall, safetyMessage, hosSupport, maintainanceCall, maintainanceMessage, dispatchCall, dispatchMessage, accountCall, accountMessage  
       FROM driversDirectory 
       WHERE telegramId = ?`,
            [userId]
        );

        if (!rows.length) {
            return res.status(404).json({ error: `Driver with userId '${userId}' not found` });
        }

        return res.status(200).json(rows[0]);

    } catch (err) {
        console.error('❌ Error fetching driver data:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/driver/permission/username', async (req, res) => {
    try {
        const username = req.query.username?.trim();

        if (!username) {
            return res.status(400).json({ error: 'Missing required parameter: userId' });
        }

        const firstName = username.trim().split(" ")[0].trim();
        const lastName = username.trim().split(" ")[1].trim();

        console.log("Driver's firstname and lastname are", firstName, lastName);

        const [rows] = await pool.query(
            `SELECT driverId, status, firstName, lastName, phoneNumber, globalDnd, safetyCall, safetyMessage, hosSupport, maintainanceCall, maintainanceMessage, dispatchCall, dispatchMessage, accountCall, accountMessage  
       FROM driversDirectory 
       WHERE firstName = ? And lastName = ?`,
            [firstName, lastName]
        );

        if (!rows.length) {
            return res.status(404).json({ error: `Driver with userId '${userId}' not found` });
        }

        return res.status(200).json(rows[0]);

    } catch (err) {
        console.error('❌ Error fetching driver data:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/driver/permission/driverId', async (req, res) => {
    try {
        const driverId = req.query.driverId?.trim();

        if (!driverId) {
            return res.status(400).json({ error: 'Missing required parameter: driverId' });
        }

        console.log("Driver's driverId is", driverId);

        const [rows] = await pool.query(
            `SELECT driverId, status, firstName, lastName, phoneNumber, globalDnd, safetyCall, safetyMessage, hosSupport, maintainanceCall, maintainanceMessage, dispatchCall, dispatchMessage, accountCall, accountMessage  
       FROM driversDirectory 
       WHERE driverId = ?`,
            [driverId]
        );

        if (!rows.length) {
            return res.status(404).json({ error: `Driver with userId '${driverId}' not found` });
        }

        return res.status(200).json(rows[0]);

    } catch (err) {
        console.error('❌ Error fetching driver data:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));