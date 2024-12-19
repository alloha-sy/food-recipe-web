import type { Metadata } from "next";
import { Noto_Sans_TC, Playfair_Display, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Layout from "./components/Layout";
// 防止 Font Awesome 圖標閃爍
config.autoAddCss = false;

// 主要文字字體
const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
});

// 標題字體
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

// 等寬字體（用於程式碼等）
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "美食分享",
  description: "分享美食，探索美味",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body
        className={`${notoSansTC.variable} ${playfair.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
