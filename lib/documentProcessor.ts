import { mkdir, writeFile, readFile } from 'fs/promises';
import path from 'path';

interface TextractResult {
  id: string;
  facturaId: string;
  timestamp: string;
  resultado: AWS.Textract.AnalyzeDocumentResponse;
  metadata: {
    nombreArchivo: string;
    tamano: number;
    tipo: string;
  };
}

const STORAGE_DIR = path.join(process.cwd(), 'data', 'textract-results');

// Asegura que el directorio existe
async function initializeStorage(): Promise<void> {
  try {
    await mkdir(STORAGE_DIR, { recursive: true });
  } catch (error) {
    console.error('Error al crear directorio de almacenamiento:', error);
    throw new Error('No se pudo inicializar el almacenamiento');
  }
}

export async function guardarResultadoTextract(
  facturaId: string,
  resultado: AWS.Textract.AnalyzeDocumentResponse,
  archivo: File
): Promise<void> {
  try {
    await initializeStorage();

    const textractResult: TextractResult = {
      id: `DOC_${Date.now()}`,
      facturaId,
      timestamp: new Date().toISOString(),
      resultado,
      metadata: {
        nombreArchivo: archivo.name,
        tamano: archivo.size,
        tipo: archivo.type
      }
    };

    const filePath = path.join(STORAGE_DIR, `${facturaId}.json`);
    await writeFile(filePath, JSON.stringify(textractResult, null, 2));
    
    console.log(`Resultado guardado para factura ${facturaId}`);
  } catch (error) {
    console.error('Error al guardar resultado Textract:', error);
    throw new Error('Error al guardar resultado de análisis');
  }
}

export async function obtenerResultadoTextract(
  facturaId: string
): Promise<TextractResult | null> {
  try {
    const filePath = path.join(STORAGE_DIR, `${facturaId}.json`);
    const fileContent = await readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as TextractResult;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    console.error('Error al leer resultado Textract:', error);
    throw new Error('Error al obtener resultado de análisis');
  }
}

export async function analizarResultados(
  facturaId: string
): Promise<any> {
  try {
    const resultado = await obtenerResultadoTextract(facturaId);
    if (!resultado) {
      throw new Error('No se encontró resultado para la factura especificada');
    }

    // Aquí implementarías la lógica de análisis específica
    // Por ejemplo, extraer información relevante del resultado de Textract
    
    return {
      facturaId: resultado.facturaId,
      fechaAnalisis: resultado.timestamp,
      // ... más análisis específico
    };
  } catch (error) {
    console.error('Error al analizar resultados:', error);
    throw new Error('Error en el análisis de resultados');
  }
}