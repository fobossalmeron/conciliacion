import Link from "next/link";
import { NumericFormat } from "react-number-format";
import {
  formatearFecha,
  calcularFechaVencimiento,
  MESES,
} from "../../lib/dateHelpers";
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
  noActions,
}: FacturaCardProps) {
  const fechaFormateada = formatearFecha(fechaEmbarque);
  const fechaVencimiento = calcularFechaVencimiento(fechaEmbarque);

  // Convertir la fecha de embarque original (que viene en formato DD/MMM/YYYY)
  const [dia, mes, año] = fechaEmbarque.split("/");
  const fechaEmbarqueDate = new Date(
    Number(año),
    MESES[mes.toLowerCase()],
    Number(dia)
  );

  // Calcular fecha de vencimiento (3 días hábiles después)
  let diasHabiles = 0;
  const fechaVencimientoDate = new Date(fechaEmbarqueDate);
  while (diasHabiles < 3) {
    fechaVencimientoDate.setDate(fechaVencimientoDate.getDate() + 1);
    const dia = fechaVencimientoDate.getDay();
    if (dia !== 0 && dia !== 6) {
      diasHabiles++;
    }
  }

  const isVencida = fechaVencimientoDate < new Date();
  const isCompleta =
    totalPagado != null && tipoCambio != null && comprobantePago != null;
  const isParcial =
    (totalPagado != null || tipoCambio != null || comprobantePago != null) &&
    !isCompleta;

  const getEstadoClase = () => {
    if (isVencida && !isCompleta) return "bg-red-100";
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
    <li
      className={`${getEstadoClase()} shadow rounded-lg p-4 hover:shadow-md active:shadow-md duration-300 hover:border-blue-500 active:border-blue-500 border-transparent border-2 transition-all list-none`}
    >
      <Link href={`/conciliar-factura/${id}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-3xl font-semibold">{numeroFactura}</span>
          {!noActions && (
            <span className="text-blue-600 hover:text-blue-800">
              {getAccionTexto()}
            </span>
          )}
        </div>
        {isVencida && !isCompleta && (
          <p className="font-medium text-red-600 text-xs">
            {/* Fecha Embarque: {fechaFormateada} <br /> */}
            Venció el: {calcularFechaVencimiento(fechaEmbarque)}
          </p>
        )}
        {(isCompleta || isParcial) && (
          <>
            <p>
              <strong>Comprobante: </strong>
              {comprobantePago ? (
                <>
                  Subido
                  <CheckIcon />
                </>
              ) : (
                <>
                  Faltante
                  <XIcon />
                </>
              )}
            </p>
            <div className="flex flex-row items-start gap-4">
              <p>
                <strong>Total: </strong>
                {totalPagado != null ? (
                  <>
                    <NumericFormat
                      value={totalPagado}
                      displayType={"text"}
                      thousandSeparator=","
                      decimalSeparator="."
                      prefix="$"
                      decimalScale={2}
                      fixedDecimalScale
                    />
                    <CheckIcon />
                  </>
                ) : (
                  <>
                    Faltante
                    <XIcon />
                  </>
                )}
              </p>
              <p>
                <strong>TDC: </strong>
                {tipoCambio != null ? (
                  <>
                    <NumericFormat
                      value={tipoCambio}
                      displayType={"text"}
                      decimalScale={2}
                      fixedDecimalScale
                    />
                    <CheckIcon />
                  </>
                ) : (
                  <>
                    Faltante
                    <XIcon />
                  </>
                )}
              </p>
            </div>
          </>
        )}
      </Link>
    </li>
  );
}
