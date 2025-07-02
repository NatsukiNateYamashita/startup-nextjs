import { getTranslations } from "next-intl/server";
import SectionTitle from "../Common/SectionTitle";

import { IconType } from "react-icons";

import { GrCertificate } from "react-icons/gr";
import { GiJapan } from "react-icons/gi";
import { AiOutlineOpenAI } from "react-icons/ai";
import { IoLanguage } from "react-icons/io5";

interface Developer {
  icon: IconType;
  titleKey: string;
  paragraphKey: string;
}
const developerData: Developer[] = [
  {
    icon: GrCertificate,
    titleKey: "developer1Title",
    paragraphKey: "developer1Paragraph",
  },
  {
    icon: GiJapan,
    titleKey: "developer2Title",
    paragraphKey: "developer2Paragraph",
  },
  {
    icon: AiOutlineOpenAI,
    titleKey: "developer3Title",
    paragraphKey: "developer3Paragraph",
  },
  {
    icon: IoLanguage,
    titleKey: "developer4Title",
    paragraphKey: "developer4Paragraph",
  },
];

interface SingleDeveloperProps {
  developerFeature: {
    icon: IconType;
    title: string;
    paragraph: string;
  };
}
const SingleDeveloperFeature = ({ developerFeature }: SingleDeveloperProps) => {
  const { icon: Icon, title, paragraph } = developerFeature;
  return (
    <div className="w-full">
      <div className="wow fadeInUp" data-wow-delay=".15s">
        <div className="bg-primary/10 text-primary mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-md">
          <Icon className="h-10 w-10" />
        </div>
        <h3 className="text-body-color dark:text-body-color-dark mb-5 text-xl font-bold sm:text-2xl lg:text-xl xl:text-2xl">
          {title}
        </h3>
        <p className="text-body-color/80 dark:text-body-color-dark/80 pr-[10px] text-base leading-relaxed font-medium">
          {paragraph}
        </p>
      </div>
    </div>
  );
};


export default async function developer({ locale }: { locale: string }) {
  const t = await getTranslations({
    locale: locale,
    namespace: "AboutPage.sectionDeveloper",
  });
  return (
    <section id="developer" className="py-20 lg:py-25 xl:py-30">
      <div className="container">
        <SectionTitle title="About Developer" paragraph={t("paragraph")} center />
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
          {developerData.map((developerFeature, key) => (
            <SingleDeveloperFeature
              key={key}
              developerFeature={{
                icon: developerFeature.icon,
                title: t(developerFeature.titleKey),
                paragraph: t(developerFeature.paragraphKey),
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
