import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "내 월급으로 어디까지? | 월세 & 차량 & 저축 계산기",
  description:
    "월급과 연봉에 맞는 적정 월세, 차량 가격, 저축액을 계산해보세요. 한국 직장인을 위한 무료 재정 가이드.",
  keywords: ["월세 계산기", "차량 추천", "저축 플래너", "재정 계획", "월급", "연봉", "복리 계산"],
  openGraph: {
    title: "내 월급으로 어디까지?",
    description: "월급에 맞는 적정 월세, 차량, 저축액을 알아보세요",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "내 월급으로 어디까지? - 월세, 차량, 저축 계산기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "내 월급으로 어디까지?",
    description: "월급에 맞는 적정 월세, 차량, 저축액을 알아보세요",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
