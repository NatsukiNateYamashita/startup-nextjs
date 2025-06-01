import AboutSectionOne from "@/app/[locale]/components/About/AboutSectionOne";
import AboutSectionTwo from "@/app/[locale]/components/About/AboutSectionTwo";
import Breadcrumb from "@/app/[locale]/components/Common/Breadcrumb";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "About Page | Free Next.js Template for Startup and SaaS",
  description: "This is About Page for Startup Nextjs Template",
  // other metadata
};

const AboutPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  return (
    <>
      <Breadcrumb
        pageName={t("pageName")}
        description={t("description")}
        locale={locale}
      />
      <AboutSectionOne locale={locale} />
      <AboutSectionTwo locale={locale} />
    </>
  );
};

export default AboutPage;
