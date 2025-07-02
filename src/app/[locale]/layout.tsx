import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Inter } from "next/font/google";
import "@/app/[locale]/styles/index.css";
import ClientLayout from "@/app/[locale]/ClientLayout";
import Footer from "@/app/[locale]/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // ロケールごとにmessagesを読み込む
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  return (
    <html suppressHydrationWarning lang={locale}>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body suppressHydrationWarning className={`bg-[var(--color-white)] dark:bg-[var(--color-dark)] ${inter.className}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientLayout>
            {children}
          </ClientLayout>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

