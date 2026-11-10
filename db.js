const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

// Create a pool of connections to MySQL.
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "practice_lab",
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10
});

// These are the table definitions used in our practical lab.
const createUserTable = `
    CREATE TABLE IF NOT EXISTS USERS (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        USERNAME VARCHAR(255) NOT NULL,
        EMAIL VARCHAR(255) UNIQUE NOT NULL,
        PASSWORD VARCHAR(255) NOT NULL,
        ROLE ENUM('admin', 'user') NOT NULL DEFAULT 'user',
        MANAGER_ID INT NULL,
        FOREIGN KEY (MANAGER_ID) REFERENCES USERS(ID)
            ON DELETE SET NULL
    )
`;

const createTripTable = `
    CREATE TABLE IF NOT EXISTS TRIPS (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        DESTINATION VARCHAR(150) NOT NULL,
        COUNTRY VARCHAR(150) NOT NULL,
        COST DECIMAL(10,2) NOT NULL
    )
`;

const createReviewTable = `
    CREATE TABLE IF NOT EXISTS REVIEWS (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        USER_ID INT NOT NULL,
        TRIP_ID INT NOT NULL,
        RATING INT NOT NULL,
        COMMENT TEXT,
        FOREIGN KEY (USER_ID) REFERENCES USERS(ID) ON DELETE CASCADE,
        FOREIGN KEY (TRIP_ID) REFERENCES TRIPS(ID) ON DELETE CASCADE
    )
`;

async function initializeDatabase() {
    await db.query("SELECT 1");
    await db.query(createUserTable);
    await db.query(createTripTable);
    await db.query(createReviewTable);
    console.log("Database connected and tables are ready");
}

module.exports = { db, initializeDatabase };
