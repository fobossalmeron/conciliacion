import Link from "next/link";
import { NumericFormat } from 'react-number-format';

interface FacturaCardProps {
  id: string;
  numeroFactura: string;
  vendedor: string;
  numeroEmbarque: string;
  fechaEmbarque: string;
  noActions?: boolean;
  comprobantePago?: string;
  totalPagado?: number | null;
  tipoCambio?: number | null;
}

export default function FacturaCard({
  id,
  numeroFactura,
  vendedor,
  numeroEmbarque,
  fechaEmbarque,
  comprobantePago,
  totalPagado,
  tipoCambio,
  noActions
}: FacturaCardProps) {
  return (
    <li className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow list-none">
          <Link href={`/conciliar-factura/${id}`}>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">Factura: {numeroFactura}</h3>
          {/* Información de debug */}
          <div className="text-xs text-gray-500 mt-1 space-y-0.5">
            <p>Embarque: {numeroEmbarque}</p>
            <p>Vendedor: {vendedor}</p>
            <p>Fecha Embarque: {new Date(fechaEmbarque).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {comprobantePago ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Conciliada
            </span>
          ) : (
            !noActions && (
              <a
                href={`/conciliar-factura/${id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Conciliar
              </a>
            )
          )}
        </div>
      </div>
      </Link>

    </li>
  );
}
