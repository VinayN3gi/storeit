import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import {AuthProvider} from "@/provider/AuthContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});


export const metadata: Metadata = {
  title: "MyStore",
  description: "A storage solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-poppins antialiased`}
      >
        <time dateTime="2016-10-25" suppressHydrationWarning />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
