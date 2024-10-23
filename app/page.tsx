import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Sistema de Conciliación</h1>
      <div className="space-y-4">
        <Link href="/nuevo-embarque" className="block text-blue-500 hover:text-blue-700">
          Nuevo Embarque
        </Link>
        <Link href="/mis-facturas" className="block text-blue-500 hover:text-blue-700">
          Ver Facturas
        </Link>
      </div>
    </div>
  )
}
