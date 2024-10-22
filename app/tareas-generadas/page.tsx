'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Tarea {
  id: string;
  numeroFactura: string;
  doctor: string;
  direccion: string;
  paquetes: number;
  telefono: string;
  comprobantePago?: string;
  totalPagado?: number | null;
  tipoCambio?: number | null;
}

export default function TareasGeneradas() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const response = await fetch('/api/obtener-tareas');
        if (!response.ok) throw new Error('Error al cargar las tareas');
        const data = await response.json();
        if (Array.isArray(data)) {
          setTareas(data);
        } else {
          throw new Error('Los datos recibidos no son un array');
        }
      } catch (error) {
        setError('Error al cargar las tareas: ' + (error instanceof Error ? error.message : String(error)));
      } finally {
        setIsLoading(false);
      }
    };
    fetchTareas();
  }, []);

  if (isLoading) return <div className="text-center py-10">Cargando...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tareas Generadas</h1>
      {tareas.length === 0 ? (
        <p className="text-center py-10">No hay tareas disponibles.</p>
      ) : (
        <ul className="space-y-4">
          {tareas.map((tarea) => (
            <li key={tarea.id} className={`${tarea.totalPagado != null ? 'bg-green-100' : 'bg-white'} shadow rounded-lg p-4`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold">Factura: {tarea.numeroFactura}</span>
                <Link href={`/editar-tarea/${tarea.id}`} className="text-blue-600 hover:text-blue-800">
                  Editar
                </Link>
              </div>
              <p><strong>Doctor:</strong> {tarea.doctor}</p>
              <p><strong>Dirección:</strong> {tarea.direccion}</p>
              <p><strong>Paquetes:</strong> {tarea.paquetes}</p>
              <p><strong>Teléfono:</strong> {tarea.telefono}</p>
              {tarea.comprobantePago && <p><strong>Comprobante cargado:</strong> Sí</p>}
              {tarea.totalPagado != null && <p><strong>Total pagado:</strong> ${tarea.totalPagado.toFixed(2)}</p>}
              {tarea.tipoCambio != null && <p><strong>Tipo de cambio:</strong> {tarea.tipoCambio.toFixed(2)} MXN/USD</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
