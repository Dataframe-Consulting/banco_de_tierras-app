import "./styles/globals.css";
import { AuthComponent } from "./shared/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banco de Tierras",
  description:
    "Este es el portal de administración de proyectos, propiedades y rentas de la empresa Banco de Tierras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthComponent>{children}</AuthComponent>
      </body>
    </html>
  );
}
