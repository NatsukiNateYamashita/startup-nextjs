import { Blog } from "@/app/[locale]/types/blog";
import { getTranslations } from "next-intl/server";

const getBlogData = async (locale: string): Promise<Blog[]> => {
  const t = await getTranslations({ locale, namespace: "BlogPage" });

  return [
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
};

export default getBlogData;
