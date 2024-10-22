import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { VaciarDbButton } from './components/vaciar-db-button';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Requisiciones",
  description: "Sistema para gestionar requisiciones",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex">
          <nav className="w-64 h-screen bg-white border-r fixed left-0 top-0 p-4">
            <Link href="/" className="text-2xl font-bold text-blue-500 mb-8 block">Conciliación</Link>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 transition duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Inicio</span>
                </Link>
              </li>
              <li>
                <Link href="/tareas-generadas" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 transition duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Facturas</span>
                </Link>
              </li>
              <li>
                <Link href="/cargar-documento-embarque" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 transition duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Subir Embarque</span>
                </Link>
              </li>
            </ul>
            <div className="mt-8">
              <VaciarDbButton />
            </div>
          </nav>
          <main className="ml-64 w-full p-8 min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}