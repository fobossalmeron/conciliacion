import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db: any = null;

async function openDb() {
  if (!db) {
    db = await open({
      filename: './tareas.sqlite',
      driver: sqlite3.Database
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS tareas (
        id TEXT PRIMARY KEY,
        numeroFactura TEXT,
        doctor TEXT,
        direccion TEXT,
        paquetes INTEGER,
        telefono TEXT,
        comprobantePago BLOB,
        totalPagado REAL,
        tipoCambio REAL
      )
    `);
  }
  return db;
}

export { openDb };
