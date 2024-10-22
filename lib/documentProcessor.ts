import { parse as csvParse } from 'csv-parse/sync';
import xlsx from 'xlsx';

interface Tarea {
  idFactura: string;
  ejecutivoVentas: string;
  // Otros campos relevantes
}

export async function processShippingDocument(file: File): Promise<Tarea[]> {
  const fileContent = await file.text();
  let parsedData;

  try {
    parsedData = JSON.parse(fileContent);
  } catch (error) {
    throw new Error('El archivo JSON no es válido');
  }

  // Lógica para procesar los datos y generar tareas
  const tareas: Tarea[] = parsedData.map((item: any) => ({
    idFactura: item.ID || 'error',
    // Asigna otros campos relevantes
  }));

  return tareas;
}