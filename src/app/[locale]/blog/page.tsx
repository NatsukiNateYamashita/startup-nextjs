import { getAllPosts } from "@/lib/blog/markdown";
import Breadcrumb from "@/app/[locale]/components/Common/Breadcrumb";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "@/i18n/routing";
import BlogList from "@/app/[locale]/components/Blog/BlogList";
import { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "BlogPage" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
  };
}

const Blog = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("BlogPage");

  // マークダウンファイルから記事を取得
  const blogPosts = await getAllPosts(locale as Locale);

  return (
    <>
      <Breadcrumb 
        pageName={t("title")} 
        description={t("description")} 
      />

      <section className="pt-[120px] pb-[120px]">
        <BlogList posts={blogPosts} locale={locale as Locale} />
      </section>
    </>
  );
};

export default Blog;
