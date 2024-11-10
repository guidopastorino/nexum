import { useState, useRef, useEffect } from 'react';

// Hook para manejar el scroll de un carrusel
const useScroll = (scrollContainerRef: React.RefObject<HTMLElement>) => {
  // Estado para saber la posición actual del scroll
  const [scrollPosition, setScrollPosition] = useState(0);

  // Estado para mostrar u ocultar los botones de scroll
  const [showButtonLeft, setShowButtonLeft] = useState(false);
  const [showButtonRight, setShowButtonRight] = useState(true);

  // Función para mover el carrusel hacia la izquierda
  const scrollToLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' }); // Ajusta el valor de desplazamiento según lo necesites
    }
  };

  // Función para mover el carrusel hacia la derecha
  const scrollToRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' }); // Ajusta el valor de desplazamiento según lo necesites
    }
  };

  // Hook useEffect para actualizar la posición del scroll y los estados de visibilidad de los botones
  useEffect(() => {
    const container = scrollContainerRef.current;

    const handleScroll = () => {
      if (container) {
        const currentScrollPosition = container.scrollLeft;
        setScrollPosition(currentScrollPosition);

        // Actualizar la visibilidad de los botones
        setShowButtonLeft(currentScrollPosition > 0); // El botón izquierdo desaparece cuando el scroll es 0
        setShowButtonRight(Math.ceil(currentScrollPosition + container.clientWidth) < container.scrollWidth); // El botón derecho desaparece cuando el scroll llega al final
      }
    };

    // Agregar el event listener
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return {
    scrollPosition,
    scrollToLeft,
    scrollToRight,
    showButtonLeft,
    showButtonRight
  };
};

export default useScroll;