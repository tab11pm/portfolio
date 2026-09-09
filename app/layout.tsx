import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Табрез Шонизоров — разработчик",
  description: "Персональный сайт разработчика Табреза Шонизорова.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <header><Link href="/">Табрез Шонизоров</Link></header>
        <main>{children}</main>
        <footer>Портфолио разработчика</footer>
      </body>
    </html>
  );
}
