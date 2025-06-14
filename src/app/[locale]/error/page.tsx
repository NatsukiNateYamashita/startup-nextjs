import Link from "next/link";
import { Metadata } from "next";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "error" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    // other metadata
  };
}

const ErrorPage = async ({ params: { locale } }: Props) => {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "error" });
  return (
    <>
      <section className="relative z-10 pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[530px] text-center">
                <div className="mx-auto text-center mb-9">
                  <svg
                    className="w-full mx-auto text-center"
                    height="210"
                    viewBox="0 0 474 210"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.5"
                      d="M25 163.051H101.211V191H133.308V163.051H153V136.111H133.308V32H91.2871L25 136.577V163.051ZM101.831 136.111H58.8025V134.869L100.591 68.6445H101.831V136.111Z"
                      stroke="url(#paint0_linear_116:1137)"
                      strokeWidth="3"
                    />
                    <path
                      opacity="0.5"
                      d="M307 133.051H383.211V161H415.308V133.051H435V106.111H415.308V2H373.287L307 106.577V133.051ZM383.831 106.111H340.803V104.869L382.591 38.6445H383.831V106.111Z"
                      stroke="url(#paint1_linear_116:1137)"
                      strokeWidth="3"
                    />
                    <circle
                      opacity="0.8"
                      cx="227.5"
                      cy="81.5"
                      r="68.5"
                      fill="#4A6CF7"
                    />
                    <mask
                      id="mask0_116:1137"
                      style={{ maskType: "alpha" }}
                      maskUnits="userSpaceOnUse"
                      x="159"
                      y="13"
                      width="137"
                      height="137"
                    >
                      <circle
                        opacity="0.8"
                        cx="227.5"
                        cy="81.5"
                        r="68.5"
                        fill="#4A6CF7"
                      />
                    </mask>
                    <g mask="url(#mask0_116:1137)">
                      <circle
                        opacity="0.8"
                        cx="227.5"
                        cy="81.5"
                        r="68.5"
                        fill="url(#paint2_radial_116:1137)"
                      />
                      <g opacity="0.8" filter="url(#filter0_f_116:1137)">
                        <circle
                          cx="233.543"
                          cy="49.2645"
                          r="28.2059"
                          fill="white"
                        />
                      </g>
                    </g>
                    <path
                      d="M0 182H83.5V209H150.5V178H169.5V148.5C169.5 148.5 194 165 229.5 165C265 165 294 134.5 294 134.5V152H306.5H361V178H435V152H474"
                      stroke="white"
                      strokeOpacity="0.08"
                      strokeWidth="2"
                    />
                    <defs>
                      <filter
                        id="filter0_f_116:1137"
                        x="175.337"
                        y="-8.94141"
                        width="116.412"
                        height="116.412"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="BackgroundImageFix"
                          result="shape"
                        />
                        <feGaussianBlur
                          stdDeviation="15"
                          result="effect1_foregroundBlur_116:1137"
                        />
                      </filter>
                      <linearGradient
                        id="paint0_linear_116:1137"
                        x1="25"
                        y1="183"
                        x2="126.155"
                        y2="27.0837"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#4A6CF7" stopOpacity="0" />
                        <stop offset="1" stopColor="#4A6CF7" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_116:1137"
                        x1="307"
                        y1="153"
                        x2="408.155"
                        y2="-2.91631"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#4A6CF7" stopOpacity="0" />
                        <stop offset="1" stopColor="#4A6CF7" />
                      </linearGradient>
                      <radialGradient
                        id="paint2_radial_116:1137"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(227.5 81.5) rotate(90) scale(73.5368)"
                      >
                        <stop stopOpacity="0.47" />
                        <stop offset="1" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>
                <h3 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
                  {t("title")}
                </h3>
                <p className="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  {t("description")}
                </p>
                <Link
                  href="/"
                  className="px-8 py-3 text-base font-bold text-white duration-300 rounded-md bg-primary shadow-signUp hover:bg-white hover:text-primary md:px-9 lg:px-8 xl:px-9"
                >
                  {t("backToHomepage")}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 z-[-1] hidden sm:block">
          <svg
            width="406"
            height="286"
            viewBox="0 0 406 286"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.5">
              <rect
                opacity="0.5"
                x="56.25"
                y="110.344"
                width="116.719"
                height="116.438"
                stroke="url(#paint0_linear_116:1140)"
              />
              <rect
                opacity="0.1"
                x="56.25"
                y="110.344"
                width="116.719"
                height="116.438"
                fill="url(#paint1_linear_116:1140)"
              />
              <path
                opacity="0.5"
                d="M172.688 110.344L229.219 51V167.601L172.688 226.781V110.344Z"
                stroke="url(#paint2_linear_116:1140)"
              />
              <path
                opacity="0.1"
                d="M172.688 110.344L229.219 51V167.601L172.688 226.781V110.344Z"
                fill="url(#paint3_linear_116:1140)"
              />
              <path
                opacity="0.5"
                d="M0 169.619L56.25 110.344V226.85L0 286.125V169.619Z"
                stroke="url(#paint4_linear_116:1140)"
              />
              <path
                opacity="0.1"
                d="M0 169.619L56.25 110.344V226.85L0 286.125V169.619Z"
                fill="url(#paint5_linear_116:1140)"
              />
              <rect
                opacity="0.5"
                x="228.938"
                y="51.2812"
                width="119.25"
                height="116.438"
                stroke="url(#paint6_linear_116:1140)"
              />
              <rect
                opacity="0.1"
                x="228.938"
                y="51.2812"
                width="119.25"
                height="116.438"
                fill="url(#paint7_linear_116:1140)"
              />
              <path
                opacity="0.5"
                d="M347.906 51.2812L405 2V110.113L347.906 167.719V51.2812Z"
                stroke="url(#paint8_linear_116:1140)"
              />
              <path
                opacity="0.1"
                d="M347.906 51.2812L405 2V110.113L347.906 167.719V51.2812Z"
                fill="url(#paint9_linear_116:1140)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_116:1140"
                x1="49.0781"
                y1="112.313"
                x2="148.922"
                y2="131.859"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_116:1140"
                x1="179.141"
                y1="209.062"
                x2="32.6026"
                y2="145.47"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_116:1140"
                x1="172.688"
                y1="110.344"
                x2="220.198"
                y2="56.4069"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_116:1140"
                x1="178.694"
                y1="116.34"
                x2="228.212"
                y2="62.4026"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_116:1140"
                x1="0"
                y1="169.619"
                x2="50.1557"
                y2="113.682"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_116:1140"
                x1="55.6026"
                y1="206.125"
                x2="-1.92186"
                y2="142.533"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_116:1140"
                x1="228.938"
                y1="51.2812"
                x2="328.781"
                y2="70.8279"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint7_linear_116:1140"
                x1="359.008"
                y1="148.031"
                x2="212.469"
                y2="84.4391"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint8_linear_116:1140"
                x1="347.906"
                y1="51.2812"
                x2="395.416"
                y2="-2.65624"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint9_linear_116:1140"
                x1="353.912"
                y1="57.2766"
                x2="403.43"
                y2="3.33924"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default ErrorPage;
