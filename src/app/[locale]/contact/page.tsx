import Breadcrumb from "@/app/[locale]/components/Common/Breadcrumb";
import Contact from "@/app/[locale]/components/Contact";

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Contact Page | Free Next.js Template for Startup and SaaS",
  description: "This is Contact Page for Startup Nextjs Template",
  // other metadata
};

const ContactPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations("ContactPage");

  return (
    <>
      <Breadcrumb
        pageName={t("pageName")}
        description={t("description")}
        locale={locale}
      />

      <Contact locale={locale} />
    </>
  );
};

export default ContactPage;
