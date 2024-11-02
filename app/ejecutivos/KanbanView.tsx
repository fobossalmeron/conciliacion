'use client';

import { useEffect, useState } from 'react';
import { Factura } from '../../types/types';
import FacturaCard from '../components/FacturaCard';

interface EmbarqueGroup {
  numeroEmbarque: string;
  fechaEmbarque: string;
  facturas: Factura[];
}

interface VendedorColumn {
  id: string;
  nombre: string;
  embarques: EmbarqueGroup[];
}

export function KanbanView() {
  const [columns, setColumns] = useState<VendedorColumn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facturasRes, vendedoresRes] = await Promise.all([
          fetch('/api/ver-facturas'),
          fetch('/api/vendedores')
        ]);

        const facturas: Factura[] = await facturasRes.json();
        const vendedores = await vendedoresRes.json();

        // Crear columnas para cada vendedor con facturas agrupadas por embarque
        const columnasVendedores = vendedores.map((vendedor: { id: string; nombre: string }) => {
          const facturasVendedor = facturas.filter(f => 
            f.vendedor.toLowerCase() === vendedor.id.toLowerCase()
          );

          // Agrupar facturas por embarque
          const embarques = facturasVendedor.reduce((acc: EmbarqueGroup[], factura) => {
            const grupo = acc.find(g => g.numeroEmbarque === factura.numeroEmbarque);
            if (grupo) {
              grupo.facturas.push(factura);
            } else {
              acc.push({
                numeroEmbarque: factura.numeroEmbarque,
                fechaEmbarque: factura.fechaEmbarque,
                facturas: [factura]
              });
            }
            return acc;
          }, []);

          // Ordenar embarques por fecha (más reciente primero)
          const embarquesOrdenados = embarques.sort((a, b) => 
            new Date(b.fechaEmbarque).getTime() - new Date(a.fechaEmbarque).getTime()
          );

          return {
            id: vendedor.id,
            nombre: vendedor.nombre,
            embarques: embarquesOrdenados
          };
        });

        setColumns(columnasVendedores);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 min-h-[calc(100vh-12rem)]">
        {columns.map((column) => (
          <div 
            key={column.id}
            className="flex-none w-96 bg-gray-50 rounded-lg p-4"
          >
            <div className="sticky top-0 bg-white p-3 rounded-lg shadow mb-4">
              <h3 className="font-medium text-lg">
                {column.nombre.charAt(0).toUpperCase() + column.nombre.slice(1).toLowerCase()}
                <span className="ml-2 text-sm text-gray-500">
                  ({column.embarques.reduce((total, e) => total + e.facturas.length, 0)})
                </span>
              </h3>
            </div>

            <div className="space-y-6">
              {column.embarques.map((embarque) => (
                <div key={embarque.numeroEmbarque} className="space-y-3">
                  <div className="p-2 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700">
                      Embarque: {embarque.numeroEmbarque}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {new Date(embarque.fechaEmbarque).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {embarque.facturas.map((factura) => (
                      <FacturaCard
                        noActions
                        key={factura.id}
                        id={factura.id}
                        numeroFactura={factura.numeroFactura}
                        vendedor={factura.vendedor}
                        numeroEmbarque={factura.numeroEmbarque}
                        fechaEmbarque={factura.fechaEmbarque}
                        comprobantePago={factura.comprobantePago}
                        totalPagado={factura.totalPagado}
                        tipoCambio={factura.tipoCambio}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 