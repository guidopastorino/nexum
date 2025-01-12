"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { RootState, store } from "@/store/index";
import useAuthStateListener from "@/hooks/useAuthStateListener";
import { QueryClient, QueryClientProvider } from "react-query";
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from "next-themes";
import Toast from '@/components/Toast';
import { useSelector } from "react-redux";
import Modal from "@/components/modal/Modal";

const queryClient = new QueryClient();

export default function UseApp({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppWrapper>{children}</AppWrapper>
    </Provider>
  );
};

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, content } = useSelector((state: RootState) => state.modal);

  return (
    <SessionProvider>
      <ThemeProvider
        storageKey="theme"
        defaultTheme="system"
        enableSystem
        enableColorScheme
        disableTransitionOnChange
        attribute="class"
      >
        <AuthStateListenerWrapper>
          <QueryClientProvider client={queryClient}>
            <NextTopLoader
              color="#ea580c"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #2299DD,0 0 5px #2299DD"
              template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
              zIndex={1600}
              showAtBottom={false}
            />
            {/* toast */}
            <Toast />
            {/* modal */}
            <Modal modalId="globalModal" isOpen={isOpen} width="500px">
              {content}
            </Modal>
            {children}
          </QueryClientProvider>
        </AuthStateListenerWrapper>
      </ThemeProvider>
    </SessionProvider>
  );
};

// Hacemos uso de useAuthStateListener dentro de un componente envuelto por SessionProvider
const AuthStateListenerWrapper = ({ children }: { children: React.ReactNode }) => {
  useAuthStateListener();
  return <>{children}</>;
};