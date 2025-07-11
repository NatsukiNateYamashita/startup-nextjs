import { getTranslations, setRequestLocale } from "next-intl/server";
import { extractSentencesWithTag, mapBilingualSentencesWithTag } from "@/lib/blog/compare";
import { createMarkdownProcessor } from "@/lib/blog/markdown";
import fs from "fs/promises";
import path from "path";
import type { Metadata } from "next";
import CompareClient from "./CompareClient";
import ScrollToTop from "@/app/[locale]/components/ScrollToTop";
import CompareToggleButton from "@/app/[locale]/components/CompareToggleButton";


// markdown の h1/h2 を抽出するユーティリティ
function extractHeaders(md: string) {
  const lines = md.split("\n");
  let h1 = "";
  let h2 = "";
  for (const line of lines) {
    if (!h1 && /^# (.+)/.test(line)) h1 = line.replace(/^# /, "").trim();
    if (!h2 && /^## (.+)/.test(line)) h2 = line.replace(/^## /, "").trim();
    if (h1 && h2) break;
  }
  return { h1, h2 };
}

// Next.js 15の型エラー回避: Promiseベースのprops型定義
type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ComparePage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const locale = params.locale;
  setRequestLocale(locale);
  // 型安全なstring取得
  const leftLang = Array.isArray(searchParams?.left) ? searchParams.left[0] : searchParams?.left || "ja";
  const rightLang = Array.isArray(searchParams?.right) ? searchParams.right[0] : searchParams?.right || "en";
  const slug = params.slug;
  const baseDir = path.join(process.cwd(), "src/content/blog/posts", slug);
  const leftPath = path.join(baseDir, `${leftLang}.md`);
  const rightPath = path.join(baseDir, `${rightLang}.md`);
  const [leftMdRaw, rightMdRaw] = await Promise.all([
    fs.readFile(leftPath, "utf-8"),
    fs.readFile(rightPath, "utf-8"),
  ]);
  // 文ごとにタグも抽出
  const leftSentences = extractSentencesWithTag(leftMdRaw);
  const rightSentences = extractSentencesWithTag(rightMdRaw);
  const bilingual = mapBilingualSentencesWithTag(leftSentences, rightSentences);
  // 各文をmarkdown→HTML化
  const processor = createMarkdownProcessor(slug);
  const bilingualHtml = await Promise.all(
    bilingual.map(async (s) => ({
      ...s,
      left: s.left ? (await processor.process(s.left)).toString() : "",
      right: s.right ? (await processor.process(s.right)).toString() : "",
    }))
  );
  

  return (
    <>
      <CompareClient
        leftLang={leftLang}
        rightLang={rightLang}
        bilingual={bilingualHtml}
        slug={slug}
        locale={locale}
      />
      {/* 背景グラフィック */}
      <div>
        <span className="absolute top-0 left-0 z-[-1]">
          <svg
            width="287"
            height="254"
            viewBox="0 0 287 254"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.1"
              d="M286.5 0.5L-14.5 254.5V69.5L286.5 0.5Z"
              fill="url(#paint0_linear_111:578)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_111:578"
                x1="-40.5"
                y1="117"
                x2="301.926"
                y2="-97.1485"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--color-primary)" />
                <stop
                  offset="1"
                  stopColor="var(--color-primary)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="absolute top-0 right-0 z-[-1]">
          <svg
            width="628"
            height="258"
            viewBox="0 0 628 258"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.1"
              d="M669.125 257.002L345.875 31.9983L524.571 -15.8832L669.125 257.002Z"
              fill="url(#paint0_linear_0:1)"
            />
            <path
              opacity="0.1"
              d="M0.0716344 182.78L101.988 -15.0769L142.154 81.4093L0.0716344 182.78Z"
              fill="url(#paint1_linear_0:1)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_0:1"
                x1="644"
                y1="221"
                x2="429.946"
                y2="37.0429"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--color-primary)" />
                <stop
                  offset="1"
                  stopColor="var(--color-primary)"
                  stopOpacity="0"
                />
              </linearGradient>
              <linearGradient
                id="paint1_linear_0:1"
                x1="18.3648"
                y1="166.016"
                x2="105.377"
                y2="32.3398"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--color-primary)" />
                <stop
                  offset="1"
                  stopColor="var(--color-primary)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
      {/* フローティングボタン群 */}
      <div className="fixed right-8 bottom-20 z-99">
        {/* 対訳ボタン */}
        <CompareToggleButton locale={locale} slug={slug} />

        {/* ScrollToTopボタン */}
        <ScrollToTop />
      </div>
    </>
  ); 
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale });
  return {
    title: t("Compare.title", { slug: params.slug }),
    description: t("Compare.description"),
  };
}
