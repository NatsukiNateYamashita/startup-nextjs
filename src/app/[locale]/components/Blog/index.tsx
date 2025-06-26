import { getTranslations } from "next-intl/server";
import SectionTitle from "../Common/SectionTitle";
import SingleBlog from "./SingleBlog";

interface BlogProps {
  locale: string;
}

const Blog = async ({ locale }: BlogProps) => {
  const t = await getTranslations({ locale, namespace: "BlogPage" });
  const blogData = [
    {
      id: 1,
      title: t("blog1.title"),
      paragraph: t("blog1.paragraph"),
      image: "/images/blog/blog-01.jpg",
      author: {
        name: t("blog1.author"),
        image: "/images/blog/author-01.png",
        designation: t("blog1.designation"),
      },
      tags: [t("blog1.tag")],
      publishDate: t("blog1.date"),
    },
    {
      id: 2,
      title: t("blog2.title"),
      paragraph: t("blog2.paragraph"),
      image: "/images/blog/blog-02.jpg",
      author: {
        name: t("blog2.author"),
        image: "/images/blog/author-02.png",
        designation: t("blog2.designation"),
      },
      tags: [t("blog2.tag")],
      publishDate: t("blog2.date"),
    },
    {
      id: 3,
      title: t("blog3.title"),
      paragraph: t("blog3.paragraph"),
      image: "/images/blog/blog-03.jpg",
      author: {
        name: t("blog3.author"),
        image: "/images/blog/author-03.png",
        designation: t("blog3.designation"),
      },
      tags: [t("blog3.tag")],
      publishDate: t("blog3.date"),
    },
  ];
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
          {blogData.map((blog) => (
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
