import { NextResponse } from 'next/server';
import { openDb } from '../../../lib/db';

export async function GET() {
  try {
    const db = await openDb();
    
    const vendedores = await db.all(`
      SELECT DISTINCT 
        LOWER(vendedor) as id, 
        vendedor as nombre
      FROM facturas
      WHERE vendedor IS NOT NULL
      ORDER BY vendedor ASC
    `);

    console.log('Vendedores encontrados:', vendedores); // Para debug

    return NextResponse.json(vendedores);
  } catch (error) {
    console.error('Error al obtener vendedores:', error);
    return NextResponse.json(
      { error: 'Error al cargar los vendedores' },
      { status: 500 }
    );
  }
} 