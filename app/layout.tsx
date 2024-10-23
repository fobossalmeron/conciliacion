import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Conciliación",
  description: "Sistema para gestionar la conciliación de facturas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex flex-col h-screen bg-gray-100">
          <MobileNav />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 p-4 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
