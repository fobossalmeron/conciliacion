import { NextResponse } from 'next/server';
import { openDb } from '../../../lib/db';

export async function POST() {
  try {
    const db = await openDb();
    await db.run('DROP TABLE IF EXISTS facturas');
    console.log('Tabla facturas eliminada');
    
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
    console.log('Base de datos reiniciada y tabla facturas creada nuevamente');
    
    return NextResponse.json({ message: 'Base de datos reiniciada' });
  } catch (error) {
    console.error('Error al reiniciar la base de datos:', error);
    return NextResponse.json({ error: 'Error al reiniciar la base de datos: ' + String(error) }, { status: 500 });
  }
}
