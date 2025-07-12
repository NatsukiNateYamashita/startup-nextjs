// 🚀 ダッシュボードページ - プロフィール完成システム統合版
// 作成日: 2025-07-11
// 更新日: 2025-01-27
// 説明: 認証後のダッシュボード + プログレッシブ・プロフィール完成システム

import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "../components/Auth/LogoutButton";
import ProfileProgress from "../components/Dashboard/ProfileProgress";
import QuickProfileForm from "../components/Dashboard/QuickProfileForm";
import { PrismaClient } from "@prisma/client";
import { getNextSteps } from "@/lib/constants/user-profile";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DashboardPage" });

  return {
    title: t("title"),
    description: t("description"),
    // other metadata
  };
}

const DashboardPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  
  // セッション確認
  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/${locale}/signin`);
  }

  // ユーザーデータを取得
  const prisma = new PrismaClient();
  const userData = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      experience: true,
      japanese_language_level: true,
      interests: true,
      learningGoals: true,
      pain_points: true,
      goals: true,
      budget_range: true,
      is_educator: true,
      age: true,
      occupation: true,
      location: true,
      timezone: true,
      profile_completion: true,
      profile_last_updated: true,
      region: true,
      native_language: true,
      available_languages: true,
      device_type: true,
      access_pattern: true,
      decision_maker: true,
    },
  });

  await prisma.$disconnect();

  // ユーザーが見つからない場合
  if (!userData) {
    redirect(`/${locale}/signin`);
  }

  // 次のステップを計算
  const nextSteps = getNextSteps(userData);

  // 翻訳取得
  const t = await getTranslations("DashboardPage");

  return (
    <>
      <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three dark:bg-dark mx-auto max-w-[800px] rounded-sm bg-white px-6 py-10 sm:p-[60px]">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-black dark:text-white">
                    {t("welcomeTitle")}
                  </h1>
                  <LogoutButton />
                </div>
                
                {/* プロフィール完成システム */}
                <ProfileProgress user={userData} locale={locale} />
                <QuickProfileForm 
                  user={userData} 
                  nextSteps={nextSteps}
                  locale={locale}
                />

                <div className="mb-8 rounded-sm bg-gradient-to-r from-primary/10 to-primary/5 p-6">
                  <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                    {t("welcomeMessage", { 
                      name: session.user?.name || session.user?.email?.split('@')[0] || 'User' 
                    })}
                  </h2>
                  <p className="text-body-color dark:text-body-color-dark">
                    {t("loginSuccessMessage")}
                  </p>
                </div>

                {/* ユーザー情報表示 */}
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                    {t("accountInfo.title")}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">{t("accountInfo.email")}:</span>
                      <span className="text-body-color dark:text-body-color-dark">
                        {session.user?.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("accountInfo.userId")}:</span>
                      <span className="text-body-color dark:text-body-color-dark font-mono text-sm">
                        {session.user?.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("accountInfo.currentPlan")}:</span>
                      <span className="text-primary font-semibold">
                        {session.user?.currentPlan || 'FREE'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 今後の実装予定機能 */}
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                    {t("upcomingFeatures.title")}
                  </h3>
                  <ul className="space-y-2 text-body-color dark:text-body-color-dark">
                    <li>• {t("upcomingFeatures.profileManagement")}</li>
                    <li>• {t("upcomingFeatures.languageSkills")}</li>
                    <li>• {t("upcomingFeatures.subscriptionManagement")}</li>
                    <li>• {t("upcomingFeatures.usageHistory")}</li>
                    <li>• {t("upcomingFeatures.aiLearningTools")}</li>
                  </ul>
                </div>

                {/* テスト用情報 */}
                <div className="rounded-sm border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <h4 className="mb-2 font-semibold text-black dark:text-white">
                    {t("developerInfo.title")}
                  </h4>
                  <pre className="text-xs text-body-color dark:text-body-color-dark overflow-auto">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 背景装飾 */}
        <div className="absolute left-0 top-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--color-primary)" />
                <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
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

export default DashboardPage;
