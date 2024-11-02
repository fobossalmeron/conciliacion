"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface Vendedor {
  id: number;
  nombre: string;
}

export function MobileNav() {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetch("/api/vendedores")
      .then((res) => res.json())
      .then((data) => setVendedores(data));
  }, []);

  const handleVendedorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("ejecutivo", e.target.value);
    router.push(`?${params.toString()}`);
  };

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="flex gap-2 flex-row items-center">
        <span className="text-lg font-medium whitespace-nowrap mr-2">
          Facturas de
        </span>

        <div className="relative flex-grow">
          <select
            onChange={handleVendedorChange}
            value={searchParams.get("ejecutivo") || ""}
            className="w-full py-3 px-4 pr-10 text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200
                     text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-300
                     appearance-none cursor-pointer"
          >
            <option value="">Todos los ejecutivos</option>
            {vendedores.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nombre.charAt(0).toUpperCase() + v.nombre.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-700 pointer-events-none" />
        </div>
      </div>
    </nav>
  );
}


