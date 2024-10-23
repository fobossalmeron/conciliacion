import { NextResponse } from 'next/server';
import { openDb, initializeDatabase } from '../../../lib/db';

export async function POST() {
  try {
    const db = await openDb();
    await db.run('DROP TABLE IF EXISTS tareas');
    console.log('Tabla tareas eliminada');
    
    await initializeDatabase();
    console.log('Base de datos reiniciada y tabla tareas creada nuevamente');
    
    return NextResponse.json({ message: 'Base de datos reiniciada' });
  } catch (error) {
    console.error('Error al reiniciar la base de datos:', error);
    return NextResponse.json({ error: 'Error al reiniciar la base de datos: ' + String(error) }, { status: 500 });
  }
}
