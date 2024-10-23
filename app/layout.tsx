import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Conciliación de Facturas",
  description: "Sistema para gestionar la conciliación de facturas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full bg-gray-50">
      <body className={`${inter.className} flex flex-col min-h-full`}>
        <MobileNav />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-gray-100">
            <div className="max-w-4xl mx-auto p-4">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
