import { getTranslations, setRequestLocale } from "next-intl/server";

import Breadcrumb from "@/app/[locale]/components/Common/Breadcrumb";
import Contact from "@/app/[locale]/components/Contact";

import { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    // other metadata
  };
}

const ContactPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ContactPage" });
  return (
    <>
      <Breadcrumb pageName="Contact" description={t("description")} />

      <Contact locale={locale} />
    </>
  );
};

export default ContactPage;
