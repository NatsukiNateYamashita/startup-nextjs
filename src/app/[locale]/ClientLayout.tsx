"use client";

import Header from "@/app/[locale]/components/Header";
import ScrollToTop from "@/app/[locale]/components/ScrollToTop";
import AuthProvider from "@/app/[locale]/components/Auth/AuthProvider";
import { Providers } from "./providers";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Providers>
        <Header />
        {children}
        <ScrollToTop />
      </Providers>
    </AuthProvider>
  );
}
