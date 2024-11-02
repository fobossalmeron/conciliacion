import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../../../lib/db';

interface EmbarqueItem {
  Orden: number;
  ID: string;
  Doctor: string;
  Calle: string;
  Colonia: string;
  Municipio: string;
  Paquetes: number;
  CodigoPostal: string;
  Telefono: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('documento') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 });
    }

    const fileContents = await file.text();
    const embarqueData = JSON.parse(fileContents) as EmbarqueItem[];

    const db = await openDb();

    // Convertir los datos del embarque en tareas y guardarlas en la base de datos
    for (const item of embarqueData) {
      await db.run(`
        INSERT OR REPLACE INTO tareas (id, numeroFactura, doctor, direccion, paquetes, telefono)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        item.ID,
        item.ID,
        item.Doctor,
        `${item.Calle}, ${item.Colonia}, ${item.Municipio}, CP ${item.CodigoPostal}`,
        item.Paquetes,
        item.Telefono
      ]);
    }

    return NextResponse.json({ message: 'Documento procesado con éxito', tareasCreadas: embarqueData.length });
  } catch (error) {
    console.error('Error al procesar el documento:', error);
    return NextResponse.json({ error: 'Error al procesar el documento' }, { status: 500 });
  }
}
