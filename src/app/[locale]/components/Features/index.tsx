import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";
import { getTranslations } from "next-intl/server";

export default async function Features({ locale }: { locale: string }) {
  const t = await getTranslations({ locale: locale, namespace: "FeaturesPage" });
  return (
    <section id="features" className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle title={t("title")} paragraph={t("paragraph")} center />
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {featuresData.map((feature) => (
            <SingleFeature
              key={feature.id}
              icon={feature.icon}
              title={t(feature.titleKey)}
              paragraph={t(feature.paragraphKey)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};


