import { getTranslations } from "next-intl/server";
import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";
import VideoPlayButton from "./VideoPlayButton";

export default async function Video({ locale }: { locale: string }) {
  const t = await getTranslations({ locale: locale, namespace: "VideoPage" });

  return (
    <section className="relative z-10 py-16  bg-white pb-16 pt-[120px] dark:bg-gray-dark md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Video for Quick Start"
          paragraph={t("paragraph")}
          center
          mb="80px"
        />
      </div>
      <div className="relative overflow-hidden">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[770px] overflow-hidden rounded-md">
              <div className="relative aspect-77/40 items-center justify-center">
                <Image
                  src="/images/video/image.png"
                  alt="video image"
                  className="object-cover"
                  fill
                />
                <VideoPlayButton />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 left-0 z-[-1] h-full w-full bg-[url(/images/video/shape.svg)] bg-cover bg-center bg-no-repeat"></div>
      </div>
    </section>
  );
}
