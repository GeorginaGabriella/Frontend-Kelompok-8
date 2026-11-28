import "dotenv/config";
import { createClient } from "@libsql/client";
import { Client } from "pg";

const tables = [
  "users",
  "menus",
  "favorites",
  "choices",
  "faqs",
  "site_content",
];

async function main() {
  const sqlite = createClient({
    url: "file:./dev.db",
  });

  const postgres = new Client({
    connectionString: process.env.DIRECT_URL,
    connectionTimeoutMillis: 20000,
    keepAlive: true,
  });

  let connected = false;

  try {
    console.log("Menghubungkan ke PostgreSQL Neon...");

    await postgres.connect();
    connected = true;

    console.log("Koneksi PostgreSQL berhasil!");
    console.log("\n=== PERBANDINGAN DATA ===\n");

    let allMatch = true;

    for (const table of tables) {
      console.log(`Memeriksa tabel: ${table}`);

      const sqliteResult = await sqlite.execute(
        `SELECT COUNT(*) AS total FROM "${table}"`
      );

      const postgresResult = await postgres.query(
        `SELECT COUNT(*) AS total FROM "${table}"`
      );

      const sqliteCount = Number(sqliteResult.rows[0].total);
      const postgresCount = Number(postgresResult.rows[0].total);

      const match = sqliteCount === postgresCount;

      if (!match) {
        allMatch = false;
      }

      console.log(`SQLite    : ${sqliteCount}`);
      console.log(`PostgreSQL: ${postgresCount}`);
      console.log(`Status    : ${match ? "COCOK" : "TIDAK COCOK"}`);
      console.log("---------------------------");
    }

    console.log("\n=== HASIL AKHIR ===");

    if (allMatch) {
      console.log("SEMUA JUMLAH DATA COCOK!");
    } else {
      console.log("ADA JUMLAH DATA YANG BELUM COCOK.");
    }
  } catch (error) {
    console.error("\nTerjadi kesalahan:");
    console.error(error.message);
  } finally {
    sqlite.close();

    if (connected) {
      try {
        await postgres.end();
        console.log("\nKoneksi PostgreSQL ditutup.");
      } catch (error) {
        console.error("Gagal menutup koneksi:", error.message);
      }
    }
  }
}

main();
