import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/store";
import { SiteShell } from "@/components/shell";
export const metadata: Metadata = {
  title: {
    default: "CSI Eletrolar | Energia para transformar",
    template: "%s | CSI Eletrolar",
  },
  description:
    "Explore a prévia do catálogo CSI Eletrolar. Materiais elétricos, iluminação e climatização em um só lugar.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <StoreProvider>
          <SiteShell>{children}</SiteShell>
        </StoreProvider>
      </body>
    </html>
  );
}
