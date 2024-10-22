'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Tarea {
  id: string;
  numeroFactura: string;
  doctor: string;
  direccion: string;
  paquetes: number;
  telefono: string;
  tieneComprobante: boolean;
  totalPagado?: number | null;
  tipoCambio?: number | null;
}

export default function EditarTarea({ params }: { params: { id: string } }) {
  const [tarea, setTarea] = useState<Tarea | null>(null);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [comprobantePreview, setComprobantePreview] = useState<string | null>(null);
  const [totalPagado, setTotalPagado] = useState<string>('');
  const [tipoCambio, setTipoCambio] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTarea = async () => {
      try {
        const response = await fetch(`/api/tareas/${params.id}`);
        if (!response.ok) throw new Error('Error al cargar la tarea');
        const data = await response.json();
        setTarea(data);
        if (data.totalPagado != null) setTotalPagado(data.totalPagado.toString());
        if (data.tipoCambio != null) setTipoCambio(data.tipoCambio.toString());
        if (data.tieneComprobante) {
          setComprobantePreview(`/api/tareas/${params.id}/comprobante`);
        }
      } catch (error) {
        setError('Error al cargar la tarea');
      }
    };
    fetchTarea();
  }, [params.id]);

  const handleComprobanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setComprobante(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setComprobantePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    if (comprobante) formData.append('comprobante', comprobante);
    formData.append('totalPagado', totalPagado);
    formData.append('tipoCambio', tipoCambio);

    try {
      const response = await fetch(`/api/tareas/${params.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al actualizar la tarea');

      router.push('/tareas-generadas');
    } catch (error) {
      setError('Error al actualizar la tarea');
    } finally {
      setIsLoading(false);
    }
  };

  if (!tarea) return <div className="text-center py-10">Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Tarea: {tarea.numeroFactura}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="comprobante" className="block text-sm font-medium text-gray-700">
            Comprobante de pago
          </label>
          <input
            type="file"
            id="comprobante"
            onChange={handleComprobanteChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            accept="image/*"
          />
          {comprobantePreview && (
            <div className="mt-2">
              <Image src={comprobantePreview} alt="Vista previa del comprobante" width={200} height={200} className="object-contain" />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="totalPagado" className="block text-sm font-medium text-gray-700">
            Total pagado
          </label>
          <input
            type="number"
            id="totalPagado"
            value={totalPagado}
            onChange={(e) => setTotalPagado(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="tipoCambio" className="block text-sm font-medium text-gray-700">
            Tipo de cambio (USD a MXN)
          </label>
          <input
            type="number"
            id="tipoCambio"
            value={tipoCambio}
            onChange={(e) => setTipoCambio(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-between">
          <Link href="/tareas-generadas" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Volver a la lista
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
