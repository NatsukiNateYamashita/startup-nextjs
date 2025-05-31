"use client";
import { useTheme } from "next-themes";
import React, { useState } from "react";

interface NewsLatterBoxClientProps {
  title: string;
  paragraph: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  subscribe: string;
  noSpam: string;
}

const NewsLatterBoxClient: React.FC<NewsLatterBoxClientProps> = ({
  title,
  paragraph,
  namePlaceholder,
  emailPlaceholder,
  subscribe,
  noSpam,
}) => {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ここでAPI送信などを実装可能
    setSubmitted(true);
  };

  return (
    <div className="shadow-three dark:bg-gray-dark relative z-10 rounded-xs bg-white p-8 sm:p-11 lg:p-8 xl:p-11">
      <h3 className="mb-4 text-2xl leading-tight font-bold text-black dark:text-white">
        {title}
      </h3>
      <p className="border-body-color/25 text-body-color mb-11 border-b pb-11 text-base leading-relaxed dark:border-white/25">
        {paragraph}
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder={namePlaceholder}
          value={name}
          onChange={e => setName(e.target.value)}
          className="border-stroke text-body-color focus:border-primary dark:text-body-color-dark dark:shadow-two dark:focus:border-primary mb-4 w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
        />
        <input
          type="email"
          name="email"
          placeholder={emailPlaceholder}
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border-stroke text-body-color focus:border-primary dark:text-body-color-dark dark:shadow-two dark:focus:border-primary mb-4 w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
        />
        <input
          type="submit"
          value={subscribe}
          className="bg-primary shadow-submit hover:bg-primary/90 dark:shadow-submit-dark mb-5 flex w-full cursor-pointer items-center justify-center rounded-xs px-9 py-4 text-base font-medium text-white duration-300"
        />
        <p className="text-body-color dark:text-body-color-dark text-center text-base leading-relaxed">
          {noSpam}
        </p>
        {submitted && (
          <p className="text-green-600 text-center mt-2">Thank you for subscribing!</p>
        )}
      </form>
      {/* SVG装飾は省略。必要ならpropsで渡してもOK */}
    </div>
  );
};

export default NewsLatterBoxClient; 