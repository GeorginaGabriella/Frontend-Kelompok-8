import "dotenv/config";
import pg from "pg";

const { Client } = pg;

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    connectionTimeoutMillis: 20000,
  });

  let connected = false;

  try {
    await client.connect();
    connected = true;

    const result = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    console.log("\nTABEL DI NEON DEVELOPMENT:");

    for (const row of result.rows) {
      console.log(`- ${row.tablename}`);
    }
  } catch (error) {
    console.error("Koneksi gagal:", error.message);
  } finally {
    if (connected) {
      await client.end();
    }
  }
}

main();
