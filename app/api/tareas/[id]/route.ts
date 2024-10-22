import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../../lib/db';
import sharp from 'sharp';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await openDb();
    const tarea = await db.get('SELECT id, numeroFactura, doctor, direccion, paquetes, telefono, totalPagado, tipoCambio, (comprobantePago IS NOT NULL) as tieneComprobante FROM tareas WHERE id = ?', params.id);
    if (!tarea) {
      return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
    }
    return NextResponse.json(tarea);
  } catch (error) {
    console.error('Error al obtener la tarea:', error);
    return NextResponse.json({ error: 'Error al obtener la tarea' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    const comprobante = formData.get('comprobante') as File | null;
    const totalPagado = formData.get('totalPagado');
    const tipoCambio = formData.get('tipoCambio');

    const db = await openDb();
    
    let comprobanteBuffer = null;
    if (comprobante) {
      const arrayBuffer = await comprobante.arrayBuffer();
      comprobanteBuffer = await sharp(Buffer.from(arrayBuffer))
        .resize(800) // Redimensionar a un máximo de 800px de ancho
        .jpeg({ quality: 80 }) // Convertir a JPEG con calidad del 80%
        .toBuffer();
    }

    await db.run(`
      UPDATE tareas
      SET comprobantePago = ?,
          totalPagado = ?,
          tipoCambio = ?
      WHERE id = ?
    `, [
      comprobanteBuffer,
      totalPagado ? parseFloat(totalPagado as string) : null,
      tipoCambio ? parseFloat(tipoCambio as string) : null,
      params.id
    ]);

    const tareaActualizada = await db.get('SELECT id, numeroFactura, doctor, direccion, paquetes, telefono, totalPagado, tipoCambio, (comprobantePago IS NOT NULL) as tieneComprobante FROM tareas WHERE id = ?', params.id);
    return NextResponse.json(tareaActualizada);
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    return NextResponse.json({ error: 'Error al actualizar la tarea' }, { status: 500 });
  }
}
