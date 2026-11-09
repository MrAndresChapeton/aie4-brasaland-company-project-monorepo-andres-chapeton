import type { Metadata } from "next";
import Home from "../page";

export const metadata: Metadata = {
  title: "Registro Brasa Points | Brasaland",
  alternates: { canonical: "/registro" },
  robots: { index: false, follow: true },
};

export default function RegistrationPage() {
  return <Home />;
}