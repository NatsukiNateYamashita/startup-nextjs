"use client";

import Header from "@/app/[locale]/components/Header";
import Footer from "@/app/[locale]/components/Footer";
import ScrollToTop from "@/app/[locale]/components/ScrollToTop";
import { Providers } from "./providers";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      {children}
      <Footer />
      <ScrollToTop />
    </Providers>
  );
}
