import Link from "next/link";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ErrorPage" });

  return {
    title: t("authError"),
    description: t("authErrorDescription"),
  };
}

const AuthErrorPage = async ({ params, searchParams }: Props) => {
  const { locale } = await params;
  const { error } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ErrorPage" });

  // エラーの種類によってメッセージを変更
  let errorTitle = t("authError");
  let errorDescription = t("authErrorDescription");

  switch (error) {
    case "AccessDenied":
      errorTitle = t("accessDenied");
      errorDescription = t("accessDeniedDescription");
      break;
    case "Configuration":
      errorTitle = "設定エラー";
      errorDescription = "認証設定に問題があります。管理者にお問い合わせください。";
      break;
    case "Verification":
      errorTitle = "認証エラー";
      errorDescription = "メールアドレスの認証に失敗しました。";
      break;
    default:
      errorTitle = t("authError");
      errorDescription = t("authErrorDescription");
  }

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
                    <circle
                      opacity="0.8"
                      cx="227.5"
                      cy="81.5"
                      r="68.5"
                      fill="var(--color-primary)"
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
                        fill="var(--color-primary)"
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
                  {errorTitle}
                </h3>
                <p className="mb-10 text-base font-medium leading-relaxed text-body-color/80 dark:text-body-color-dark/80 sm:text-lg sm:leading-relaxed">
                  {errorDescription}
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href="/signin"
                    className="px-8 py-3 text-base font-bold text-white duration-300 rounded-md bg-primary shadow-signUp hover:bg-white hover:text-primary md:px-9 lg:px-8 xl:px-9"
                  >
                    再試行
                  </Link>
                  <Link
                    href="/"
                    className="px-8 py-3 text-base font-bold text-primary duration-300 rounded-md border border-primary hover:bg-primary hover:text-white md:px-9 lg:px-8 xl:px-9"
                  >
                    {t("backToHomepage")}
                  </Link>
                </div>
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
                <stop stopColor="var(--color-primary)" stopOpacity="0" />
                <stop offset="1" stopColor="var(--color-primary)" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_116:1140"
                x1="179.141"
                y1="209.062"
                x2="32.6026"
                y2="145.47"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--color-primary)" />
                <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default AuthErrorPage;
