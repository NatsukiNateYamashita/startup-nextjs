import { Blog } from "@/app/[locale]/types/blog";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const SingleBlog = async ({ blog, locale }: { blog: Blog, locale: string }) => {
  const t = await getTranslations("BlogPage");
  const { id, image, tags, publishDate } = blog;

  const blogTitleKey = `blog${id}.title`;
  const blogParagraphKey = `blog${id}.paragraph`;

  return (
    <>
      <div className="group shadow-one hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark relative overflow-hidden rounded-xs bg-white duration-300">
        <Link
          href={`/${locale}/blog-details`}
          className="relative block aspect-37/22 w-full"
        >
          <span className="bg-primary absolute top-6 right-6 z-20 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white capitalize">
            {tags[0]}
          </span>
          <Image src={image} alt="image" fill />
        </Link>
        <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
          <h3>
            <Link
              href={`/${locale}/blog-details`}
              className="hover:text-primary dark:hover:text-primary mb-4 block text-xl font-bold text-black sm:text-2xl dark:text-white"
            >
              {t(blogTitleKey)}
            </Link>
          </h3>
          <p className="border-body-color/10 text-body-color mb-6 border-b pb-6 text-base font-medium dark:border-white/10">
            {t(blogParagraphKey)}
          </p>
          <div className="flex items-center">
            <div className="border-body-color/10 mr-5 flex items-center border-r pr-5 xl:mr-3 xl:pr-3 2xl:mr-5 2xl:pr-5 dark:border-white/10">
              <div className="mr-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src={blog.author.image} alt="author" fill />
                </div>
              </div>
              <div className="w-full">
                <h4 className="text-dark mb-1 text-sm font-medium dark:text-white">
                  {t("by")} {blog.author.name}
                </h4>
                <p className="text-body-color text-xs">{blog.author.designation}</p>
              </div>
            </div>
            <div className="inline-block">
              <h4 className="text-dark mb-1 text-sm font-medium dark:text-white">
                {t("date")}
              </h4>
              <p className="text-body-color text-xs">{publishDate}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBlog;
