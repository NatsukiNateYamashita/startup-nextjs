import { getTranslations } from "next-intl/server";
import PricingClient from "./PricingClient";

const Pricing = async ({ locale }: { locale: string }) => {
  const t = await getTranslations({ locale, namespace: "PricingPage" });

  const plans = [
    {
      name: t("plans.lite.name"),
      subtitle: t("plans.lite.subtitle"),
      offers: [
        { text: t("offer.allUI"), status: "active" as const },
        { text: t("offer.unlimited"), status: "active" as const },
        { text: t("offer.commercial"), status: "active" as const },
        { text: t("offer.email"), status: "active" as const },
        { text: t("offer.lifetime"), status: "inactive" as const },
        { text: t("offer.updates"), status: "inactive" as const },
      ],
      priceMonthly: "40",
      priceYearly: "120",
      durationMonthly: "mo",
      durationYearly: "yr",
    },
    {
      name: t("plans.basic.name"),
      subtitle: t("plans.basic.subtitle"),
      offers: [
        { text: t("offer.allUI"), status: "active" as const },
        { text: t("offer.unlimited"), status: "active" as const },
        { text: t("offer.commercial"), status: "active" as const },
        { text: t("offer.email"), status: "active" as const },
        { text: t("offer.lifetime"), status: "active" as const },
        { text: t("offer.updates"), status: "inactive" as const },
      ],
      priceMonthly: "399",
      priceYearly: "789",
      durationMonthly: "mo",
      durationYearly: "yr",
    },
    {
      name: t("plans.plus.name"),
      subtitle: t("plans.plus.subtitle"),
      offers: [
        { text: t("offer.allUI"), status: "active" as const },
        { text: t("offer.unlimited"), status: "active" as const },
        { text: t("offer.commercial"), status: "active" as const },
        { text: t("offer.email"), status: "active" as const },
        { text: t("offer.lifetime"), status: "active" as const },
        { text: t("offer.updates"), status: "active" as const },
      ],
      priceMonthly: "589",
      priceYearly: "999",
      durationMonthly: "mo",
      durationYearly: "yr",
    },
  ];

  return (
    <PricingClient
      title={t("title")}
      paragraph={t("paragraph")}
      monthlyLabel={t("monthly")}
      yearlyLabel={t("yearly")}
      plans={plans}
    />
  );
};

export default Pricing;
