import { Factura, Embarque, ResultadoProcesamiento } from '../../../types/types';
import { AnalyzeDocumentResponse } from 'aws-sdk/clients/textract';

export async function processTextractResponse(
  response: AnalyzeDocumentResponse
): Promise<ResultadoProcesamiento> {
  const blocks = response.Blocks || [];
  
  const datosEmbarque: Embarque = {
    numeroEmbarque: '',
    fechaEmbarque: '',
    facturas: []
  };

  // Procesar los bloques para extraer la información básica
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.BlockType === 'LINE') {
      const text = block.Text || '';

      // Extraer número de embarque
      if (text.includes('Embarque')) {
        const partes = text.split('Embarque');
        if (partes.length > 1) {
          datosEmbarque.numeroEmbarque = partes[1].trim();
          console.log('Número de embarque encontrado:', datosEmbarque.numeroEmbarque);
        }
      }

      // Extraer fecha de emisión
      if (text.includes('Fecha Emisión:')) {
        const partes = text.split('Fecha Emisión:');
        if (partes.length > 1) {
          datosEmbarque.fechaEmbarque = partes[1].trim();
          console.log('Fecha de emisión encontrada:', datosEmbarque.fechaEmbarque);
        }
      }

      // Extraer facturas y sus vendedores correspondientes
      if (text.includes('Factura')) {
        const partes = text.split('Factura');
        if (partes.length > 1) {
          const numeroFactura = partes[1].trim();
          
          // Buscar el vendedor en los siguientes 4 bloques
          let vendedor = '';
          for (let j = 1; j <= 4; j++) {
            if (i + j < blocks.length) {
              const siguienteBloque = blocks[i + j];
              if (siguienteBloque.BlockType === 'LINE' && siguienteBloque.Text) {
                const palabras = siguienteBloque.Text.split(' ');
                const posibleVendedor = palabras[palabras.length - 1];
                
                // Ignorar si es "Observación"
                if (posibleVendedor === 'Observación') continue;
                
                // Verificar si contiene números
                if (/\d/.test(posibleVendedor)) continue;
                
                // Si contiene "/", tomar la parte derecha
                if (posibleVendedor.includes('/')) {
                  vendedor = posibleVendedor.split('/').pop()?.trim() || '';
                  if (!/\d/.test(vendedor)) break; // Solo salir si no contiene números
                } else {
                  vendedor = posibleVendedor;
                  break;
                }
              }
            }
          }

          if (vendedor) {
            console.log('Factura encontrada:', numeroFactura, 'Vendedor:', vendedor);
            
            const factura: Factura = {
              id: numeroFactura,
              numeroFactura: numeroFactura,
              vendedor: vendedor,
              numeroEmbarque: datosEmbarque.numeroEmbarque,
              fechaEmbarque: datosEmbarque.fechaEmbarque
            };
            
            datosEmbarque.facturas.push(factura);
          }
        }
      }
    }
  }

  // Validar que se hayan encontrado facturas
  if (datosEmbarque.facturas.length === 0) {
    console.log('No se encontraron facturas en el documento');
    throw new Error('No se encontraron facturas en el documento');
  }

  return {
    embarqueItems: datosEmbarque.facturas,
    datosEmbarque
  };
}