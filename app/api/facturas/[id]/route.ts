import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../../lib/db';
import sharp from 'sharp';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await openDb();
    const factura = await db.get(`
      SELECT 
        id, 
        numeroFactura, 
        vendedor,
        numeroEmbarque,
        fechaEmbarque,
        totalPagado, 
        tipoCambio, 
        (comprobantePago IS NOT NULL) as tieneComprobante 
      FROM facturas 
      WHERE id = ?
    `, params.id);

    if (!factura) {
      return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 });
    }
    return NextResponse.json(factura);
  } catch (error) {
    console.error('Error al obtener la factura:', error);
    return NextResponse.json({ error: 'Error al obtener la factura' }, { status: 500 });
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
      UPDATE facturas
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

    const facturaActualizada = await db.get(`
      SELECT 
        id, 
        numeroFactura, 
        vendedor,
        numeroEmbarque,
        fechaEmbarque,
        totalPagado, 
        tipoCambio, 
        (comprobantePago IS NOT NULL) as tieneComprobante 
      FROM facturas 
      WHERE id = ?
    `, params.id);
    
    return NextResponse.json(facturaActualizada);
  } catch (error) {
    console.error('Error al actualizar la factura:', error);
    return NextResponse.json({ error: 'Error al actualizar la factura' }, { status: 500 });
  }
}
