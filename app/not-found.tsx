"use client"

import React from 'react'
import { BiError } from 'react-icons/bi'
import { useRouter } from 'next/navigation'

const NotFound = () => {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100dvh-48px)] text-gray-800 dark:text-gray-200 col-span-2 p-3 overflow-y-auto">
      <BiError size={100} className="text-red-500 dark:text-red-400 mb-4" />
      <h1 className="text-4xl font-bold mb-2">404 - Página no encontrada</h1>
      <p className="text-lg mb-6 text-center max-w-lg">
        Lo sentimos, la página que estás buscando no existe o ha sido movida. Verifica la URL o regresa a la página de inicio.
      </p>
      <button
        onClick={() => router.push('/')}
        className="px-5 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-md font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition"
      >
        Volver al inicio
      </button>
    </div>
  )
}

export default NotFound
