import { getTranslations } from "next-intl/server";
import NewsLatterBox from "./NewsLatterBox";

interface ContactProps {
  locale: string;
}

const Contact = async ({ locale }: ContactProps) => {
  const t = await getTranslations({ locale, namespace: "ContactPage" });
  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div
              className="wow fadeInUp mb-12 rounded-md bg-white/80 backdrop-blur-sm p-8 shadow-one dark:bg-gray-dark/80 lg:px-5 xl:px-8"
              data-wow-delay=".15s"
            >
              <h2 className="mb-3 text-2xl font-bold text-body-color dark:text-body-color-dark">
                {t("title")}
              </h2>
              <p className="mb-12 text-base font-medium leading-relaxed text-body-color/80 dark:text-body-color-dark/80">
                {t("paragraph")}
              </p>
              <form>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="name"
                        className="mb-3 block text-sm font-medium text-body-color dark:text-body-color-dark"
                      >
                        {t("form.nameLabel")}
                      </label>
                      <input
                        type="text"
                        placeholder={t("form.namePlaceholder")}
                        className="w-full rounded-md border border-transparent bg-white/50 backdrop-blur-sm px-6 py-3 text-base text-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-gray-dark dark:text-body-color-dark dark:placeholder-white dark:shadow-signUp"
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="email"
                        className="mb-3 block text-sm font-medium text-body-color dark:text-body-color-dark"
                      >
                        {t("form.emailLabel")}
                      </label>
                      <input
                        type="email"
                        placeholder={t("form.emailPlaceholder")}
                        className="w-full rounded-md border border-transparent bg-white/50 backdrop-blur-sm px-6 py-3 text-base text-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-gray-dark/50 dark:text-body-color-dark dark:placeholder-white dark:shadow-signUp"
                      />
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label
                        htmlFor="message"
                        className="mb-3 block text-sm font-medium text-body-color dark:text-body-color-dark"
                      >
                        {t("form.messageLabel")}
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        placeholder={t("form.messagePlaceholder")}
                        className="w-full rounded-md border border-transparent bg-white/50 backdrop-blur-sm px-6 py-3 text-base text-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-gray-dark/50 dark:text-body-color-dark dark:placeholder-white dark:shadow-signUp"
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <button className="rounded-md bg-primary px-9 py-4 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                      {t("form.submit")}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <NewsLatterBox locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
