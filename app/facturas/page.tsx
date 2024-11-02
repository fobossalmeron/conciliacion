// Removemos 'use client' ya que esta debe ser una Server Component
import { Suspense } from "react";
import { MobileNav } from "../components/MobileNav";
import { FacturasList } from "../components/FacturasList";

interface PageProps {
  searchParams: { [key: string]: string | undefined };
}

export default function MisFacturasPage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <MobileNav />
      <div className="">
        <Suspense fallback={<div>Cargando facturas...</div>}>
          <FacturasList ejecutivoId={searchParams.ejecutivo} />
        </Suspense>
      </div>
    </div>
  );
}
