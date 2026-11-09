import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  metadataBase: new URL("https://brasaland.com"),
  title: "Brasaland | Sabor que reúne",
  description:
    "Desde 2008, carnes a la brasa con sabor y calidad constante en Colombia y Florida. Conoce Brasa Points.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Brasaland | El sabor de la brasa, en cada bocado",
    description: "14 restaurantes en Colombia y Florida. Descubre Brasa Points.",
    locale: "es_CO",
    type: "website",
    images: [{ url: "/grill.jpg", width: 1200, height: 800, alt: "Carnes a la brasa Brasaland" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${dmSans.variable} ${fraunces.variable}`}>
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        {children}
      </body>
    </html>
  );
}