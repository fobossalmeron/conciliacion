import { NextResponse } from 'next/server';
import { openDb } from '../../../lib/db';

export async function GET() {
  try {
    const db = await openDb();
    const tareas = await db.all('SELECT * FROM tareas');
    return NextResponse.json(tareas);
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    return NextResponse.json({ error: 'Error al obtener las tareas' }, { status: 500 });
  }
}
