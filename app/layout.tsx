import type { Metadata } from "next";
import { Gochi_Hand, Inter, Nunito } from "next/font/google";
import { Header } from "@/app/components/header";
import { Providers } from "@/app/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const gochiHand = Gochi_Hand({
  variable: "--font-gochi-hand",
  subsets: ["latin"],
  weight: "400",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: "900",
});

export const metadata: Metadata = {
  title: "mindfull | A moment to understand yourself",
  description: "A short, gentle self-reflection. No right or wrong answers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${gochiHand.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col overflow-x-hidden">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
