"use client";

import React, { useEffect, useMemo, useState } from "react";
import { WiMoonAltFirstQuarter } from "react-icons/wi";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "next-themes";

const Page = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Recuperar valores iniciales desde localStorage
  const getInitialFontSize = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fontSize") || "default";
    }
    return "default";
  };

  const [fontSize, setFontSize] = useState<string>(getInitialFontSize);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) setTheme(savedTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Aplicar tamaño de fuente y guardar en localStorage
      document.documentElement.classList.remove("font-small", "font-default", "font-large");
      document.documentElement.classList.add(`font-${fontSize}`);
      localStorage.setItem("fontSize", fontSize);
    }
  }, [fontSize]);

  const currentTheme = theme || "system";

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  const changeFontSize = (size: string) => {
    setFontSize(size);
  };

  if (!mounted) return null;

  return (
    <div className="w-full p-3">
      <span className="text-2xl font-medium">Apariencia de la aplicación</span>

      {/* Selector de Tema */}
      <p className="my-3">Modo de color</p>
      <div className="w-full grid grid-cols-3 border borderColor rounded-md overflow-hidden">
        <button
          className={`p-2 flex justify-center items-center gap-2 itemHover ${
            currentTheme === "system" ? "bg-gray-200 dark:bg-neutral-800" : ""
          }`}
          onClick={() => changeTheme("system")}
        >
          <WiMoonAltFirstQuarter />
          <span className="font-medium">Sistema</span>
        </button>
        <button
          className={`p-2 flex justify-center items-center gap-2 itemHover ${
            currentTheme === "light" ? "bg-gray-200 dark:bg-neutral-800" : ""
          }`}
          onClick={() => changeTheme("light")}
        >
          <FiSun />
          <span className="font-medium">Claro</span>
        </button>
        <button
          className={`p-2 flex justify-center items-center gap-2 itemHover ${
            currentTheme === "dark" ? "bg-gray-200 dark:bg-neutral-800" : ""
          }`}
          onClick={() => changeTheme("dark")}
        >
          <FiMoon />
          <span className="font-medium">Oscuro</span>
        </button>
      </div>

      {/* Selector de Tamaño de Fuente */}
      <p className="my-3">Tamaño de fuente</p>
      <div className="w-full grid grid-cols-3 border borderColor rounded-md overflow-hidden">
        <button
          className={`p-2 flex justify-center items-center gap-2 itemHover ${
            fontSize === "small" ? "bg-gray-200 dark:bg-neutral-800" : ""
          }`}
          onClick={() => changeFontSize("small")}
        >
          <span className="font-medium">Pequeño</span>
        </button>
        <button
          className={`p-2 flex justify-center items-center gap-2 itemHover ${
            fontSize === "default" ? "bg-gray-200 dark:bg-neutral-800" : ""
          }`}
          onClick={() => changeFontSize("default")}
        >
          <span className="font-medium">Por Defecto</span>
        </button>
        <button
          className={`p-2 flex justify-center items-center gap-2 itemHover ${
            fontSize === "large" ? "bg-gray-200 dark:bg-neutral-800" : ""
          }`}
          onClick={() => changeFontSize("large")}
        >
          <span className="font-medium">Grande</span>
        </button>
      </div>
    </div>
  );
};

export default Page;