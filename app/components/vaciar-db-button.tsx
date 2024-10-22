'use client';

import { useState } from 'react';

export function VaciarDbButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (confirm('¿Estás seguro de que quieres vaciar la base de datos?')) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/vaciar-db', { method: 'POST' });
        if (response.ok) {
          alert('Base de datos vaciada con éxito');
          window.location.reload();
        } else {
          throw new Error('Error al vaciar la base de datos');
        }
      } catch (error) {
        alert('Error al vaciar la base de datos');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 disabled:opacity-50"
      disabled={isLoading}
    >
      {isLoading ? 'Vaciando...' : 'Vaciar DB'}
    </button>
  );
}