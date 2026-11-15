import "dotenv/config";
import { createClient } from "@libsql/client";
import { Client } from "pg";

const sqlite = createClient({
  url: "file:./dev.db",
});

const postgres = new Client({
  connectionString: process.env.DIRECT_URL,
});

const tables = [
  {
    name: "users",
    columns: ["id", "name", "username", "password", "role"],
  },
  {
    name: "menus",
    columns: ["id", "slug", "name", "data"],
  },
  {
    name: "favorites",
    columns: ["id", "username", "menu_name"],
  },
  {
    name: "choices",
    columns: ["id", "username", "menu_name"],
  },
  {
    name: "faqs",
    columns: ["id", "question", "answer"],
  },
  {
    name: "site_content",
    columns: ["id", "hero_description", "about_description"],
  },
];

async function main() {
  let transactionStarted = false;

  try {
    await postgres.connect();

    console.log("Memeriksa database tujuan...");

    for (const table of tables) {
      const result = await postgres.query(
        `SELECT COUNT(*)::int AS total FROM "${table.name}"`
      );

      if (result.rows[0].total !== 0) {
        throw new Error(
          `Tabel ${table.name} tidak kosong. Pemindahan dibatalkan.`
        );
      }
    }

    const sourceData = {};

    for (const table of tables) {
      const columns = table.columns
        .map((column) => `"${column}"`)
        .join(", ");

      const result = await sqlite.execute(
        `SELECT ${columns} FROM "${table.name}" ORDER BY id`
      );

      sourceData[table.name] = result.rows;

      console.log(
        `SQLite ${table.name}: ${result.rows.length} data`
      );
    }

    await postgres.query("BEGIN");
    transactionStarted = true;

    for (const table of tables) {
      const rows = sourceData[table.name];

      if (rows.length === 0) {
        continue;
      }

      const columns = table.columns
        .map((column) => `"${column}"`)
        .join(", ");

      const placeholders = table.columns
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      const insertSQL = `
        INSERT INTO "${table.name}" (${columns})
        VALUES (${placeholders})
      `;

      for (const row of rows) {
        const values = table.columns.map(
          (column) => row[column]
        );

        await postgres.query(insertSQL, values);
      }

      console.log(
        `Berhasil menyalin ${rows.length} data: ${table.name}`
      );
    }

    // Sesuaikan sequence ID otomatis PostgreSQL.
    for (const table of tables) {
      await postgres.query(
        `
        SELECT setval(
          pg_get_serial_sequence($1, 'id'),
          COALESCE(MAX(id), 1),
          MAX(id) IS NOT NULL
        )
        FROM "${table.name}"
        `,
        [table.name]
      );
    }

    for (const table of tables) {
      const expected = sourceData[table.name].length;

      const result = await postgres.query(
        `SELECT COUNT(*)::int AS total FROM "${table.name}"`
      );

      const actual = result.rows[0].total;

      if (actual !== expected) {
        throw new Error(
          `Jumlah data ${table.name} tidak cocok: ${expected} vs ${actual}`
        );
      }
    }

    await postgres.query("COMMIT");
    transactionStarted = false;

    console.log("\nSEMUA DATA BERHASIL DIPINDAHKAN!");
    console.log("SQLite tetap tidak diubah.");
  } catch (error) {
    if (transactionStarted) {
      await postgres.query("ROLLBACK");
      console.log("Transaksi dibatalkan. Perubahan PostgreSQL di-rollback.");
    }

    console.error("\nPEMINDAHAN GAGAL:", error.message);
    process.exitCode = 1;
  } finally {
    sqlite.close();
    await postgres.end();
  }
}

main();
