"use client";
import SectionTitle from "../Common/SectionTitle";
import OfferList from "./OfferList";
import PricingBox from "./PricingBox";
import React, { useState } from "react";

interface Plan {
  name: string;
  subtitle: string;
  offers: { text: string; status: "active" | "inactive" }[];
  priceMonthly: string;
  priceYearly: string;
  durationMonthly: string;
  durationYearly: string;
}

interface PricingClientProps {
  title: string;
  paragraph: string;
  monthlyLabel: string;
  yearlyLabel: string;
  plans: Plan[];
}

const PricingClient: React.FC<PricingClientProps> = ({
  title,
  paragraph,
  monthlyLabel,
  yearlyLabel,
  plans,
}) => {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title={title}
          paragraph={paragraph}
          center
          width="665px"
        />
        <div className="w-full">
          <div className="mb-8 flex justify-center md:mb-12 lg:mb-16">
            <span
              onClick={() => setIsMonthly(true)}
              className={`${
                isMonthly
                  ? "pointer-events-none text-primary"
                  : "text-dark dark:text-white"
              } mr-4 cursor-pointer text-base font-semibold`}
            >
              {monthlyLabel}
            </span>
            <div
              onClick={() => setIsMonthly(!isMonthly)}
              className="flex cursor-pointer items-center"
            >
              <div className="relative">
                <div className="h-5 w-14 rounded-full bg-[#1D2144] shadow-inner"></div>
                <div
                  className={`${
                    isMonthly ? "" : "translate-x-full"
                  } shadow-switch-1 absolute left-0 top-[-4px] flex h-7 w-7 items-center justify-center rounded-full bg-primary transition`}
                >
                  <span className="active h-4 w-4 rounded-full bg-white"></span>
                </div>
              </div>
            </div>
            <span
              onClick={() => setIsMonthly(false)}
              className={`${
                isMonthly
                  ? "text-dark dark:text-white"
                  : "pointer-events-none text-primary"
              } ml-4 cursor-pointer text-base font-semibold`}
            >
              {yearlyLabel}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, idx) => (
            <PricingBox
              key={plan.name}
              packageName={plan.name}
              price={isMonthly ? plan.priceMonthly : plan.priceYearly}
              duration={isMonthly ? plan.durationMonthly : plan.durationYearly}
              subtitle={plan.subtitle}
            >
              {plan.offers.map((offer, i) => (
                <OfferList key={i} text={offer.text} status={offer.status} />
              ))}
            </PricingBox>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 z-[-1]">{/* SVG省略 */}</div>
    </section>
  );
};

export default PricingClient; 