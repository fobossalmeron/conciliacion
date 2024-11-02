export const MESES: { [key: string]: number } = {
  'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
  'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
};

export function formatearFecha(fechaStr: string): string {
  if (!fechaStr) return 'Fecha no disponible';
  
  try {
    const [dia, mes, año] = fechaStr.split('/');
    const mesIndex = MESES[mes.toLowerCase()];
    
    if (mesIndex === undefined) {
      throw new Error(`Mes no válido: ${mes}`);
    }

    const fecha = new Date(Number(año), mesIndex, Number(dia));
    
    if (isNaN(fecha.getTime())) {
      throw new Error('Fecha inválida después del parseo');
    }

    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(fecha);

  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha no disponible';
  }
}
  
  export function formatearFechaCorta(fecha: string, locale: string = 'es-MX'): string {
    try {
      return new Date(fecha).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha no disponible';
    }
  }

  export function calcularFechaVencimiento(fechaStr: string): string {
    if (!fechaStr) return 'Fecha no disponible';
    
    try {
      // Parsear fecha en formato "DD/MMM/YYYY"
      const [dia, mes, año] = fechaStr.split('/');
      const mesIndex = MESES[mes.toLowerCase()];
      
      if (mesIndex === undefined) {
        throw new Error(`Mes no válido: ${mes}`);
      }

      const fecha = new Date(Number(año), mesIndex, Number(dia));
      
      // Verificar si la fecha es válida
      if (isNaN(fecha.getTime())) {
        throw new Error('Fecha inválida después del parseo');
      }

      let diasHabiles = 0;
      const fechaVencimiento = new Date(fecha);
      
      while (diasHabiles < 3) {
        fechaVencimiento.setDate(fechaVencimiento.getDate() + 1);
        const dia = fechaVencimiento.getDay();
        if (dia !== 0 && dia !== 6) { // 0 es domingo, 6 es sábado
          diasHabiles++;
        }
      }

      return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(fechaVencimiento);

    } catch (error) {
      console.error('Error al calcular fecha de vencimiento:', error);
      return 'Fecha no disponible';
    }
  }