import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../../../lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { totalPagado } = await request.json();
    const db = await openDb();
    
    await db.run(`
      UPDATE tareas
      SET totalPagado = ?
      WHERE id = ?
    `, [parseFloat(totalPagado), params.id]);

    const tareaActualizada = await db.get('SELECT id, numeroFactura, doctor, direccion, paquetes, telefono, totalPagado, tipoCambio, (comprobantePago IS NOT NULL) as tieneComprobante FROM tareas WHERE id = ?', params.id);
    return NextResponse.json(tareaActualizada);
  } catch (error) {
    console.error('Error al actualizar el total pagado:', error);
    return NextResponse.json({ error: 'Error al actualizar el total pagado' }, { status: 500 });
  }
}
