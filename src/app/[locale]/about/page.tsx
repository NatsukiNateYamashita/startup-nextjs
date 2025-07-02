import { getTranslations, setRequestLocale } from "next-intl/server";

import AboutSectionOne from "@/app/[locale]/components/About/AboutSectionOne";
import AboutSectionTwo from "@/app/[locale]/components/About/AboutSectionTwo";
import AboutSectionDeveloper from "@/app/[locale]/components/About/AboutSectionDeveloper";
import Breadcrumb from "@/app/[locale]/components/Common/Breadcrumb";
import Features from "@/app/[locale]/components/Features";
import { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    // other metadata
  };
}

const AboutPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale: locale, namespace: "AboutPage" });
  return (
    <>
      <Breadcrumb pageName="About" description={t("description")} />
      <Features locale={locale} />
      <AboutSectionOne locale={locale} />
      <AboutSectionTwo locale={locale} />
      <AboutSectionDeveloper locale={locale} />
    </>
  );
};

export default AboutPage;
