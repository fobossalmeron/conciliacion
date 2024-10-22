import { NextResponse } from 'next/server';
import { openDb } from '../../../lib/db';

export async function POST() {
  try {
    const db = await openDb();
    await db.run('DELETE FROM tareas');
    return NextResponse.json({ message: 'Base de datos vaciada con éxito' });
  } catch (error) {
    console.error('Error al vaciar la base de datos:', error);
    return NextResponse.json({ error: 'Error al vaciar la base de datos' }, { status: 500 });
  }
}
