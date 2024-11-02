'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

export default function CargarDocumentoEmbarque() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'application/pdf': ['.pdf']
    },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('documento', file);

    try {
      const response = await fetch('/api/nuevo-embarque', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Resultado:', result);
        router.push('/mis-facturas');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar el documento');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-medium text-gray-900 mb-4">
          Cargar nuevo documento de Embarque
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Sube tu documento JSON para generar tareas automáticamente
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div {...getRootProps()} className={`rounded-md border-2 border-dashed p-6 text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
          <input {...getInputProps()} />
          {file ? (
            <p className="text-sm text-gray-600">Archivo seleccionado: {file.name}</p>
          ) : isDragActive ? (
            <p className="text-lg text-blue-500">Suelta el archivo aquí...</p>
          ) : (
            <p className="text-lg text-gray-500">Arrastra y suelta tu archivo JSON aquí, o haz clic para seleccionar</p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!file || isLoading}
            className="w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
            ) : (
              'Cargar y Procesar Documento'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
