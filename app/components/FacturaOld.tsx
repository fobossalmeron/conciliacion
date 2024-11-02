import Link from "next/link";
import { NumericFormat } from 'react-number-format';

interface FacturaProps {
  id: string;
  numeroFactura: string;
  doctor: string;
  direccion: string;
  paquetes: number;
  telefono: string;
  comprobantePago?: string;
  totalPagado?: number | null;
  tipoCambio?: number | null;
}

export default function Factura({
  id,
  numeroFactura,
  doctor,
  comprobantePago,
  totalPagado,
  tipoCambio,
}: FacturaProps) {
  const isCompleta =
    totalPagado != null && tipoCambio != null && comprobantePago != null;
  const isParcial =
    (totalPagado != null || tipoCambio != null || comprobantePago != null) &&
    !isCompleta;

  const getEstadoClase = () => {
    if (isCompleta) return "bg-green-100";
    if (isParcial) return "bg-yellow-100";
    return "bg-white";
  };

  const getAccionTexto = () => {
    if (isCompleta) return "Editar";
    if (isParcial) return "Completar";
    return "Conciliar";
  };

  const CheckIcon = () => (
    <svg
      className="w-5 h-5 text-green-500 inline-block ml-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );

  const XIcon = () => (
    <svg
      className="w-5 h-5 text-red-500 inline-block ml-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <Link href={`/conciliar-factura/${id}`} className="block">
      <li className={`${getEstadoClase()} shadow rounded-lg p-4 hover:shadow-md active:shadow-md duration-300 hover:border-blue-500 active:border-blue-500 border-transparent border-2 transition-all`}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-3xl font-semibold">{numeroFactura}</span>
          <span className="text-blue-600 hover:text-blue-800">
            {getAccionTexto()}
          </span>
        </div>
        <p>
          <strong>Doctor:</strong> {doctor}
        </p>
        {(isCompleta || isParcial) && (
          <>
            <p>
              <strong>Comprobante: </strong>
              {comprobantePago ? (
                <>Subido<CheckIcon /></>
              ) : (
                <>Faltante<XIcon /></>
              )}
            </p>
            <div className="flex flex-row items-start gap-4">
              <p>
                <strong>Total: </strong>
                {totalPagado != null ? (
                  <>
                    <NumericFormat
                      value={totalPagado}
                      displayType={'text'}
                      thousandSeparator=","
                      decimalSeparator="."
                      prefix="$"
                      decimalScale={2}
                      fixedDecimalScale
                    />
                    <CheckIcon />
                  </>
                ) : (
                  <>Faltante<XIcon /></>
                )}
              </p>
              <p>
                <strong>TDC: </strong>
                {tipoCambio != null ? (
                  <>
                    <NumericFormat
                      value={tipoCambio}
                      displayType={'text'}
                      decimalScale={2}
                      fixedDecimalScale
                    />
                    <CheckIcon />
                  </>
                ) : (
                  <>Faltante<XIcon /></>
                )}
              </p>
            </div>
          </>
        )}
      </li>
    </Link>
  );
}
