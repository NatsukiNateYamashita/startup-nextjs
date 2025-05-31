import { getTranslations } from "next-intl/server";
import NewsLatterBoxClient from "./NewsLatterBoxClient";

const NewsLatterBox = async ({ locale }: { locale: string }) => {
  const t = await getTranslations({ locale, namespace: "ContactPage.newsletter" });
  return (
    <NewsLatterBoxClient
      title={t("title")}
      paragraph={t("paragraph")}
      namePlaceholder={t("namePlaceholder")}
      emailPlaceholder={t("emailPlaceholder")}
      subscribe={t("subscribe")}
      noSpam={t("noSpam")}
    />
  );
};

export default NewsLatterBox;
