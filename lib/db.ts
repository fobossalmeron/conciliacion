import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

async function openDb() {
  if (!db) {
    db = await open({
      filename: './facturas.sqlite',
      driver: sqlite3.Database
    });
    
    // Solo creamos la tabla si no existe
    await db.exec(`
      CREATE TABLE IF NOT EXISTS facturas (
        id TEXT PRIMARY KEY,
        numeroFactura TEXT,
        vendedor TEXT,
        numeroEmbarque TEXT,
        fechaEmbarque TEXT,
        comprobantePago BLOB,
        totalPagado REAL,
        tipoCambio REAL
      )
    `);
  }
  return db;
}

export { openDb };
