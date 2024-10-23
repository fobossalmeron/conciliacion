'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CamaraComprobante from './CamaraComprobante';
import { Button } from '../../components/Button';
import { NumericFormat } from 'react-number-format';

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
  const [isTareaCompleta, setIsTareaCompleta] = useState(false);
  const router = useRouter();
  const [mostrarCamara, setMostrarCamara] = useState(false);

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
        verificarTareaCompleta(data.tieneComprobante, data.totalPagado, data.tipoCambio);
      } catch (error) {
        setError('Error al cargar la tarea');
      }
    };
    fetchTarea();
  }, [params.id]);

  const verificarTareaCompleta = (tieneComprobante: boolean, totalPagado: number | null, tipoCambio: number | null) => {
    setIsTareaCompleta(
      tieneComprobante && 
      totalPagado !== null && 
      totalPagado !== 0 && 
      tipoCambio !== null && 
      tipoCambio !== 0
    );
  };

  const handleCapture = async (file: File, preview: string) => {
    setComprobante(file);
    setComprobantePreview(preview);
    setMostrarCamara(false);
    await guardarComprobante(file);
  };

  const handleInputChange = async (campo: 'totalPagado' | 'tipoCambio', valor: string) => {
    if (campo === 'totalPagado') {
      setTotalPagado(valor);
      await guardarTotalPagado(valor);
    } else {
      setTipoCambio(valor);
      await guardarTipoCambio(valor);
    }
  };

  const guardarComprobante = async (comprobante: File) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('comprobante', comprobante);

    try {
      const response = await fetch(`/api/tareas/${params.id}/comprobante`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al actualizar el comprobante');

      const updatedTarea = await response.json();
      setTarea(updatedTarea);
      verificarTareaCompleta(true, updatedTarea.totalPagado, updatedTarea.tipoCambio);
    } catch (error) {
      setError('Error al actualizar el comprobante');
    } finally {
      setIsLoading(false);
    }
  };

  const guardarTotalPagado = async (totalPagado: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tareas/${params.id}/total-pagado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ totalPagado }),
      });

      if (!response.ok) throw new Error('Error al actualizar el total pagado');

      const updatedTarea = await response.json();
      setTarea(updatedTarea);
      verificarTareaCompleta(updatedTarea.tieneComprobante, parseFloat(totalPagado), updatedTarea.tipoCambio);
    } catch (error) {
      setError('Error al actualizar el total pagado');
    } finally {
      setIsLoading(false);
    }
  };

  const guardarTipoCambio = async (tipoCambio: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tareas/${params.id}/tipo-cambio`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipoCambio }),
      });

      if (!response.ok) throw new Error('Error al actualizar el tipo de cambio');

      const updatedTarea = await response.json();
      setTarea(updatedTarea);
      verificarTareaCompleta(updatedTarea.tieneComprobante, updatedTarea.totalPagado, parseFloat(tipoCambio));
    } catch (error) {
      setError('Error al actualizar el tipo de cambio');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCambiarComprobante = () => {
    setMostrarCamara(true);
  };

  if (!tarea) return <div className="text-center py-10">Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      <div className="mb-6">
        <Link href="/mis-facturas" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Volver a todas las facturas
        </Link>
        <h1 className="text-4xl sm:text-5xl font-bold">{tarea.numeroFactura}</h1>
        {isTareaCompleta ? <p className="text-lg text-green-700 text-start max-w-max font-medium bg-green-200 py-2 px-4 rounded-lg mt-2">Conciliada</p> : ""}
      </div>
      <div className="space-y-6">
        <div>
          <label htmlFor="comprobante" className="block text-lg font-medium text-gray-700 mb-2">
            Comprobante de pago
          </label>
          {(tarea.tieneComprobante || comprobantePreview) && (
            <div className="mt-2">
              <img 
                src={comprobantePreview || `/api/tareas/${params.id}/comprobante`} 
                alt="Comprobante" 
                className="w-full h-auto rounded-lg shadow-md" 
              />
              <Button
                onClick={handleCambiarComprobante}
                variant="secondary"
                className="mt-4"
              >
                Cambiar comprobante
              </Button>
            </div>
          )}
          {mostrarCamara && (
            <div className="mt-4">
              <CamaraComprobante onCapture={handleCapture} />
              <button
                type="button"
                onClick={() => setMostrarCamara(false)}
                className="mt-4 w-full py-3 px-4 text-lg font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancelar
              </button>
            </div>
          )}
          {!tarea.tieneComprobante && !comprobantePreview && !mostrarCamara && (
            <CamaraComprobante onCapture={handleCapture} />
          )}
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="totalPagado" className="block text-lg font-medium text-gray-700 mb-2">
              Total pagado
            </label>
            <NumericFormat
              id="totalPagado"
              value={totalPagado}
              onValueChange={(values) => {
                const { value } = values;
                handleInputChange('totalPagado', value);
              }}
              thousandSeparator=","
              decimalSeparator="."
              prefix="$"
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              placeholder="$600.00"
              className="w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="tipoCambio" className="block text-lg font-medium text-gray-700 mb-2">
              Tipo de cambio 
            </label>
            <input
              type="number"
              id="tipoCambio"
              value={tipoCambio}
              onChange={(e) => handleInputChange('tipoCambio', e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="19.3 MXN"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-lg">{error}</p>}
        <div className="flex flex-col space-y-4">
          <Link href="/mis-facturas" passHref>
            <Button 
              variant="primary" 
              className={`text-center ${isTareaCompleta ? 'bg-green-600 hover:bg-green-700 !active:bg-green-800' : ''}`}
            >
              Volver a la lista
            </Button>
          </Link>
          {isLoading && <p className="text-lg text-gray-500 text-center">Guardando cambios...</p>}
        </div>
      </div>
    </div>
  );
}
