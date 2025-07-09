import { getMarkdownPost, getAllPosts } from "@/lib/blog/markdown";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "@/i18n/routing";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import SharePost from "@/app/[locale]/components/Blog/SharePost";
import TagButton from "@/app/[locale]/components/Blog/TagButton";
import NewsLatterBox from "@/app/[locale]/components/Contact/NewsLatterBox";
import BlogContent from "@/app/[locale]/components/Blog/BlogContent";
import ScrollToTop from "@/app/[locale]/components/ScrollToTop";
import CompareToggleButton from "@/app/[locale]/components/CompareToggleButton";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getMarkdownPost(slug, locale);

  if (!post) {
    return {
      title: "記事が見つかりません",
      description: "指定された記事は存在しません。",
    };
  }

  return {
    title: post.seoData.title[locale] || post.title[locale],
    description: post.seoData.description[locale] || post.excerpt[locale],
    openGraph: {
      title: post.title[locale],
      description: post.excerpt[locale],
      images: [post.heroImage],
      type: "article",
      publishedTime: post.publishDate,
      authors: [post.author.name[locale]],
      tags: post.tags[locale],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts('ja'); // 日本語をベースに取得
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const BlogDetailsPage = async ({ params }: Props) => {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getMarkdownPost(slug, locale);
  
  if (!post) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "BlogDetailsPage" });

  return (
    <>
      <section className="pt-[150px] pb-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                <h1 className="dark:text-body-color-dark mb-8 text-3xl leading-tight font-bold text-black sm:text-4xl sm:leading-tight">
                  {post.title[locale]}
                </h1>
                <div className="border-body-color/10 mb-10 flex flex-wrap items-center justify-between border-b pb-4 dark:border-white/10">
                  <div className="flex flex-wrap items-center">
                    <div className="mr-10 flex items-center">
                      <div className="mr-4">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image src={post.author.image} alt="author" fill />
                        </div>
                      </div>
                      <div className="w-full">
                        <h4 className="text-body-color dark:text-body-color-dark mb-1 text-sm font-medium">
                          {t('by')} {post.author.name[locale]}
                        </h4>
                        <p className="text-body-color/80 dark:text-body-color-dark/80 text-xs">
                          {post.author.designation[locale]}
                        </p>
                      </div>
                    </div>
                    <div className="mb-5 flex items-center">
                      <p className="text-body-color dark:text-body-color-dark mr-5 flex items-center text-sm font-medium">
                        <span className="mr-3">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            className="fill-current"
                          >
                            <path d="M3.89531 8.67529H3.10666C2.96327 8.67529 2.86768 8.77089 2.86768 8.91428V9.67904C2.86768 9.82243 2.96327 9.91802 3.10666 9.91802H3.89531C4.03871 9.91802 4.1343 9.82243 4.1343 9.67904V8.91428C4.1343 8.77089 4.03871 8.67529 3.89531 8.67529Z" />
                            <path d="M6.429 8.67529H5.64035C5.49696 8.67529 5.40137 8.77089 5.40137 8.91428V9.67904C5.40137 9.82243 5.49696 9.91802 5.64035 9.91802H6.429C6.57239 9.91802 6.66799 9.82243 6.66799 9.67904V8.91428C6.66799 8.77089 6.57239 8.67529 6.429 8.67529Z" />
                            <path d="M8.9627 8.67529H8.17405C8.03066 8.67529 7.93506 8.77089 7.93506 8.91428V9.67904C7.93506 9.82243 8.03066 9.91802 8.17405 9.91802H8.9627C9.10609 9.91802 9.20168 9.82243 9.20168 9.67904V8.91428C9.20168 8.77089 9.10609 8.67529 8.9627 8.67529Z" />
                            <path d="M11.4963 8.67529H10.7077C10.5643 8.67529 10.4687 8.77089 10.4687 8.91428V9.67904C10.4687 9.82243 10.5643 9.91802 10.7077 9.91802H11.4963C11.6397 9.91802 11.7353 9.82243 11.7353 9.67904V8.91428C11.7353 8.77089 11.6397 8.67529 11.4963 8.67529Z" />
                            <path d="M3.89531 11.1606H3.10666C2.96327 11.1606 2.86768 11.2562 2.86768 11.3996V12.1644C2.86768 12.3078 2.96327 12.4034 3.10666 12.4034H3.89531C4.03871 12.4034 4.1343 12.3078 4.1343 12.1644V11.3996C4.1343 11.2562 4.03871 11.1606 3.89531 11.1606Z" />
                            <path d="M6.429 11.1606H5.64035C5.49696 11.1606 5.40137 11.2562 5.40137 11.3996V12.1644C5.40137 12.3078 5.49696 12.4034 5.64035 12.4034H6.429C6.57239 12.4034 6.66799 12.3078 6.66799 12.1644V11.3996C6.66799 11.2562 6.57239 11.1606 6.429 11.1606Z" />
                            <path d="M8.9627 11.1606H8.17405C8.03066 11.1606 7.93506 11.2562 7.93506 11.3996V12.1644C7.93506 12.3078 8.03066 12.4034 8.17405 12.4034H8.9627C9.10609 12.4034 9.20168 12.3078 9.20168 12.1644V11.3996C9.20168 12.3078 9.10609 11.1606 8.9627 11.1606Z" />
                            <path d="M11.4963 11.1606H10.7077C10.5643 11.1606 10.4687 11.2562 10.4687 11.3996V12.1644C10.4687 12.3078 10.5643 12.4034 10.7077 12.4034H11.4963C11.6397 12.4034 11.7353 12.3078 11.7353 12.1644V11.3996C11.7353 11.2562 11.6397 11.1606 11.4963 11.1606Z" />
                            <path d="M13.2341 2.57715H12.0229V1.31039C12.0229 1.0998 11.8533 0.930176 11.6427 0.930176C11.4321 0.930176 11.2625 1.0998 11.2625 1.31039V2.57715H3.89531V1.31039C3.89531 1.0998 3.72568 0.930176 3.51509 0.930176C3.30451 0.930176 3.13488 1.0998 3.13488 1.31039V2.57715H1.92371C1.29796 2.57715 0.787109 3.088 0.787109 3.71375V13.4046C0.787109 14.0303 1.29796 14.5412 1.92371 14.5412H13.2341C13.8598 14.5412 14.3707 14.0303 14.3707 13.4046V3.71375C14.3707 3.088 13.8598 2.57715 13.2341 2.57715ZM13.6103 13.4046C13.6103 13.6152 13.4407 13.7848 13.2301 13.7848H1.92371C1.71313 13.7848 1.5435 13.6152 1.5435 13.4046V5.99958H13.6103V13.4046ZM13.6103 5.24374H1.5435V3.71375C1.5435 3.50317 1.71313 3.33354 1.92371 3.33354H3.13488V4.22113C3.13488 4.43172 3.30451 4.60135 3.51509 4.60135C3.72568 4.60135 3.89531 4.43172 3.89531 4.22113V3.33354H11.2625V4.22113C11.2625 4.43172 11.4321 4.60135 11.6427 4.60135C11.8533 4.60135 12.0229 4.43172 12.0229 4.22113V3.33354H13.2341C13.4447 3.33354 13.6143 3.50317 13.6143 3.71375V5.24374H13.6103Z" />
                          </svg>
                        </span>
                        {new Date(post.publishDate).toLocaleDateString(locale)}
                      </p>
                    </div>
                  </div>
                  <div className="mb-5">
                    <div className="flex flex-wrap">
                      {post.tags[locale]?.map((tag, index) => (
                        <TagButton key={index} text={tag} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* ヒーロー画像 */}
                <div className="mb-10">
                  <div className="relative h-[400px] w-full overflow-hidden rounded-md">
                    <Image
                      src={post.heroImage}
                      alt={post.title[locale]}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* 記事内容 */}
                <BlogContent 
                  content={post.content[locale]}
                  postSlug={slug}
                  locale={locale}
                />

                {/* タグとシェアボタン */}
                <div className="border-body-color/10 mt-12 flex flex-wrap items-center justify-between border-t pt-8 dark:border-white/10">
                  <div className="flex flex-wrap">
                    {post.tags[locale]?.map((tag, index) => (
                      <TagButton key={index} text={tag} />
                    ))}
                  </div>
                  <div className="mb-5">
                    <h5 className="text-body-color dark:text-body-color-dark mb-3 text-sm font-medium sm:text-right">
                      {t('shareThisPost')} :
                    </h5>
                    <div className="flex items-center sm:justify-end">
                      <SharePost />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full px-4 lg:w-4/12">
              {/* Authorボックス */}
              <div className="shadow-three dark:bg-gray-dark rounded-sm bg-white p-6 dark:shadow-none mb-8">
                <div>
                  <h3 className="border-body-color border-opacity-10 dark:border-opacity-10 border-b pb-4 text-lg font-semibold text-black dark:border-white dark:text-white">
                    Author
                  </h3>
                  <div className="flex items-center py-4">
                    <div className="mr-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-full">
                        <Image src={post.author.image} alt="author" fill />
                      </div>
                    </div>
                    <div className="w-full">
                      <h4 className="text-body-color dark:text-body-color-dark mb-1 text-base font-medium">
                        <span className="text-primary">{post.author.name[locale]}</span>
                      </h4>
                      <p className="text-body-color dark:text-body-color-dark text-sm">
                        {post.author.designation[locale]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ニュースレター購読ボックス */}
              <div className="shadow-three dark:bg-gray-dark rounded-sm bg-white dark:shadow-none">
                <NewsLatterBox locale={locale as Locale} />
              </div>
            </div>
          </div>
        </div>
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
      </section>

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

export default BlogDetailsPage;
