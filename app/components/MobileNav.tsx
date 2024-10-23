'use client';

import { useState } from 'react';

const nombres = ['Mario Mendoza', 'Manuel Jimenez', 'Andrés Pérez'];

export function MobileNav() {
  const [nombreSeleccionado, setNombreSeleccionado] = useState(nombres[0]);

  return (
    <nav className="bg-white text-black p-2 px-8 md:hidden sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium whitespace-nowrap mr-2">Facturas de</span>
        <select 
          value={nombreSeleccionado}
          onChange={(e) => setNombreSeleccionado(e.target.value)}
          className="flex-grow py-3 px-4 text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200
                     text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-300
                     appearance-none cursor-pointer"
          style={{ 
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%232563EB' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")",
            backgroundPosition: "right 0.5rem center",
            backgroundRepeat: "no-repeat",
            paddingRight: "2.5rem"
          }}
        >
          {nombres.map((nombre) => (
            <option key={nombre} value={nombre} className="text-blue-700 bg-white">
              {nombre}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}
