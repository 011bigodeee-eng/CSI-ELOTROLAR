import type { Metadata } from "next";
import localFont from "next/font/local";
const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
});
import "./globals.css";
import "./premium.css";
import "./intro.css";
import "./hero-evolution.css";
import "./premium-v2.css";
import { BrandIntro } from "@/components/brand-intro";
import { INTRO_BOOTSTRAP, INTRO_CRITICAL_CSS } from "@/lib/intro";
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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <style
          id="csi-intro-critical"
          dangerouslySetInnerHTML={{ __html: INTRO_CRITICAL_CSS }}
        />
        <script
          id="csi-intro-bootstrap"
          dangerouslySetInnerHTML={{ __html: INTRO_BOOTSTRAP }}
        />
      </head>
      <body className={manrope.variable}>
        <BrandIntro />
        <div id="csi-site-shell" suppressHydrationWarning>
          <StoreProvider>
            <SiteShell>{children}</SiteShell>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
