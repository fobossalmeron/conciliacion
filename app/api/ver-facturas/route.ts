import { NextRequest } from 'next/server';
import { openDb } from '../../../lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ejecutivoId = searchParams.get('ejecutivo');

  try {
    const db = await openDb();
    
    let query = `
      SELECT * 
      FROM facturas
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    if (ejecutivoId) {
      query += ' AND LOWER(vendedor) = LOWER(?)';
      params.push(ejecutivoId);
    }
    
    query += ' ORDER BY fechaEmbarque DESC';
    
    console.log('Query:', query);
    console.log('Params:', params);
    
    const facturas = await db.all(query, params);
    
    console.log('Facturas encontradas:', facturas.length);
    
    return Response.json(facturas);
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    return Response.json({ error: 'Error al obtener facturas' }, { status: 500 });
  }
}
