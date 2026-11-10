const { app } = require("./index");
const { db, initializeDatabase } = require("./db");

async function startServer() {
    try {
        // First connect to MySQL and create missing tables.
        await initializeDatabase();

        const PORT = Number(process.env.PORT || 3000);
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Database startup failed:", error.message);
        process.exitCode = 1;
        await db.end();
    }
}

startServer();
