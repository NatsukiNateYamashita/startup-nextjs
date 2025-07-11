import { BlogPost, SearchHighlight } from "@/app/[locale]/types/blog";
import { Locale } from "@/i18n/routing";
import Image from "next/image";
import Link from "next/link";

const SingleBlog = ({ 
  blog, 
  locale, 
  searchHighlight 
}: { 
  blog: BlogPost; 
  locale: Locale; 
  searchHighlight?: SearchHighlight;
}) => {
  const { slug, title, excerpt, heroImage, tags, publishDate, author } = blog;

  // 簡易的な翻訳マップ
  const byText = {
    ja: '著者',
    en: 'By',
    'zh-CN': '作者', 
    'zh-TW': '作者'
  };

  // Helper function to highlight search terms
  const highlightText = (text: string, field: string): string => {
    if (!searchHighlight || !searchHighlight.highlights[field]) {
      return text;
    }
    return searchHighlight.highlights[field];
  };

  return (
    <>
      <div className="group shadow-one hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark relative overflow-hidden rounded-xs bg-white/80 backdrop-blur-sm duration-300">
        <Link
          href={`/${locale}/blog/${slug}`}
          className="relative block aspect-37/22 w-full"
        >
          <span className="bg-primary absolute top-6 right-6 z-20 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white capitalize">
            {tags[locale]?.[0] || 'Blog'}
          </span>
          <Image src={heroImage} alt={title[locale] || 'Blog post'} fill />
        </Link>
        <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
          <h3>
            <Link
              href={`/${locale}/blog/${slug}`}
              className="hover:text-primary dark:hover:text-primary mb-4 block text-xl font-bold text-body-color sm:text-2xl dark:text-body-color-dark"
            >
              {searchHighlight ? (
                <span dangerouslySetInnerHTML={{
                  __html: highlightText(title[locale] || 'Untitled', `title.${locale}`)
                }} />
              ) : (
                title[locale] || 'Untitled'
              )}
            </Link>
          </h3>
          <div className="border-body-color/10 text-body-color/80 mb-6 border-b pb-6 text-base font-medium dark:border-body-color-dark/10 dark:text-body-color-dark/80">
            {searchHighlight ? (
              <span dangerouslySetInnerHTML={{
                __html: highlightText(excerpt[locale] || '', `excerpt.${locale}`)
              }} />
            ) : (
              excerpt[locale] || ''
            )}
          </div>
          <div className="flex items-center">
            <div className="mr-5 flex items-center border-r border-body-color/10 pr-5 dark:border-body-color-dark/10">
              <div className="mr-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src={author.image} alt="author" fill />
                </div>
              </div>
              <div className="w-full">
                <h4 className="text-body-color mb-1 text-sm font-medium dark:text-body-color-dark">
                  {byText[locale]} {author.name[locale]}
                </h4>
                <p className="text-body-color/80 text-xs dark:text-body-color-dark/80">{author.designation[locale]}</p>
              </div>
            </div>
            <div className="inline-block">
              <h4 className="text-body-color mb-1 text-sm font-medium dark:text-body-color-dark">
                Date
              </h4>
              <p className="text-body-color/80 text-xs dark:text-body-color-dark/80">
                {new Date(publishDate).toLocaleDateString(locale)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBlog;
