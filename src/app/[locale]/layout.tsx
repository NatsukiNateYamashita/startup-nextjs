import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Inter } from "next/font/google";
import "@/app/[locale]/styles/index.css";
import ClientLayout from "@/app/[locale]/ClientLayout";

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
  console.log("layout.tsx locale:", locale);
  console.log("layout.tsx messages:", messages);
  return (
    <html suppressHydrationWarning lang={locale}>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

