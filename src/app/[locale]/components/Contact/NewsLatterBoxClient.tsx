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
    <div
      className="wow fadeInUp relative z-10 rounded-md bg-white/80 backdrop-blur-sm p-8 shadow-one dark:bg-gray-dark/80 lg:px-5 xl:px-8"
      data-wow-delay=".15s"
    >
      <h3 className="mb-4 text-2xl font-bold text-body-color dark:text-body-color-dark">
        {title}
      </h3>
      <p className="mb-9 text-base font-medium leading-relaxed text-body-color/80 dark:text-body-color-dark/80">
        {paragraph}
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder={namePlaceholder}
          value={name}
          onChange={e => setName(e.target.value)}
          className="border-stroke mb-4 w-full rounded-md border border-transparent bg-white/50 backdrop-blur-sm px-6 py-3 text-base text-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:border-transparent dark:bg-gray-dark dark:text-body-color-dark dark:placeholder-white dark:shadow-signUp"
        />
        <input
          type="email"
          name="email"
          placeholder={emailPlaceholder}
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border-stroke mb-4 w-full rounded-md border border-transparent bg-white/50 backdrop-blur-sm px-6 py-3 text-base text-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:border-transparent dark:bg-gray-dark/50 dark:text-body-color-dark dark:placeholder-white dark:shadow-signUp"
        />
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-md bg-primary px-9 py-4 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
        >
          {subscribe}
        </button>
      </form>
      <p className="text-body-color/80 mt-4 text-center text-base font-medium dark:text-body-color-dark/80">
        {noSpam}
      </p>
      {submitted && (
        <p className="text-green-600 text-center mt-2">Thank you for subscribing!</p>
      )}
      <div>
        <span className="absolute right-0 top-7 z-[-1]">
          <svg
            width="77"
            height="172"
            viewBox="0 0 77 172"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="86"
              cy="86"
              r="86"
              fill="url(#paint0_linear)"
            />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="86"
                y1="0"
                x2="86"
                y2="172"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--color-primary)" stopOpacity="0.09" />
                <stop offset="1" stopColor="#C4C4C4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="absolute right-4 top-4 z-[-1]">
          <svg
            width="41"
            height="89"
            viewBox="0 0 41 89"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="38.9138"
              cy="87.4849"
              r="1.42021"
              transform="rotate(180 38.9138 87.4849)"
              fill="var(--color-primary)"
            />
            <circle
              cx="38.9138"
              cy="74.9871"
              r="1.42021"
              transform="rotate(180 38.9138 74.9871)"
              fill="var(--color-primary)"
            />
            <circle
              cx="38.9138"
              cy="62.4892"
              r="1.42021"
              transform="rotate(180 38.9138 62.4892)"
              fill="var(--color-primary)"
            />
            <circle
              cx="38.9138"
              cy="38.3457"
              r="1.42021"
              transform="rotate(180 38.9138 38.3457)"
              fill="var(--color-primary)"
            />
            <circle
              cx="38.9138"
              cy="13.634"
              r="1.42021"
              transform="rotate(180 38.9138 13.634)"
              fill="var(--color-primary)"
            />
            <circle
              cx="38.9138"
              cy="50.2754"
              r="1.42021"
              transform="rotate(180 38.9138 50.2754)"
              fill="var(--color-primary)"
            />
            <circle
              cx="38.9138"
              cy="26.1319"
              r="1.42021"
              transform="rotate(180 38.9138 26.1319)"
              fill="var(--color-primary)"
            />
            <circle
              cx="38.9138"
              cy="1.42021"
              r="1.42021"
              transform="rotate(180 38.9138 1.42021)"
              fill="var(--color-primary)"
            />
            <circle
              cx="26.4157"
              cy="87.4849"
              r="1.42021"
              transform="rotate(180 26.4157 87.4849)"
              fill="var(--color-primary)"
            />
            <circle
              cx="26.4157"
              cy="74.9871"
              r="1.42021"
              transform="rotate(180 26.4157 74.9871)"
              fill="var(--color-primary)"
            />
            <circle
              cx="26.4157"
              cy="62.4892"
              r="1.42021"
              transform="rotate(180 26.4157 62.4892)"
              fill="var(--color-primary)"
            />
            <circle
              cx="26.4157"
              cy="38.3457"
              r="1.42021"
              transform="rotate(180 26.4157 38.3457)"
              fill="var(--color-primary)"
            />
            <circle
              cx="26.4157"
              cy="13.634"
              r="1.42021"
              transform="rotate(180 26.4157 13.634)"
              fill="var(--color-primary)"
            />
            <circle
              cx="26.4157"
              cy="50.2754"
              r="1.42021"
              transform="rotate(180 26.4157 50.2754)"
              fill="var(--color-primary)"
            />
            <circle
              cx="26.4157"
              cy="26.1319"
              r="1.42021"
              transform="rotate(180 26.4157 26.1319)"
              fill="var(--color-primary)"
            />
            <circle
              cx="26.4157"
              cy="1.4202"
              r="1.42021"
              transform="rotate(180 26.4157 1.4202)"
              fill="var(--color-primary)"
            />
            <circle
              cx="13.9177"
              cy="87.4849"
              r="1.42021"
              transform="rotate(180 13.9177 87.4849)"
              fill="var(--color-primary)"
            />
            <circle
              cx="13.9177"
              cy="74.9871"
              r="1.42021"
              transform="rotate(180 13.9177 74.9871)"
              fill="var(--color-primary)"
            />
            <circle
              cx="13.9177"
              cy="62.4892"
              r="1.42021"
              transform="rotate(180 13.9177 62.4892)"
              fill="var(--color-primary)"
            />
            <circle
              cx="13.9177"
              cy="38.3457"
              r="1.42021"
              transform="rotate(180 13.9177 38.3457)"
              fill="var(--color-primary)"
            />
            <circle
              cx="13.9177"
              cy="13.634"
              r="1.42021"
              transform="rotate(180 13.9177 13.634)"
              fill="var(--color-primary)"
            />
            <circle
              cx="13.9177"
              cy="50.2754"
              r="1.42021"
              transform="rotate(180 13.9177 50.2754)"
              fill="var(--color-primary)"
            />
            <circle
              cx="13.9177"
              cy="26.1319"
              r="1.42021"
              transform="rotate(180 13.9177 26.1319)"
              fill="var(--color-primary)"
            />
            <circle
              cx="13.9177"
              cy="1.42019"
              r="1.42021"
              transform="rotate(180 13.9177 1.42019)"
              fill="var(--color-primary)"
            />
            <circle
              cx="1.41963"
              cy="87.4849"
              r="1.42021"
              transform="rotate(180 1.41963 87.4849)"
              fill="var(--color-primary)"
            />
            <circle
              cx="1.41963"
              cy="74.9871"
              r="1.42021"
              transform="rotate(180 1.41963 74.9871)"
              fill="var(--color-primary)"
            />
            <circle
              cx="1.41963"
              cy="62.4892"
              r="1.42021"
              transform="rotate(180 1.41963 62.4892)"
              fill="var(--color-primary)"
            />
            <circle
              cx="1.41963"
              cy="38.3457"
              r="1.42021"
              transform="rotate(180 1.41963 38.3457)"
              fill="var(--color-primary)"
            />
            <circle
              cx="1.41963"
              cy="13.634"
              r="1.42021"
              transform="rotate(180 1.41963 13.634)"
              fill="var(--color-primary)"
            />
            <circle
              cx="1.41963"
              cy="50.2754"
              r="1.42021"
              transform="rotate(180 1.41963 50.2754)"
              fill="var(--color-primary)"
            />
            <circle
              cx="1.41963"
              cy="26.1319"
              r="1.42021"
              transform="rotate(180 1.41963 26.1319)"
              fill="var(--color-primary)"
            />
            <circle
              cx="1.41963"
              cy="1.4202"
              r="1.42021"
              transform="rotate(180 1.41963 1.4202)"
              fill="var(--color-primary)"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default NewsLatterBoxClient;