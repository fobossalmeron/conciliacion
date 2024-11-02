import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../../../lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { totalPagado } = await request.json();
    const db = await openDb();
    
    await db.run(`
      UPDATE facturas
      SET totalPagado = ?
      WHERE id = ?
    `, [parseFloat(totalPagado), params.id]);

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
    console.error('Error al actualizar el total pagado:', error);
    return NextResponse.json({ error: 'Error al actualizar el total pagado' }, { status: 500 });
  }
}
