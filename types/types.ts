export interface Factura {
  id: string;
  numeroFactura: string;
  vendedor: string;
  numeroEmbarque: string;
  fechaEmbarque: string;
  comprobantePago?: string;
  totalPagado?: number | null;
  tipoCambio?: number | null;
}

export interface Embarque {
  numeroEmbarque: string;
  fechaEmbarque: string;
  facturas: Factura[];
}

export interface ResultadoProcesamiento {
  embarqueItems: Factura[];
  datosEmbarque: Embarque;
}