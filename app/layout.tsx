import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import { Montserrat } from "next/font/google";
import { QuizHeader } from "@/app/features/quiz/components/quiz-header";
import { QuizFooter } from "@/app/features/quiz/components/quiz-footer";
import "./globals.css";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OOCA | A moment to reflect",
  description: "A short, thoughtful pause for your next decision.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <QuizHeader />
          {children}
          <QuizFooter />
        </Providers>
      </body>
    </html>
  );
}
