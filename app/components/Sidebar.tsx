'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HomeIcon, DocumentTextIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  const router = useRouter();

  const handleVaciarDB = async () => {
    if (confirm('¿Estás seguro de que quieres vaciar la base de datos?')) {
      try {
        const response = await fetch('/api/reset-database', { method: 'POST' });
        if (response.ok) {
          alert('Base de datos vaciada con éxito');
          router.refresh();
        } else {
          alert('Error al vaciar la base de datos');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al vaciar la base de datos');
      }
    }
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white shadow-lg">
      <nav className="flex flex-col flex-grow p-4">
        <ul className="space-y-2 flex-grow">
          <li>
            <Link href="/" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
              <HomeIcon className="w-6 h-6 mr-3" />
              <span className="text-lg">Inicio</span>
            </Link>
          </li>
          <li>
            <Link href="/mis-facturas" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
              <DocumentTextIcon className="w-6 h-6 mr-3" />
              <span className="text-lg">Ver Facturas</span>
            </Link>
          </li>
          <li>
            <Link href="/nuevo-embarque" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
              <PlusCircleIcon className="w-6 h-6 mr-3" />
              <span className="text-lg">Nuevo Embarque</span>
            </Link>
          </li>
        </ul>
        <div className="mt-auto">
          <button 
            onClick={handleVaciarDB} 
            className="flex items-center w-full p-2 text-white bg-red-500 hover:bg-red-600 rounded transition-colors duration-200"
          >
            <TrashIcon className="w-6 h-6 mr-3" />
            <span className="text-lg">Vaciar DB</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
