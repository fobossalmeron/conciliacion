import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../../../lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await openDb();
    const result = await db.get('SELECT comprobantePago FROM tareas WHERE id = ?', params.id);
    
    if (!result || !result.comprobantePago) {
      return NextResponse.json({ error: 'Comprobante no encontrado' }, { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', 'image/jpeg');
    headers.set('Cache-Control', 'private, max-age=3600');

    return new NextResponse(result.comprobantePago, { headers });
  } catch (error) {
    console.error('Error al obtener el comprobante:', error);
    return NextResponse.json({ error: 'Error al obtener el comprobante' }, { status: 500 });
  }
}
