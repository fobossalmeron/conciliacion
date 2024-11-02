import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { guardarResultadoTextract } from '../../../lib/documentProcessor';
import { processTextractResponse } from './extract';
import { openDb } from '../../../lib/db';

// Configura AWS Textract
const textract = new AWS.Textract({
  region: 'us-east-1',
  credentials: new AWS.Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  })
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('documento') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 });
    }

    // Convierte el archivo a un buffer
    const fileBuffer = await file.arrayBuffer();

    // Llama a Textract para analizar el documento
    const params = {
      Document: {
        Bytes: Buffer.from(fileBuffer)
      }
    };

    const textractResponse = await textract.analyzeDocument({
      ...params,
      FeatureTypes: ['TABLES', 'FORMS']
    }).promise();

    // Guardar resultado de Textract
    await guardarResultadoTextract(
      file.name,
      textractResponse,
      file
    );

    // Procesa la respuesta de Textract para extraer los datos necesarios
    const resultado = await processTextractResponse(textractResponse);

    // Guardar las facturas en la base de datos
    const db = await openDb();
    
    for (const factura of resultado.embarqueItems) {
      await db.run(`
        INSERT OR REPLACE INTO facturas (
          id,
          numeroFactura,
          vendedor,
          numeroEmbarque,
          fechaEmbarque
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        factura.id,
        factura.id,
        factura.vendedor,
        factura.numeroEmbarque,
        factura.fechaEmbarque
      ]);
    }

    return NextResponse.json({ 
      message: 'Documento procesado con éxito', 
      resultado,
      facturasGuardadas: resultado.embarqueItems.length
    });

  } catch (error) {
    console.error('Error al procesar el documento:', error);
    return NextResponse.json({ 
      error: 'Error al procesar el documento',
      detalles: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
