import { Inter } from "next/font/google";
import { cn } from "./components/lib/utils";
import "./globals.css";
import HydrationZustand from "@/components/component/HydrationZustand";

const fontHeading = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      >
        <HydrationZustand>{children}</HydrationZustand>
      </body>
    </html>
  );
}
