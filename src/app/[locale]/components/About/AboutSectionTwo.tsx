import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function AboutSectionTwo({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div
              className="relative mx-auto mb-12 aspect-25/24 max-w-[500px] text-center lg:m-0"
              data-wow-delay=".15s"
            >
              <Image
                src="/images/about/about-image-2.svg"
                alt="about image"
                fill
                className="drop-shadow-three dark:hidden dark:drop-shadow-none"
              />
              <Image
                src="/images/about/about-image-2-dark.svg"
                alt="about image"
                fill
                className="drop-shadow-three hidden dark:block dark:drop-shadow-none"
              />
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[470px]">
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl dark:text-white">
                  {t("sectionTwo.item1.title")}
                </h3>
                <p className="text-body-color/80 dark:text-body-color-dark/80 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed">
                  {t("sectionTwo.item1.paragraph")}
                </p>
              </div>
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl dark:text-white">
                  {t("sectionTwo.item2.title")}
                </h3>
                <p className="text-body-color/80 dark:text-body-color-dark/80 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed">
                  {t("sectionTwo.item2.paragraph")}
                </p>
              </div>
              <div className="mb-1">
                <h3 className="mb-4 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl dark:text-white">
                  {t("sectionTwo.item3.title")}
                </h3>
                <p className="text-body-color/80 dark:text-body-color-dark/80 text-base leading-relaxed font-medium sm:text-lg sm:leading-relaxed">
                  {t("sectionTwo.item3.paragraph")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
