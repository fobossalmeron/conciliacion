import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Aquí deberías implementar tu lógica de autenticación
  // Por ejemplo, verificar un token JWT en las cookies o headers
  const isAuthenticated = checkAuthentication(request);

  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/api/tareas')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  return NextResponse.next();
}

function checkAuthentication(request: NextRequest): boolean {
  // Implementa tu lógica de verificación de autenticación aquí
  // Por ahora, siempre devuelve true para fines de demostración
  return true;
}

export const config = {
  matcher: '/api/facturas/:path*',
};
