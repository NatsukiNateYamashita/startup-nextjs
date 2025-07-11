import { IconType } from "react-icons";

interface SingleFeatureProps {
  feature: {
    icon: IconType;
    title: string;
    paragraph: string;
  };
}

const SingleFeature = ({ feature }: SingleFeatureProps) => {
  const { icon: Icon, title, paragraph } = feature;
  return (
    <div className="w-full">
      <div className="wow fadeInUp" data-wow-delay=".15s">
        <div className="mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-10 w-10" />
        </div>
        <h3 className="mb-5 text-xl font-bold text-body-color dark:text-body-color-dark sm:text-2xl lg:text-xl xl:text-2xl">
          {title}
        </h3>
        <p className="pr-[10px] text-base font-medium leading-relaxed text-body-color/80 dark:text-body-color-dark/80">
          {paragraph}
        </p>
      </div>
    </div>
  );
};

export default SingleFeature;
