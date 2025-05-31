import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import AboutSectionOne from "@/app/[locale]/components/About/AboutSectionOne";
import AboutSectionTwo from "@/app/[locale]/components/About/AboutSectionTwo";
import Blog from "@/app/[locale]/components/Blog";
import Brands from "@/app/[locale]/components/Brands";
import ScrollUp from "@/app/[locale]/components/Common/ScrollUp";
import Contact from "@/app/[locale]/components/Contact";
import Features from "@/app/[locale]/components/Features";
import Hero from "@/app/[locale]/components/Hero";
import Pricing from "@/app/[locale]/components/Pricing";
import Testimonials from "@/app/[locale]/components/Testimonials";
import Video from "@/app/[locale]/components/Video";
import { Metadata } from "next";
// import { locales } from "@/i18n/routing";

// export async function generateStaticParams() {
//   return locales.map((locale) => ({ locale }));
// }

export const metadata: Metadata = {
  title: "Free Next.js Template for Startup and SaaS",
  description: "This is Home for Startup Nextjs Template",
  // other metadata
};

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale: locale, namespace: "HomePage" });
  // console.log("page.tsx t('title'):", t("title"));
  return (
    <>
      <ScrollUp />
      <Hero locale={locale} />
      <Features locale={locale} />
      <Video locale={locale} />
      <Brands />
      <AboutSectionOne locale={locale} />
      <AboutSectionTwo locale={locale} />
      <Testimonials locale={locale} />
      <Pricing locale={locale} />
      <Blog locale={locale} />
      <Contact locale={locale} />
    </>
  );
}
