import { getTranslations, setRequestLocale } from "next-intl/server";
import { extractSentencesWithTag, mapBilingualSentencesWithTag } from "@/lib/blog/compare";
import { createMarkdownProcessor } from "@/lib/blog/markdown";
import fs from "fs/promises";
import path from "path";
import type { Metadata } from "next";
import CompareClient from "./CompareClient";

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
  setRequestLocale(params.locale);
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
    <CompareClient
      leftLang={leftLang}
      rightLang={rightLang}
      bilingual={bilingualHtml}
      slug={slug}
    />
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale });
  return {
    title: t("Compare.title", { slug: params.slug }),
    description: t("Compare.description"),
  };
}
