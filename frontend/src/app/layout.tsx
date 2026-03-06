import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StoreProvider } from "@/store/provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaxFlow Advisor",
  description: "Plataforma de diagnóstico empresarial e eficiência fiscal",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <svg width="0" height="0" className="absolute">
          <defs>
            <filter
              id="liquid-prism-intense"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              filterUnits="objectBoundingBox"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.001 0.005"
                numOctaves={1}
                seed={17}
                result="turbulence"
              />
              <feComponentTransfer in="turbulence" result="mapped">
                <feFuncR
                  type="gamma"
                  amplitude={1}
                  exponent={10}
                  offset={0.5}
                />
                <feFuncG type="gamma" amplitude={0} exponent={1} offset={0} />
                <feFuncB type="gamma" amplitude={0} exponent={1} offset={0.5} />
              </feComponentTransfer>
              <feGaussianBlur in="turbulence" stdDeviation={3} result="softMap" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="softMap"
                scale={200}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <StoreProvider>
            {children}
            <Toaster richColors position="top-right" />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
