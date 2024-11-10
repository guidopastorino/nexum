"use client";

import React, { useState } from 'react';

interface HoverCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

const HoverCard: React.FC<HoverCardProps> = ({ trigger, children }) => {
  const [showCard, setShowCard] = useState(false); // Estado para controlar la visibilidad de la tarjeta
  const [fadeOut, setFadeOut] = useState(false);  // Estado para controlar el desvanecimiento

  let timer: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(timer); // Limpiar cualquier temporizador existente
    setFadeOut(false); // Asegurarse de que no esté en estado de desvanecimiento
    timer = setTimeout(() => {
      setShowCard(true); // Muestra la tarjeta después de 1 segundo
    }, 1000); // 1 segundo
  };

  const handleMouseLeave = () => {
    clearTimeout(timer); // Limpiar el temporizador al salir
    setFadeOut(true); // Inicia la animación de desvanecimiento
    // Después de 500ms de desvanecimiento, oculta la tarjeta
    setTimeout(() => {
      setShowCard(false); // Oculta la tarjeta después de 500ms
    }, 500); // Tiempo para la animación de desvanecimiento
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block relative"
    >
      {/* Elemento que activa el hover */}
      {trigger}

      {/* Mostrar la card solo cuando `showCard` sea true */}
      {showCard && (
        <div
          className={`border rounded-lg overflow-hidden w-max min-w-64 absolute left-0 top-full pt-2 p-4 bg-white shadow-lg transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default HoverCard;