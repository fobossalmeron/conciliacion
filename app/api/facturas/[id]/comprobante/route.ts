import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../../../lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await openDb();
    const result = await db.get('SELECT comprobantePago FROM facturas WHERE id = ?', params.id);
    
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
    const file = formData.get('comprobante') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const db = await openDb();

    await db.run(`
      UPDATE facturas 
      SET comprobantePago = ? 
      WHERE id = ?
    `, [buffer, params.id]);

    const facturaActualizada = await db.get(`
      SELECT 
        id, 
        numeroFactura, 
        totalPagado, 
        tipoCambio,
        vendedor,
        (comprobantePago IS NOT NULL) as tieneComprobante 
      FROM facturas 
      WHERE id = ?
    `, params.id);

    return NextResponse.json(facturaActualizada);
  } catch (error) {
    console.error('Error al actualizar el comprobante:', error);
    return NextResponse.json({ error: 'Error al actualizar el comprobante' }, { status: 500 });
  }
}
