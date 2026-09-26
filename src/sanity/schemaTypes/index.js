import { carType } from "./car";
import { categoryType } from "./category";
import { testimonialType } from "./testimonial";
import { siteSettingsType } from "./siteSettings";
import { homePageType } from "./homePage";
import { legalPageType } from "./legalPage";

export const schema = {
  types: [carType, categoryType, testimonialType, siteSettingsType, homePageType, legalPageType],
};