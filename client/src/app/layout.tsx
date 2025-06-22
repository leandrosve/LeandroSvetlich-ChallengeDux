import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primeflex/themes/primeone-light.css";

import { PrimeReactProvider } from "primereact/api";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { ToastProvider } from "@/context/ToastContext";
import ToastNotification from "@/components/layout/ToastNotification";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Dux Software: El Sistema de Gestión para tu Negocio",
  description:
    "Simplificá la gestión de tu negocio con Dux Software. Administrá ventas y potenciá tus ganancias.",
  icons: {
    icon: "/icons/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PrimeReactProvider>
      <ToastProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} flex flex-column`}
          >
            <Header />
            <div className="flex align-self-stretch align-items-stretch flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
            <ToastNotification />
          </body>
        </html>
      </ToastProvider>
    </PrimeReactProvider>
  );
}
