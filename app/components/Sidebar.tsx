'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HomeIcon, DocumentTextIcon, PlusCircleIcon, TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

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
      <h1 className="text-2xl font-bold p-4">Conciliación</h1>
      <nav className="flex flex-col flex-grow p-4">
        <ul className="space-y-2 flex-grow">
          <li>
            <Link href="/nuevo-embarque" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
              <PlusCircleIcon className="w-6 h-6 mr-3" />
              <span className="text-lg">Nuevo Embarque</span>
            </Link>
          </li>
          <li>
            <Link href="/facturas" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
              <DocumentTextIcon className="w-6 h-6 mr-3" />
              <span className="text-lg">Facturas</span>
            </Link>
          </li>
          <li>
            <Link href="/ejecutivos" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
              <DocumentDuplicateIcon className="w-6 h-6 mr-3" />
              <span className="text-lg">Ejecutivos</span>
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
