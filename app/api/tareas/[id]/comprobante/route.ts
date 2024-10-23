import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../../../lib/db';
import sharp from 'sharp';

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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    const comprobante = formData.get('comprobante') as File | null;

    if (!comprobante) {
      return NextResponse.json({ error: 'No se proporcionó un comprobante' }, { status: 400 });
    }

    const db = await openDb();
    
    const arrayBuffer = await comprobante.arrayBuffer();
    const comprobanteBuffer = await sharp(Buffer.from(arrayBuffer))
      .resize(800)
      .jpeg({ quality: 80 })
      .toBuffer();

    await db.run(`
      UPDATE tareas
      SET comprobantePago = ?
      WHERE id = ?
    `, [comprobanteBuffer, params.id]);

    const tareaActualizada = await db.get('SELECT id, numeroFactura, doctor, direccion, paquetes, telefono, totalPagado, tipoCambio, (comprobantePago IS NOT NULL) as tieneComprobante FROM tareas WHERE id = ?', params.id);
    return NextResponse.json(tareaActualizada);
  } catch (error) {
    console.error('Error al actualizar el comprobante:', error);
    return NextResponse.json({ error: 'Error al actualizar el comprobante' }, { status: 500 });
  }
}
