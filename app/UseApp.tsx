"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/store/index";
import useAuthStateListener from "@/hooks/useAuthStateListener";
import { QueryClient, QueryClientProvider } from "react-query";
import Next13ProgressBar from 'next13-progressbar'
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient();

const UseApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider
        storageKey='theme'
        defaultTheme='system'
        enableSystem
        enableColorScheme
        disableTransitionOnChange
        attribute="class"
      >
        <Provider store={store}>
          <AuthStateListenerWrapper>
            <QueryClientProvider client={queryClient}>
              <Next13ProgressBar height="4px" color="#ea580c" options={{ showSpinner: false }} showOnShallow />
              {/* Para transición al cambiar entre páginas */}
              {children}
            </QueryClientProvider>
          </AuthStateListenerWrapper>
        </Provider>
      </ThemeProvider>
    </SessionProvider>
  );
};

// Hacemos uso de useAuthStateListener dentro de un componente envuelto por SessionProvider
const AuthStateListenerWrapper = ({ children }: { children: React.ReactNode }) => {
  useAuthStateListener();
  return <>{children}</>;
};

export default UseApp;