// Renderiza contenido para cuando el usuario no está logeado
"use client";

import { useSession } from "next-auth/react";
import React from "react";

const LoggedIn = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  // Renderiza el contenido solo si está logueado
  if (status === "unauthenticated") {
    return <>{children}</>;
  }

  // Si no está logueado, no muestra nada
  return null;
};

export default LoggedIn;
