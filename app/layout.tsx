import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import UseApp from "./UseApp";
import AsideLeft from "@/components/AsideLeft";
import NavbarBottom from "@/components/NavbarBottom";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexum",
  description: "Social networking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UseApp>
          {/* content */}
          <div id="content-wrapper" className="bg-white dark:bg-neutral-900 duration-300 w-full min-h-dvh">
            <div className="w-full max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-[_250px_1fr_] min-h-dvh">
              <AsideLeft />
              <div role="main" id="content-wrapper-child" className='w-full grid gap-8 grid-cols-1 xl:grid-cols-[_1fr_350px_]'>
                {children}
              </div>
            </div>
            <NavbarBottom />
          </div>
        </UseApp>
      </body>
    </html>
  );
}
