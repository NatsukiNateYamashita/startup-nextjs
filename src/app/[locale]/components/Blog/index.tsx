import { getTranslations } from "next-intl/server";
import SectionTitle from "../Common/SectionTitle";
import SingleBlog from "./SingleBlog";
import { getAllPosts } from "@/lib/blog/markdown";
import { Locale } from "@/i18n/routing";

interface BlogProps {
  locale: Locale;
}

const Blog = async ({ locale }: BlogProps) => {
  const t = await getTranslations({ locale, namespace: "BlogPage" });
  
  // マークダウンファイルから記事を取得
  const blogPosts = await getAllPosts(locale);
  
  // 最新3記事を表示用に取得
  const displayPosts = blogPosts.slice(0, 3);

  return (
    <section
      id="blog"
      className="bg-gray-light/50 dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title={t("title")}
          paragraph={t("paragraph")}
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {displayPosts.map((blog) => (
            <div key={blog.id} className="w-full">
              <SingleBlog blog={blog} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
