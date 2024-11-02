'use client';

import { Suspense } from 'react';
import { KanbanView } from './ejecutivos/KanbanView';

export default function TodasLasFacturas() {
  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ejecutivos</h1>
        <button 
          className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
          onClick={() => window.location.reload()}
        >
          Actualizar
        </button>
      </div>

      <Suspense fallback={<div>Cargando tablero...</div>}>
        <KanbanView />
      </Suspense>
    </div>
  );
} 