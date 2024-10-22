import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Bienvenido al Sistema de Gestión de Comprobantes</h1>
      <Link href="/cargar-documento-embarque" className="text-blue-500 hover:text-blue-700">
        Cargar Documento de Embarque
      </Link>
    </div>
  )
}
