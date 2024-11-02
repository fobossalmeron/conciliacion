'use client';

import { useEffect, useState } from 'react';
import { Factura, Embarque } from '../../types/types';
import FacturaCard from './FacturaCard';
import { formatearFecha } from '../../lib/dateHelpers';
interface FacturasListProps {
  ejecutivoId?: string;
}

export function FacturasList({ ejecutivoId }: FacturasListProps) {
  const [embarques, setEmbarques] = useState<Embarque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        setIsLoading(true);
        const url = ejecutivoId 
          ? `/api/ver-facturas?ejecutivo=${ejecutivoId}`
          : '/api/ver-facturas';
          
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error al cargar facturas');
        
        const facturas: Factura[] = await res.json();
        
        // Agrupar facturas por embarque
        const grupos = facturas.reduce((acc: Embarque[], factura) => {
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

        // Ordenar grupos por fecha de embarque (más reciente primero)
        const gruposOrdenados = grupos.sort((a, b) => 
          new Date(b.fechaEmbarque).getTime() - new Date(a.fechaEmbarque).getTime()
        );

        setEmbarques(gruposOrdenados);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacturas();
  }, [ejecutivoId]);

  if (isLoading) return <div className="p-4">Cargando facturas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="py-4">
      {embarques.map((embarque) => (
        <div key={embarque.numeroEmbarque} className="">
          <div className="sticky top-0 bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">
              Embarque: {embarque.numeroEmbarque}
            </h2>
            {/* <p className="text-sm text-gray-600">
              Fecha de embarque: {formatearFecha(embarque.fechaEmbarque)}
            </p> */}
          </div>
          
          <ul className="grid gap-4 p-4 mt-0">
            {embarque.facturas.map((factura) => {
              console.log('Factura data:', factura);
              return (
                <FacturaCard
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
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
} 