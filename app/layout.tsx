import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import UseApp from "./UseApp";
import NavbarTop from "@/components/NavbarTop";
import AsideLeft from "@/components/AsideLeft";

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
        {/* Wrap the whole content under 'UseApp' component */}
        <UseApp>
          <NavbarTop />
          {/* content */}
          <div role="main" id="content-wrapper" className="bg-white dark:bg-neutral-900 duration-200 w-full">
            <div className="w-full max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-[_250px_1fr_] gap-3">
              <AsideLeft />
              {/* children contendrá 2 subcontenedores, que será un grid de 2 columnas */}
              {/*
              every child page (children) should look like the following:
                return(
                  <>
                    <div>main content</div>
                    <AsideRight>
                      <div>aside right content</div>
                    </AsideRight>
                  </>
                )
            */}
              <div className='w-full grid gap-3 grid-cols-1 lg:grid-cols-[_1fr_300px_]'>
                {children}
              </div>
            </div>
          </div>
        </UseApp>
      </body>
    </html>
  );
}
