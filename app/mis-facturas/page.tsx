'use client';

import { useState, useEffect } from 'react';
import Factura from '../components/Factura';

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

export default function MisFacturas() {
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
    <div className="container mx-auto p-4 pb-20">
      {tareas.length === 0 ? (
        <p className="text-center py-10">No hay tareas disponibles.</p>
      ) : (
        <ul className="space-y-4">
          {tareas.map((tarea) => (
            <Factura key={tarea.id} {...tarea} />
          ))}
        </ul>
      )}
    </div>
  );
}
