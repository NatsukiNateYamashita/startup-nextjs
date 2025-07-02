import { getTranslations, setRequestLocale } from "next-intl/server";

import Pricing from "@/app/[locale]/components/Pricing";
import Breadcrumb from "@/app/[locale]/components/Common/Breadcrumb";
import { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PricingPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    // other metadata
  };
}

const PricingPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale: locale, namespace: "PricingPage" });
  return (
    <>
      <Breadcrumb pageName="Pricing" description={t("description")} />
\      <Pricing locale={locale} />
    </>
  );
};

export default PricingPage;
