import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../../../lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { tipoCambio } = await request.json();
    const db = await openDb();
    
    await db.run(`
      UPDATE facturas
      SET tipoCambio = ?
      WHERE id = ?
    `, [parseFloat(tipoCambio), params.id]);

    const tareaActualizada = await db.get(`
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

    return NextResponse.json(tareaActualizada);
  } catch (error) {
    console.error('Error al actualizar el tipo de cambio:', error);
    return NextResponse.json({ error: 'Error al actualizar el tipo de cambio' }, { status: 500 });
  }
}
