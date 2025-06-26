import { IconType } from "react-icons";
import { BsArrowRight, BsArrowUpRight, BsBoxArrowUpRight } from "react-icons/bs";

interface Feature {
  icon: IconType;
  titleKey: string;
  paragraphKey: string;
}

export const featuresData: Feature[] = [
  {
    icon: BsArrowRight,
    titleKey: "feature1Title",
    paragraphKey: "feature1Paragraph",
  },
  {
    icon: BsArrowUpRight,
    titleKey: "feature2Title",
    paragraphKey: "feature2Paragraph",
  },
  {
    icon: BsBoxArrowUpRight,
    titleKey: "feature3Title",
    paragraphKey: "feature3Paragraph",
  },
];
