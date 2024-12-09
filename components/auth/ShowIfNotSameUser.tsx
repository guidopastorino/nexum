import { useSession } from "next-auth/react";
import React from "react";

interface ShowIfNotSameUserProps {
  userId: string; // El id del usuario que se pasa como prop
  children: React.ReactNode; // El contenido que se renderiza si los ids no son iguales
}

const ShowIfNotSameUser: React.FC<ShowIfNotSameUserProps> = ({ userId, children }) => {
  const { data: session } = useSession();
  
  // Verifica si el usuario está logueado y si sus IDs son diferentes
  if (!session?.user?.id || session.user.id === userId) {
    return null; // Si el usuario está logueado y los IDs son iguales, no renderiza nada
  }

  return <>{children}</>; // Si los IDs son diferentes, renderiza los children
};

export default ShowIfNotSameUser;
